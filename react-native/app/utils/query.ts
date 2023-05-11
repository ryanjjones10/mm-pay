import { Claim } from '@app/types'
import { b64Decode } from './claim'

export const formatClaim = (claimString: string) => {
  return claimString
}

export const extractClaim = (token: any): Claim | undefined => {
  if (!token || typeof token !== 'string') return
  try {
    return JSON.parse(b64Decode(token))
  } catch {
    return
  }
}
