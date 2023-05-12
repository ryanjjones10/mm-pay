import { useSelector } from 'react-redux'

import {
  getClaims,
  createClaim as createClaimRedux,
  updateClaim as updateClaimRedux,
  destroyClaim as destroyClaimRedux,
} from '@app/services/Store/claims.slice'
import { useDispatch } from '@app/services/Store'
import { Claim } from '@app/types'

export interface IClaimContext {
  claims: Claim[]
  createClaim(claim: Claim): void
  updateClaim(claim: Claim): void
}

function useClaims() {
  const claims = useSelector(getClaims)
  const dispatch = useDispatch()
  const createClaim = (claim: Claim) =>
    dispatch(createClaimRedux({ id: claim.id, claim }))

  const updateClaim = (claim: Claim) =>
    dispatch(updateClaimRedux({ id: claim.id, claim }))

  const destroyClaim = () => dispatch(destroyClaimRedux())
  return {
    claims,
    createClaim,
    updateClaim,
    destroyClaim,
  }
}

export default useClaims
