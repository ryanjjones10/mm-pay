import { UserOpStruct } from '@app/services/Contract/scripts/runOp'

export enum ClaimTo {
  ME = 1,
  OTHER = 2,
}

export interface ClaimStruct {
  contractAddress: string
  privateKey: string
  userOps: UserOpStruct[]
}

export interface OthersInvites {
  id: string
  to: ClaimTo.OTHER
  used: boolean
  data: ClaimStruct
}

export interface MyInvitations {
  id: string
  to: ClaimTo.ME
  used: boolean
  data: ClaimStruct
}

export type Claim = OthersInvites | MyInvitations

export type ClaimState = Record<string, Claim>
