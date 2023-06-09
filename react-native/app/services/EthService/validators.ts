import BigNumber from 'bignumber.js'
import '@ethersproject/shims'
import { getAddress } from 'ethers/lib/utils'
import {
  DEFAULT_ASSET_DECIMAL,
  GAS_LIMIT_LOWER_BOUND,
  GAS_LIMIT_UPPER_BOUND,
  GAS_PRICE_GWEI_LOWER_BOUND,
  GAS_PRICE_GWEI_UPPER_BOUND,
} from '@app/config'
import {
  bigNumGasPriceToViewableGwei,
  bigify,
  convertedToBaseUnit,
  gasStringsToMaxGasBN,
  gasStringsToMaxGasNumber,
} from '@app/utils'

export const isValidPositiveOrZeroInteger = (
  value: BigNumber | number | string,
) => isValidPositiveNumber(value) && isInteger(value)

export const isValidNonZeroInteger = (value: number | string) =>
  isValidPositiveOrZeroInteger(value) && isPositiveNonZeroNumber(value)

export const isValidPositiveNumber = (value: BigNumber | number | string) =>
  bigify(value).isFinite() && bigify(value).gte(0)

const isPositiveNonZeroNumber = (value: BigNumber | number | string) =>
  bigify(value).gt(0)

const isInteger = (value: BigNumber | number | string) =>
  bigify(value).isInteger()

export function isChecksumAddress(address: string): boolean {
  return address === getAddress(address)
}

export function isBurnAddress(address: string): boolean {
  return (
    address === '0x0000000000000000000000000000000000000000' ||
    address === '0x000000000000000000000000000000000000dead'
  )
}

export function isValidETHLikeAddress(
  address: string,
  isChecksumValid: boolean,
): boolean {
  const isValidMixedCase = isValidMixedCaseETHAddress(address)
  const isValidUpperOrLowerCase = isValidUpperOrLowerCaseETHAddress(address)
  if (!['0x', '0X'].includes(address.substring(0, 2))) {
    // Invalid if the address doesn't begin with '0x' or '0X'
    return false
  } else if (isValidMixedCase && !isValidUpperOrLowerCase && !isChecksumValid) {
    // Invalid if mixed case, but not checksummed.
    return false
  } else if (isValidMixedCase && !isValidUpperOrLowerCase && isChecksumValid) {
    // Valid if isMixedCaseAddress && checksum is valid
    return true
  } else if (isValidUpperOrLowerCase && !isValidMixedCase) {
    // Valid if isValidUpperOrLowercase eth address && checksum
    return true
  } else if (!isValidUpperOrLowerCase && !isValidMixedCase) {
    return false
  }
  // else return false
  return true
}

export const isValidETHRecipientAddress = (address: string) => {
  if (isValidMixedCaseETHAddress(address) && isChecksumAddress(address)) {
    // isMixedCase Address that is a valid checksum
    return { success: true }
  } else if (
    isValidMixedCaseETHAddress(address) &&
    !isChecksumAddress(address) &&
    isValidUpperOrLowerCaseETHAddress(address)
  ) {
    // Is a fully-uppercase or fully-lowercase address and is an invalid checksum
    return { success: true }
  } else if (
    isValidMixedCaseETHAddress(address) &&
    !isChecksumAddress(address) &&
    !isValidUpperOrLowerCaseETHAddress(address)
  ) {
    // Is not fully-uppercase or fully-lowercase address and is an invalid checksum
    return {
      success: false,
      name: 'ValidationError',
      message: 'Address checksum invalid.',
    }
  } else if (!isValidMixedCaseETHAddress(address)) {
    // Is an invalid ens name & an invalid mixed-case address.
    return {
      success: false,
      name: 'ValidationError',
      message: 'Invalid to address.',
    }
  }
  return { success: true }
}

export function isValidMixedCaseETHAddress(address: string) {
  return /^(0(x|X)[a-fA-F0-9]{40})$/.test(address)
}

export function isValidUpperOrLowerCaseETHAddress(address: string) {
  return /^(0(x|X)(([a-f0-9]{40})|([A-F0-9]{40})))$/.test(address)
}

export function isValidETHAddress(address: string): boolean {
  return isValidETHLikeAddress(address, isChecksumAddress(address))
}

export const isCreationAddress = (address: string): boolean =>
  address === '0x0' || address === '0x0000000000000000000000000000000000000000'

export function isValidHex(str: string): boolean {
  if (str === '') {
    return true
  }
  str =
    str.substring(0, 2) === '0x'
      ? str.substring(2).toUpperCase()
      : str.toUpperCase()
  const re = /^[0-9A-F]*$/g // Match 0 -> unlimited times, 0 being "0x" case
  return re.test(str)
}

export enum TxFeeResponseType {
  'Warning',
  'WarningUseLower',
  'ErrorHighTxFee',
  'ErrorVeryHighTxFee',
  'WarningHighBaseFee',
  'WarningVeryHighBaseFee',
  'None',
  'Invalid',
}
interface TxFeeResponse {
  type: TxFeeResponseType
  amount?: string
  fee?: string
}

const HIGH_BASE_FEE = 100
const VERY_HIGH_BASE_FEE = 200

