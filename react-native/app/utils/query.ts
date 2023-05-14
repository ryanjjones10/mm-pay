import { getRawData } from '@app/constants/realmQuery'
import { ClaimStruct } from '@app/types/claim'

export const formatClaim = (claimString: string) => {
  return claimString
}

export const extractClaim = async (
  uuid: any,
): Promise<ClaimStruct | undefined> => {
  if (!uuid || typeof uuid !== 'string') return

  try {
    const claimObj = await getRawData(uuid)
    console.debug('[extractClaim]: ', claimObj)
    return claimObj
  } catch (e) {
    console.error('[extractClaim error]: ', e)
    return
  }
}
