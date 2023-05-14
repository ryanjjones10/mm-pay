import { getRawData } from '@app/constants/realmQuery'
import { ClaimStruct } from '@app/types/claim'
import { b64Decode } from './claim'

export const formatClaim = (claimString: string) => {
  return claimString
}

export const extractClaim = async (
  b64EncodedUUID: any,
): Promise<ClaimStruct | undefined> => {
  if (!b64EncodedUUID || typeof b64EncodedUUID !== 'string') return

  try {
    const claimObj = await getRawData(b64Decode(b64EncodedUUID))
    console.debug('[extractClaim]: ', claimObj)
    return claimObj
  } catch (e) {
    console.error('[extractClaim error]: ', e)
    return
  }
}
