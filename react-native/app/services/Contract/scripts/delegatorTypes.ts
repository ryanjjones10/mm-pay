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
  },
}
