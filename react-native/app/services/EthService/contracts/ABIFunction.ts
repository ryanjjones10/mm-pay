import BigNumber from 'bignumber.js'
import BN from 'bn.js'
import { Buffer } from 'buffer'
import 'react-native-get-random-values'
import '@ethersproject/shims'

import { AbiCoder } from '@ethersproject/abi'
import { keccak256 } from '@ethersproject/keccak256'
import { getAddress } from 'ethers/lib/utils'

import { addHexPrefix, stripHexPrefix } from '@app/utils'

import {
  FuncParams,
  FunctionOutputMappings,
  Input,
  ISuppliedArgs,
  ITypeMapping,
  Output,
} from './types'

const elementaryName = (name) => {
  if (name.startsWith('int[')) {
    return 'int256' + name.slice(3)
  } else if (name === 'int') {
    return 'int256'
  } else if (name.startsWith('uint[')) {
    return 'uint256' + name.slice(4)
  } else if (name === 'uint') {
    return 'uint256'
  } else if (name.startsWith('fixed[')) {
    return 'fixed128x128' + name.slice(5)
  } else if (name === 'fixed') {
    return 'fixed128x128'
  } else if (name.startsWith('ufixed[')) {
    return 'ufixed128x128' + name.slice(6)
  } else if (name === 'ufixed') {
    return 'ufixed128x128'
  }
  return name
}

export class AbiFunction {
  public constant: boolean
  public outputs: Output[]
  public inputs: Input[]
  private funcParams: FuncParams
  private inputNames: string[]
  private inputTypes: string[]
  private outputNames: string[]
  private outputTypes: string[]
  private methodSelector: string
  private name: string

  constructor(abiFunc: any, outputMappings: FunctionOutputMappings) {
    Object.assign(this, abiFunc)
    this.init(outputMappings)
  }

  public encodeInput = (suppliedInputs: TObject = {}) => {
    const args = this.processSuppliedArgs(suppliedInputs)
    const encodedCall = this.makeEncodedFuncCall(args)

    return encodedCall
  }

  public decodeInput = (argString: string) => {
    const abi = new AbiCoder()
    // Remove method selector from data, if present
    argString = argString.replace(addHexPrefix(this.methodSelector), '')
    // Convert argdata to a hex buffer for ethereumjs-abi
    const argBuffer = Buffer.from(argString, 'hex')
    // Decode!
    const argArr = abi.decode(this.inputTypes, argBuffer)
    //@todo: parse checksummed addresses
    return argArr.reduce((argObj, currArg, index) => {
      const currName = this.inputNames[index]
      const currType = this.inputTypes[index]
      return {
        ...argObj,
        [currName]: this.parsePostDecodedValue(currType, currArg),
      }
    }, {})
  }

  public decodeOutput = (argString: string) => {
    const abi = new AbiCoder()
    // Remove method selector from data, if present
    argString = argString.replace(this.methodSelector, '')

    // Remove 0x prefix
    argString = argString.replace('0x', '')

    // Convert argdata to a hex buffer for ethereumjs-abi
    const argBuffer = Buffer.from(argString, 'hex')
    // Decode!
    const argArr = abi.decode(this.outputTypes, argBuffer)

    //@todo: parse checksummed addresses
    return argArr.reduce((argObj, currArg, index) => {
      const currName = this.outputNames[index]
      const currType = this.outputTypes[index]
      return {
        ...argObj,
        [currName]: this.parsePostDecodedValue(currType, currArg),
      }
    }, {})
  }

  private getMethodId = (name: string, types: string[]) => {
    const sig = name + '(' + types.map(elementaryName).join(',') + ')'
    return keccak256(Buffer.from(sig)).slice(0, 10)
  }

  private init(outputMappings: FunctionOutputMappings = []) {
    //@todo: do this in O(n)
    this.inputTypes = this.inputs.map(({ type }) => type)
    this.outputTypes = this.outputs.map(({ type }) => type)
    this.inputNames = this.inputs.map(({ name }, i) => name || `${i}`)
    this.outputNames = this.outputs.map(
      ({ name }, i) => outputMappings[i] || name || `${i}`,
    )
    this.funcParams = this.makeFuncParams()

    this.methodSelector = this.getMethodId(this.name, this.inputTypes)
  }

  private parsePostDecodedValue = (type: string, value: any) => {
    const valueMapping: ITypeMapping = {
      address: (val: any) => getAddress(val.toString(16)),
      'address[]': (val: any) =>
        val.map((x: any) => getAddress(x.toString(16))),
    }

    const mapppedType = valueMapping[type]

    return mapppedType
      ? mapppedType(value)
      : BN.isBN(value)
      ? value.toString()
      : value
  }

  private parsePreEncodedValue = (type: string, value: any) => {
    if (type === 'bytes') {
      return Buffer.from(stripHexPrefix(value), 'hex')
    }
    return BigNumber.isBigNumber(value) ? value.toString() : value
  }

  private makeFuncParams = () =>
    this.inputs.reduce((accumulator, _, idx) => {
      // use our properties over this.inputs since the names can be modified
      // if the input names are undefined
      const name = this.inputNames[idx]
      const type = this.inputTypes[idx]
      const inputHandler = (inputToParse: any) =>
        //@todo: introduce typechecking and typecasting mapping for inputs
        ({ name, type, value: this.parsePreEncodedValue(type, inputToParse) })

      return {
        ...accumulator,
        [name]: { processInput: inputHandler, type, name },
      }
    }, {})

  private makeEncodedFuncCall = (args: string[]) => {
    const abi = new AbiCoder()

    const encodedArgs = abi.encode(this.inputTypes, args)
    return `${this.methodSelector}${stripHexPrefix(encodedArgs)}`
  }

  private processSuppliedArgs = (suppliedArgs: ISuppliedArgs) =>
    this.inputNames.map((name) => {
      const type = this.funcParams[name].type
      //@todo: parse args based on type
      if (typeof suppliedArgs[name] === 'undefined') {
        throw Error(
          `Expected argument "${name}" of type "${type}" missing, suppliedArgs: ${JSON.stringify(
            suppliedArgs,
            null,
            2,
          )}`,
        )
      }
      const value = suppliedArgs[name]

      const processedArg = this.funcParams[name].processInput(value)

      return processedArg.value
    })
}
