import { isNull } from 'lodash'
import {
  AbiCoder,
  arrayify,
  isHexString,
  keccak256,
  recoverPublicKey,
} from 'ethers/lib/utils'
import { Wallet } from '@ethersproject/wallet'

/**
 * Represents the version of `signTypedData` being used.
 *
 * V4 is based on EIP-712, and includes full support of arrays and recursive data structures.
 */
export enum SignTypedDataVersion {
  V4 = 'V4',
}

export type MessageTypeProperty = {
  name: string
  type: string
}

export type MessageTypes = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  EIP712Domain: MessageTypeProperty[]
  [additionalProperties: string]: MessageTypeProperty[]
}

/**
 * This is the message format used for `signTypeData`, for all versions
 * except `V1`.
 *
 * @template T - The custom types used by this message.
 * @property types - The custom types used by this message.
 * @property primaryType - The type of the message.
 * @property domain - Signing domain metadata. The signing domain is the intended context for the
 * signature (e.g. the dapp, protocol, etc. that it's intended for). This data is used to
 * construct the domain seperator of the message.
 * @property domain.name - The name of the signing domain.
 * @property domain.version - The current major version of the signing domain.
 * @property domain.chainId - The chain ID of the signing domain.
 * @property domain.verifyingContract - The address of the contract that can verify the signature.
 * @property domain.salt - A disambiguating salt for the protocol.
 * @property message - The message to be signed.
 */
export type TypedMessage<T extends MessageTypes> = {
  types: T
  primaryType: keyof T
  domain: {
    name?: string
    version?: string
    chainId?: number
    verifyingContract?: string
    salt?: ArrayBuffer
  }
  message: Record<string, unknown>
}

const arrToBufArr = (arr: string): Buffer => Buffer.from(arrayify(arr))

/**
 * Node's Buffer.from() method does not seem to buffer numbers correctly out of the box.
 * This helper method formats the number correct for Buffer.from to return correct buffer.
 *
 * @param num - The number to convert to buffer.
 * @returns The number in buffer form.
 */
export function numberToBuffer(num: number) {
  const hexVal = num.toString(16)
  const prepend = hexVal.length % 2 ? '0' : ''
  return Buffer.from(prepend + hexVal, 'hex')
}

export const TYPED_MESSAGE_SCHEMA = {
  type: 'object',
  properties: {
    types: {
      type: 'object',
      additionalProperties: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            type: { type: 'string' },
          },
          required: ['name', 'type'],
        },
      },
    },
    primaryType: { type: 'string' },
    domain: { type: 'object' },
    message: { type: 'object' },
  },
  required: ['types', 'primaryType', 'domain', 'message'],
}

/**
 * Validate that the given value is a valid version string.
 *
 * @param version - The version value to validate.
 * @param allowedVersions - A list of allowed versions. If omitted, all versions are assumed to be
 * allowed.
 */
function validateVersion(
  version: SignTypedDataVersion,
  allowedVersions?: SignTypedDataVersion[],
) {
  if (!Object.keys(SignTypedDataVersion).includes(version)) {
    throw new Error(`Invalid version: '${version}'`)
  } else if (allowedVersions && !allowedVersions.includes(version)) {
    throw new Error(
      `SignTypedDataVersion not allowed: '${version}'. Allowed versions are: ${allowedVersions.join(
        ', ',
      )}`,
    )
  }
}

/**
 * Encode a single field.
 *
 * @param types - All type definitions.
 * @param name - The name of the field to encode.
 * @param type - The type of the field being encoded.
 * @param value - The value to encode.
 * @param version - The EIP-712 version the encoding should comply with.
 * @returns Encoded representation of the field.
 */
function encodeField(
  types: Record<string, MessageTypeProperty[]>,
  name: string,
  type: string,
  // TODO: constrain type on `value`
  value: any,
  version: SignTypedDataVersion.V4,
): [type: string, value: Buffer | string] {
  validateVersion(version, [SignTypedDataVersion.V4])

  if (types[type] !== undefined) {
    return [
      'bytes32',
      // TODO: return Buffer, remove string from return type
      version === SignTypedDataVersion.V4 && value == null // eslint-disable-line no-eq-null
        ? '0x0000000000000000000000000000000000000000000000000000000000000000'
        : arrToBufArr(keccak256(encodeData(type, value, types, version))),
    ]
  }

  if (value === undefined) {
    throw new Error(`missing value for field ${name} of type ${type}`)
  }

  if (type === 'bytes') {
    if (typeof value === 'number') {
      value = numberToBuffer(value)
    } else if (isHexString(value)) {
      const prepend = value.length % 2 ? '0' : ''
      value = Buffer.from(prepend + (value as string).slice(2), 'hex')
    } else {
      value = Buffer.from(value, 'utf8')
    }
    return ['bytes32', arrToBufArr(keccak256(value))]
  }

  if (type === 'string') {
    if (typeof value === 'number') {
      value = numberToBuffer(value)
    } else {
      value = Buffer.from(value ?? '', 'utf8')
    }
    return ['bytes32', arrToBufArr(keccak256(value))]
  }

  if (type.endsWith(']')) {
    const parsedType = type.slice(0, type.lastIndexOf('['))
    const typeValuePairs = value.map((item) =>
      encodeField(types, name, parsedType, item, version),
    )
    const abi = new AbiCoder()
    return [
      'bytes32',
      arrToBufArr(
        keccak256(
          abi.encode(
            typeValuePairs.map(([t]) => t),
            typeValuePairs.map(([, v]) => v),
          ),
        ),
      ),
    ]
  }

  return [type, value]
}

