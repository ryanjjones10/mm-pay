import BigNumberJs from 'bignumber.js'
import { bigify } from './bigify'

export const convertToFiat = (
  userViewableBalance: BigNumberJs | string,
  rate = 1,
): BigNumberJs => {
  return bigify(userViewableBalance).multipliedBy(bigify(rate))
}
