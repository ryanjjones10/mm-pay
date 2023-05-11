export const DelegatorTypes = {
  primaryType: 'Delegation',
  domain: {
    name: 'DelegatorTest',
    version: '1',
  },

  entries: {
    delegate: 'address',
    caveat: 'Caveat',
    authority: 'SignedDelegation',
  },

  types: {
    EIP712Domain: [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' },
    ],

    // Generated types, delete before re-running codegen
    SignedDelegation: [
      { name: 'message', type: 'Delegation' },
      { name: 'signature', type: 'bytes' },
      { name: 'signer', type: 'address' },
    ],
    SignedBatch: [
      { name: 'message', type: 'Batch' },
      { name: 'signature', type: 'bytes' },
      { name: 'signer', type: 'address' },
    ],
    SignedMultisigParams: [
      { name: 'message', type: 'MultisigParams' },
      { name: 'signature', type: 'bytes' },
      { name: 'signer', type: 'address' },
    ],

    // Delegate core types
    Delegation: [
      { name: 'delegate', type: 'address' },
      { name: 'authority', type: 'bytes32' },
      { name: 'caveats', type: 'Caveat[]' },
      { name: 'salt', type: 'uint256' },
    ],
    Caveat: [
      { name: 'enforcer', type: 'address' },
      { name: 'terms', type: 'bytes' },
    ],

    // Delegator types
    MultisigParams: [
      { name: 'signers', type: 'address[]' },
      { name: 'threshold', type: 'uint256' },
    ],

    // Delegatable types
    Transaction: [
      { name: 'to', type: 'address' },
      { name: 'gasLimit', type: 'uint256' },
      { name: 'value', type: 'uint256' },
      { name: 'data', type: 'bytes' },
    ],
    ReplayProtection: [
      { name: 'nonce', type: 'uint' },
      { name: 'queue', type: 'uint' },
    ],
    Invocation: [
      { name: 'transaction', type: 'Transaction' },
      { name: 'authority', type: 'SignedDelegation[]' },
    ],
    Batch: [
      { name: 'invocations', type: 'Invocation[]' },
      { name: 'replayProtection', type: 'ReplayProtection' },
    ],
  },
}