/**
 * Encodes an object by encoding and concatenating each of its members.
 *
 * @param primaryType - The root type.
 * @param data - The object to encode.
 * @param types - Type definitions for all types included in the message.
 * @param version - The EIP-712 version the encoding should comply with.
 * @returns An encoded representation of an object.
 */
function encodeData(
  primaryType: string,
  data: Record<string, unknown>,
  types: Record<string, MessageTypeProperty[]>,
  version: SignTypedDataVersion.V4,
): Buffer {
  validateVersion(version, [SignTypedDataVersion.V4])

  const encodedTypes = ['bytes32']
  const encodedValues: (Buffer | string)[] = [hashType(primaryType, types)]

  for (const field of types[primaryType]) {
    const [type, value] = encodeField(
      types,
      field.name,
      field.type,
      data[field.name],
      version,
    )
    encodedTypes.push(type)
    encodedValues.push(value)
  }
  const abi = new AbiCoder()
  return Buffer.from(abi.encode(encodedTypes, encodedValues))
}

/**
 * Encodes the type of an object by encoding a comma delimited list of its members.
 *
 * @param primaryType - The root type to encode.
 * @param types - Type definitions for all types included in the message.
 * @returns An encoded representation of the primary type.
 */
function encodeType(
  primaryType: string,
  types: Record<string, MessageTypeProperty[]>,
): string {
  let result = ''
  const unsortedDeps = findTypeDependencies(primaryType, types)
  unsortedDeps.delete(primaryType)

  const deps = [primaryType, ...Array.from(unsortedDeps).sort()]
  for (const type of deps) {
    const children = types[type]
    if (!children) {
      throw new Error(`No type definition specified: ${type}`)
    }

    result += `${type}(${types[type]
      .map(({ name, type: t }) => `${t} ${name}`)
      .join(',')})`
  }

  return result
}

/**
 * Finds all types within a type definition object.
 *
 * @param primaryType - The root type.
 * @param types - Type definitions for all types included in the message.
 * @param results - The current set of accumulated types.
 * @returns The set of all types found in the type definition.
 */
function findTypeDependencies(
  primaryType: string,
  types: Record<string, MessageTypeProperty[]>,
  results: Set<string> = new Set(),
): Set<string> {
  if (typeof primaryType !== 'string') {
    throw new Error(
      `Invalid findTypeDependencies input ${JSON.stringify(primaryType)}`,
    )
  }
  const match = primaryType.match(/^\w*/u) as RegExpMatchArray
  ;[primaryType] = match
  if (results.has(primaryType) || types[primaryType] === undefined) {
    return results
  }

  results.add(primaryType)

  for (const field of types[primaryType]) {
    findTypeDependencies(field.type, types, results)
  }
  return results
}

/**
 * Hashes an object.
 *
 * @param primaryType - The root type.
 * @param data - The object to hash.
 * @param types - Type definitions for all types included in the message.
 * @param version - The EIP-712 version the encoding should comply with.
 * @returns The hash of the object.
 */
export function hashStruct(
  primaryType: string,
  data: Record<string, unknown>,
  types: Record<string, MessageTypeProperty[]>,
  version: SignTypedDataVersion.V4,
): Buffer {
  validateVersion(version, [SignTypedDataVersion.V4])

  const encoded = encodeData(primaryType, data, types, version)
  const hashed = keccak256(encoded)
  const buf = arrToBufArr(hashed)
  return buf
}

/**
 * Hashes the type of an object.
 *
 * @param primaryType - The root type to hash.
 * @param types - Type definitions for all types included in the message.
 * @returns The hash of the object type.
 */
function hashType(
  primaryType: string,
  types: Record<string, MessageTypeProperty[]>,
): Buffer {
  const encodedHashType = Buffer.from(encodeType(primaryType, types), 'utf-8')
  return arrToBufArr(keccak256(encodedHashType))
}

/**
 * Removes properties from a message object that are not defined per EIP-712.
 *
 * @param data - The typed message object.
 * @returns The typed message object with only allowed fields.
 */
function sanitizeData<T extends MessageTypes>(
  data: TypedMessage<T>,
): TypedMessage<T> {
  const sanitizedData: Partial<TypedMessage<T>> = {}
  for (const key in TYPED_MESSAGE_SCHEMA.properties) {
    if (data[key]) {
      sanitizedData[key] = data[key]
    }
  }

  if ('types' in sanitizedData) {
    // TODO: Fix types
    sanitizedData.types = { EIP712Domain: [], ...sanitizedData.types } as any
  }
  return sanitizedData as Required<TypedMessage<T>>
}

