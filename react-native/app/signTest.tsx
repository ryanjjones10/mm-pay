import { Main } from '@app/components/layout/Main';
import React, { useEffect } from 'react';
import { Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Button from './components/ui/Button';

let myAccount

const types = {
  EIP712Domain: [
    { name: 'name', type: 'string' },
    { name: 'version', type: 'string' },
    { name: 'chainId', type: 'uint256' },
    { name: 'verifyingContract', type: 'address' },
  ],
  Delegation: [
    { name: 'delegate', type: 'address' },
    { name: 'authority', type: 'bytes32' },
    { name: 'caveats', type: 'Caveat[]' },
  ],
  Caveat: [
    { name: 'enforcer', type: 'address' },
    { name: 'terms', type: 'bytes' },
  ],
  SignedDelegation: [
    { name: 'delegation', type: 'Delegation' },
    { name: 'signature', type: 'bytes' },
  ],
}

const delegation = {
  delegate: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045', // vitalik.eth
  authority: '0xA14FA3128b0EFdC3D8E0D3BDD6Cc539081DA17c3',
  caveats: [
    {
      // enforcer: '0x29c1412803FDb627938a182053839CBB888435c5',
      // terms: 'INSERT_CUSTOM_LOGIC',
    },
  ],
}

export default function SignTest() {
  useEffect(() => {
    window.ethereum &&
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((acc) => (myAccount = acc[0]))
  }, [])

  async function test1() {
    const msgParams = JSON.stringify({
      domain: {
        // Give a user friendly name to the specific contract you are signing for.
        name: 'MyName', // "MyName"
        // Just let's you know the latest version. Definitely make sure the field name is correct.
        version: '1', // "1"
        // Defining the chain aka Rinkeby testnet or Ethereum Main Net
        chainId: 1, // 1
        // If name isn't enough add verifying contract to make sure you are establishing contracts with the proper entity
        verifyingContract: '0x0000000000000000000000000000000000000000', // "0x0000000000000000000000000000000000000000",
      },

      // Defining the message signing data content.
      message: {
        /*
          - Anything you want. Just a JSON Blob that encodes the data you want to send
          - No required fields
          - This is DApp Specific
          - Be as explicit as possible when building out the message schema.
          */
        myValue: 123, // myValue: 123,
      },
      // Refers to the keys of the *types* object below.
      primaryType: 'Message',
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        // Refer to primaryType
        Message: [{ name: 'myValue', type: 'uint256' }], // [{ name: "myValue", type: "uint256" }],
      },
    })

    const signedDelegation = await window.ethereum.request({
      method: 'eth_signTypedData_v4',
      params: [myAccount, msgParams],
    })

    const intention = {
      replayProtection: {
        nonce: '0x01',
        queue: '0x01',
      },
      batch: [
        {
          authority: [
            {
              delegation: delegation,
              signature: signedDelegation,
            },
          ],
          transaction: {
            to: msgParams.verifyingContract,
            gasLimit: '10000000000000000',
            // data: tx,
          },
        },
      ],
    }

    const domain = {}

    const intentionString = JSON.stringify({
      domain: { ...domain, verifyingContract: msgParams.verifyingContract },
      message: intention,
      primaryType: 'Invocations',
      types: types,
    })

    const returnValue = {
      intention: intention,
      string: intentionString,
    }

    console.log('returnValue', returnValue)

    return returnValue
  }

  async function test2() {
    const eip712Data = JSON.stringify({
      domain: {
        name: 'DelegatableExample',
        version: '1',
        chainId: 1,
        verifyingContract: '0xA14FA3128b0EFdC3D8E0D3BDD6Cc539081DA17c3',
      },
      message: delegation,
      primaryType: 'Delegation',
      types: types,
    })

    const signedDelegation = await window.ethereum.request({
      method: 'eth_signTypedData_v4',
      params: [myAccount, eip712Data],
    })

    const intention = {
      replayProtection: {
        nonce: '0x01',
        queue: '0x01',
      },
      batch: [
        {
          authority: [
            {
              delegation: delegation,
              signature: signedDelegation,
            },
          ],
          transaction: {
            to: msgParams.verifyingContract,
            gasLimit: '10000000000000000',
            // data: tx,
          },
        },
      ],
    }

    const domain = {}

    const intentionString = JSON.stringify({
      domain: { ...domain, verifyingContract: msgParams.verifyingContract },
      message: intention,
      primaryType: 'Invocations',
      types: types,
    })

    const returnValue = {
      intention: intention,
      string: intentionString,
    }

    console.log('returnValue', returnValue)

    return returnValue
  }

  async function test3() {
    // eth_signTypedData_v4 parameters. All of these parameters affect the resulting signature.
    const msgParams = JSON.stringify({
      domain: {
        // This defines the network, in this case, Mainnet.
        chainId: 1,
        // Give a user-friendly name to the specific contract you're signing for.
        name: 'Ether Mail',
        // Add a verifying contract to make sure you're establishing contracts with the proper entity.
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
        // This identifies the latest version.
        version: '1',
      },

      // This defines the message you're proposing the user to sign, is dapp-specific, and contains
      // anything you want. There are no required fields. Be as explicit as possible when building out
      // the message schema.
      message: {
        contents: 'Hello, Bob!',
        attachedMoneyInEth: 4.2,
        from: {
          name: 'Cow',
          wallets: [
            '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
            '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF',
          ],
        },
        to: [
          {
            name: 'Bob',
            wallets: [
              '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
              '0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57',
              '0xB0B0b0b0b0b0B000000000000000000000000000',
            ],
          },
        ],
      },
      // This refers to the keys of the following types object.
      primaryType: 'Mail',
      types: {
        // This refers to the domain the contract is hosted on.
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        // Not an EIP712Domain definition.
        Group: [
          { name: 'name', type: 'string' },
          { name: 'members', type: 'Person[]' },
        ],
        // Refer to primaryType.
        Mail: [
          { name: 'from', type: 'Person' },
          { name: 'to', type: 'Person[]' },
          { name: 'contents', type: 'string' },
        ],
        // Not an EIP712Domain definition.
        Person: [
          { name: 'name', type: 'string' },
          { name: 'wallets', type: 'address[]' },
        ],
      },
    })

    // var from = await web3.eth.getAccounts();

    const params = [from[0], msgParams]
    const method = 'eth_signTypedData_v4'

    window.ethereum.currentProvider.sendAsync(
      {
        method,
        params,
        from: from[0],
      },
      function (err, result) {
        if (err) return console.dir(err)
        if (result.error) {
          alert(result.error.message)
        }
        if (result.error) return console.error('ERROR', result)
        console.log('TYPED SIGNED:' + JSON.stringify(result.result))

        const recovered = sigUtil.recoverTypedSignature_v4({
          data: JSON.parse(msgParams),
          sig: result.result,
        })

        if (
          ethUtil.toChecksumAddress(recovered) ===
          ethUtil.toChecksumAddress(from)
        ) {
          alert('Successfully recovered signer as ' + from)
        } else {
          alert(
            'Failed to verify signer when comparing ' + result + ' to ' + from,
          )
        }
      },
    )
  }

  return (
    <Main>
      <Button onClick={test1}>
        <Icon name="edit" size={15} />
        <Text>Test 1</Text>
      </Button>
      <Button onClick={test2}>
        <Icon name="edit" size={15} />
        <Text>Test 2</Text>
      </Button>
      <Button onClick={test3}>
        <Icon name="edit" size={15} />
        <Text>Test 3</Text>
      </Button>
    </Main>
  )
}
