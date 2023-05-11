import { useSelector } from 'react-redux'

import {
  getClaim,
  createClaim as createClaimRedux,
  updateClaim as updateClaimRedux,
  destroyClaim as destroyClaimRedux,
} from '@app/services/Store/claims.slice'
import { useDispatch } from '@app/services/Store'
import { Claim } from '@app/types'

export interface IClaimContext {
  claim: Claim
  createClaim(claim: Claim): void
  updateClaim(claim: Claim): void
}

function useClaims() {
  const claim = useSelector(getClaim)
  const dispatch = useDispatch()
  const createClaim = (claim: Claim) => dispatch(createClaimRedux(claim))

  const updateClaim = (claim: Claim) => dispatch(updateClaimRedux(claim))

  const destroyClaim = () => dispatch(destroyClaimRedux())
  return {
    claim,
    createClaim,
    updateClaim,
    destroyClaim,
  }
}

export default useClaims