/**
 * Create a EIP-712 Domain Hash.
 * This hash is used at the top of the EIP-712 encoding.
 *
 * @param typedData - The typed message to hash.
 * @param version - The EIP-712 version the encoding should comply with.
 * @returns The hash of the domain object.
 */
function eip712DomainHash<T extends MessageTypes>(
  typedData: TypedMessage<T>,
  version: SignTypedDataVersion.V4,
): Buffer {
  validateVersion(version, [SignTypedDataVersion.V4])

  const sanitizedData = sanitizeData(typedData)
  const { domain } = sanitizedData
  const domainType = { EIP712Domain: sanitizedData.types.EIP712Domain }
  return hashStruct('EIP712Domain', domain, domainType, version)
}

/**
 * Hash a typed message according to EIP-712. The returned message starts with the EIP-712 prefix,
 * which is "1901", followed by the hash of the domain separator, then the data (if any).
 * The result is hashed again and returned.
 *
 * This function does not sign the message. The resulting hash must still be signed to create an
 * EIP-712 signature.
 *
 * @param typedData - The typed message to hash.
 * @param version - The EIP-712 version the encoding should comply with.
 * @returns The hash of the typed message.
 */
function eip712Hash<T extends MessageTypes>(
  typedData: TypedMessage<T>,
  version: SignTypedDataVersion.V4,
): Buffer {
  validateVersion(version, [SignTypedDataVersion.V4])

  const sanitizedData = sanitizeData(typedData)
  const parts = [Buffer.from('1901', 'hex')]
  parts.push(eip712DomainHash(typedData, version))

  if (sanitizedData.primaryType !== 'EIP712Domain') {
    parts.push(
      hashStruct(
        // TODO: Validate that this is a string, so this type cast can be removed.
        sanitizedData.primaryType as string,
        sanitizedData.message,
        sanitizedData.types,
        version,
      ),
    )
  }
  return arrToBufArr(keccak256(Buffer.concat(parts)))
}

/**
 * A collection of utility functions used for signing typed data.
 */
export const TypedDataUtils = {
  encodeData,
  encodeType,
  findTypeDependencies,
  hashStruct,
  hashType,
  sanitizeData,
  eip712Hash,
  eip712DomainHash,
}

/**
 * Sign typed data according to EIP-712. The signing differs based upon the `version`.
 *
 * V1 is based upon [an early version of EIP-712](https://github.com/ethereum/EIPs/pull/712/commits/21abe254fe0452d8583d5b132b1d7be87c0439ca)
 * that lacked some later security improvements, and should generally be neglected in favor of
 * later versions.
 *
 * V3 is based on [EIP-712](https://eips.ethereum.org/EIPS/eip-712), except that arrays and
 * recursive data structures are not supported.
 *
 * V4 is based on [EIP-712](https://eips.ethereum.org/EIPS/eip-712), and includes full support of
 * arrays and recursive data structures.
 *
 * @param options - The signing options.
 * @param options.privateKey - The private key to sign with.
 * @param options.data - The typed data to sign.
 * @param options.version - The signing version to use.
 * @returns The '0x'-prefixed hex encoded signature.
 */
export async function signTypedData<T extends MessageTypes>({
  privateKey,
  data,
  version,
}: {
  privateKey: Buffer
  data: TypedMessage<T>
  version: SignTypedDataVersion.V4
}): Promise<string> {
  validateVersion(version)
  if (isNull(data)) {
    throw new Error('Missing data parameter')
  } else if (isNull(privateKey)) {
    throw new Error('Missing private key parameter')
  }

  const messageHash = TypedDataUtils.eip712Hash(
    data as TypedMessage<T>,
    SignTypedDataVersion.V4,
  )
  const signer = new Wallet(privateKey)
  return await signer.signMessage(messageHash).then((d) => d)
}

/**
 * Recover the address of the account that created the given EIP-712
 * signature. The version provided must match the version used to
 * create the signature.
 *
 * @param options - The signature recovery options.
 * @param options.data - The typed data that was signed.
 * @param options.signature - The '0x-prefixed hex encoded message signature.
 * @param options.version - The signing version to use.
 * @returns The '0x'-prefixed hex address of the signer.
 */
export function recoverTypedSignature<T extends MessageTypes>({
  data,
  signature,
  version,
}: {
  data: TypedMessage<T>
  signature: string
  version: SignTypedDataVersion.V4
}): string {
  validateVersion(version)
  if (isNull(data)) {
    throw new Error('Missing data parameter')
  } else if (isNull(signature)) {
    throw new Error('Missing signature parameter')
  }

  const messageHash = TypedDataUtils.eip712Hash(
    data as TypedMessage<T>,
    version,
  )
  const publicKey = recoverPublicKey(messageHash, signature)
  return publicKey
}