export const validateTxFee = (
  amount: string,
  assetRateUSD: number,
  assetRateFiat: number,
  isERC20: boolean,
  gasLimit: string,
  gasPrice: string,
  ethAssetRate?: number,
  baseFee?: BigNumber,
): TxFeeResponse => {
  const humanReadableBaseFee =
    baseFee && bigify(bigNumGasPriceToViewableGwei(baseFee))

  if (humanReadableBaseFee && humanReadableBaseFee.gt(VERY_HIGH_BASE_FEE)) {
    return { type: TxFeeResponseType.WarningVeryHighBaseFee }
  } else if (humanReadableBaseFee && humanReadableBaseFee.gt(HIGH_BASE_FEE)) {
    return { type: TxFeeResponseType.WarningHighBaseFee }
  }

  const validInputRegex = /^[0-9]+(\.[0-9])?[0-9]*$/
  if (
    !amount.match(validInputRegex) ||
    !gasLimit.match(validInputRegex) ||
    !gasPrice.match(validInputRegex)
  ) {
    return { type: TxFeeResponseType.Invalid }
  }

  const txAmount = bigify(amount)
  const txFee = gasStringsToMaxGasNumber(gasPrice, gasLimit)
  const txFeeFiatValue = bigify(assetRateUSD).multipliedBy(txFee)

  const createTxFeeResponse = (type: TxFeeResponseType) => {
    const txAmountFiatLocalValue = bigify(assetRateFiat).multipliedBy(txAmount)
    const txFeeFiatLocalValue = bigify(assetRateFiat).multipliedBy(txFee)
    return {
      type,
      amount: txAmountFiatLocalValue.toFixed(4),
      fee: txFeeFiatLocalValue.toFixed(4),
    }
  }
  const isGreaterThanEthFraction = (ethFraction: number) =>
    ethAssetRate && txFeeFiatValue.gt(ethAssetRate * ethFraction)

  // In case of fractions of amount being send
  if (txAmount.lt(0.000001)) {
    return createTxFeeResponse(TxFeeResponseType.None)
  }

  // More than 100$ OR 0.5 ETH
  if (txFeeFiatValue.gt(100) || isGreaterThanEthFraction(0.5)) {
    return createTxFeeResponse(TxFeeResponseType.ErrorVeryHighTxFee)
  }

  // More than 25$ OR 0.15 ETH
  if (txFeeFiatValue.gt(25) || isGreaterThanEthFraction(0.15)) {
    return createTxFeeResponse(TxFeeResponseType.ErrorHighTxFee)
  }

  // More than 15$ for ERC20 or 10$ for ETH
  if (txFeeFiatValue.gt(isERC20 ? 15 : 10)) {
    return createTxFeeResponse(TxFeeResponseType.WarningUseLower)
  }

  // Erc token where txFee is higher than amount
  if (!isERC20 && txAmount.lt(txFee)) {
    return createTxFeeResponse(TxFeeResponseType.Warning)
  }

  return createTxFeeResponse(TxFeeResponseType.None)
}

export const isTransactionFeeHigh = (
  amount: string,
  assetRate: number,
  isERC20: boolean,
  gasLimit: string,
  gasPrice: string,
) => {
  const validInputRegex = /^[0-9]+(\.[0-9])?[0-9]*$/
  if (
    !amount.match(validInputRegex) ||
    !gasLimit.match(validInputRegex) ||
    !gasPrice.match(validInputRegex)
  ) {
    return false
  }
  const amountBN = bigify(convertedToBaseUnit(amount, DEFAULT_ASSET_DECIMAL))
  if (amountBN.lt(convertedToBaseUnit('0.000001', DEFAULT_ASSET_DECIMAL))) {
    return false
  }
  const transactionFee = bigify(
    gasStringsToMaxGasBN(gasPrice, gasLimit).toString(),
  )
  const fiatValue = bigify(assetRate.toFixed(0)).multipliedBy(transactionFee)
  // For now transaction fees are too high if they are more than $10 fiat or more than the sent amount
  return (
    (!isERC20 && amountBN.lt(transactionFee)) ||
    fiatValue.gt(convertedToBaseUnit('10', DEFAULT_ASSET_DECIMAL))
  )
}

export const gasLimitValidator = (gasLimit: BigNumber | string) => {
  const gasLimitFloat = bigify(gasLimit)
  return (
    isValidPositiveOrZeroInteger(gasLimitFloat) &&
    gasLimitFloat.gte(GAS_LIMIT_LOWER_BOUND) &&
    gasLimitFloat.lte(GAS_LIMIT_UPPER_BOUND)
  )
}

function getLength(num: number | string | BigNumber | undefined) {
  return num !== undefined ? num.toString().length : 0
}

export const gasPriceValidator = (gasPrice: BigNumber | string): boolean => {
  const gasPriceFloat = bigify(gasPrice)
  const decimalLength: string = gasPriceFloat.toString().split('.')[1]
  return (
    isValidPositiveNumber(gasPriceFloat) &&
    gasPriceFloat.gte(GAS_PRICE_GWEI_LOWER_BOUND) &&
    gasPriceFloat.lte(GAS_PRICE_GWEI_UPPER_BOUND) &&
    getLength(decimalLength) <= 9
  )
}

export const isValidTxHash = (hash: string) =>
  hash.substring(0, 2) === '0x' && hash.length === 66 && isValidHex(hash)

export const isENSLabelHash = (stringToTest: string) =>
  /\[[a-fA-F0-9]{64}\]/.test(stringToTest)
