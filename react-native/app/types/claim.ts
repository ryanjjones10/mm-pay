export enum ClaimTo {
  ME = 1,
  OTHER = 2,
}

export interface ClaimObject {
  contractAddress: string
  privateKey: string
}

export interface OthersInvites {
  id: string
  to: ClaimTo.OTHER
  used: boolean
  data: ClaimObject
}

export interface MyInvitations {
  id: string
  to: ClaimTo.ME
  used: boolean
  data: ClaimObject
}

export type Claim = OthersInvites | MyInvitations

export type ClaimState = Record<string, Claim>
