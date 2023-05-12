import { ClaimStruct } from '@app/types/claim'
import { TestMap } from '@app/constants/testToken'

import { b64Decode } from './claim'

export const formatClaim = (claimString: string) => {
  return claimString
}

export const extractClaim = (token: any): ClaimStruct | undefined => {
  if (!token || typeof token !== 'string') return

  try {
    const claimString = b64Decode(token)
    console.debug('[extractClaim]: ', claimString, Object.keys(TestMap))
    const tokenId = TestMap[claimString]
    return JSON.parse(b64Decode(tokenId))
  } catch (e) {
    console.error('[extractClaim]: ', e)
    return
  }
}
