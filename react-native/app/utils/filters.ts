import { isEmpty } from 'lodash'

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const isBoolean = (value: any): value is boolean =>
  typeof value === 'boolean'
export const isString = (value: any): value is string =>
  typeof value === 'string'
export const isNumber = (value: any): value is number =>
  typeof value === 'number'
export const isArray = <T>(value: any): value is Array<T> =>
  Array.isArray(value)
export const isObject = <T extends object>(value: any): value is T =>
  value != null && !Array.isArray(value) && typeof value === 'object'

export const isNil = (val: any) => {
  return val === null || val === undefined
}
export const isNotUndefined = (obj: any) => !!obj

export const isNotEmpty = (obj: any) => !isEmpty(obj)

export const EthereumAddressRegex = /^0x[a-fA-F0-9]{40}$/
export const EthereumTxHashRegex = /^0x[a-fA-F0-9]{64}$/
