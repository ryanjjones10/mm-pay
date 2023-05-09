import Keypad from '@app/components/Keypad'
import { Main } from '@app/components/layout/Main'
import { useAccounts } from '@app/services/AccountStore'
import { button, colors } from '@app/styles/common'
import { buildCreate2Address, saltToHex } from '@app/utils/create2'
import { formatCurrency } from '@app/utils/currency'
import { createDelegation } from '@app/utils/delegation'
import React, { useState } from 'react'
import { KeyboardAvoidingView, View, Text, Pressable } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { hexZeroPad, hexConcat } from '@ethersproject/bytes'
import { BigNumber } from '@ethersproject/bignumber'
import { LINEA_NETWORK_CONFIG } from '@app/constants'
import { ProviderHandler } from '@app/services'
import { Signer } from '@ethersproject/abstract-signer'

export const Send = () => {
  const { account } = useAccounts()
  const accountAddress = account?.address

  const [sendAmount, setSendAmount] = useState('0')

  const handleChange = (e) => {
    setSendAmount(e)
  }

  const createTargetSmartContractWalletAddress = () => {
    const saltHex = saltToHex(Math.random())
    const byteCode =
      '0x608060405234801561001057600080fd5b506101b3806100206000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c80639c4ae2d014610030575b600080fd5b6100f36004803603604081101561004657600080fd5b810190808035906020019064010000000081111561006357600080fd5b82018360208201111561007557600080fd5b8035906020019184600183028401116401000000008311171561009757600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290803590602001909291905050506100f5565b005b6000818351602085016000f59050803b61010e57600080fd5b7fb03c53b28e78a88e31607a27e1fa48234dce28d5d9d9ec7b295aeb02e674a1e18183604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a150505056fea265627a7a72315820d9c09b41b3c6591ba80cae0b1fbcba221c30c329fceb03a0352e0f93fb79893264736f6c63430005110032'
    const destinationWalletAddress = buildCreate2Address(
      accountAddress,
      saltHex,
      byteCode,
    )
    return { saltHex, destinationWalletAddress }
  }

  const handleCreateClaimLink = async () => {
    const { saltHex, destinationWalletAddress } =
      createTargetSmartContractWalletAddress()

    const rawTokenAmount = BigNumber.from(parseFloat(sendAmount) * 10 ** 6)

    const inputTerms = hexZeroPad(rawTokenAmount.toHexString(), 32)
    const termsWithSalt = hexConcat([inputTerms, saltHex])

    const caveats = [
      {
        enforcer: 'contractAllowanceEnforcerAddress',
        terms: termsWithSalt,
      },
    ]

    const method = 'eth_signTypedData_v4'

    let signature: any

    // const allowanceAmount = BigNumber.from(1000 * 10 ** 6)
    // if (!allowance || allowance.isZero() || allowance.lt(rawUSDCAmount)) {
    //   const sig = await getPermitSignature(
    //     signer.data,
    //     { address: contractUSDCAddress.address },
    //     contract.address,
    //     allowanceAmount,
    //     BigNumber.from(1990549033),
    //     'USD Coin (PoS)',
    //     permitNonce as BigNumber,
    //   )

    //   const approveTrxPopulated =
    //     await managerContract?.populateTransaction.approveTransferProxy(
    //       contractUSDCAddress.address,
    //       me as `0x${string}`,
    //       allowanceAmount,
    //       BigNumber.from(1990549033),
    //       sig.v,
    //       sig.r as `0x${string}`,
    //       sig.s as `0x${string}`,
    //     )
    //   signature = sig

    //   appUserUpdate({ allowanceTrx: approveTrxPopulated?.data })
    // }

    const delegation = createDelegation({
      destinationWalletAddress,
      verifyingContractAddress: 'test',
      caveats,
      chainId: LINEA_NETWORK_CONFIG.chainId,
    })
    // const provider = new ProviderHandler(LINEA_NETWORK_CONFIG)
    const signedDelegation = 'test'
    // await signer.data?.provider?.send(method, [
    //   accountAddress,
    //   delegation.string,
    // ])

    const claimLink = `https://pay.metamask.io/${signedDelegation}`
    console.log(saltHex, claimLink)
  }

  return (
    <Main>
      <KeyboardAvoidingView>
        <View style={{ height: '100%', width: '100%' }}>
          <View
            style={{
              display: 'flex',
              width: '100%',
              padding: 10,
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                color: colors.text,
                fontSize: 30,
                textAlign: 'center',
              }}
            >
              {sendAmount === '0'
                ? '$0'
                : formatCurrency(parseFloat(sendAmount)).toString()}
            </Text>
          </View>
          <View style={{ alignItems: 'baseline' }}>
            <Keypad current={sendAmount} onChange={handleChange} />
          </View>
          <Pressable onPress={handleCreateClaimLink}>
            <View
              style={{
                width: '100%',
                margin: 10,
                backgroundColor: colors.primaryBrand,
                justifyContent: 'center',
                display: 'flex',
                flexDirection: 'row',
                ...button,
              }}
            >
              <Icon
                name="magic"
                size={16}
                style={{
                  color: colors.text,
                  textAlign: 'center',
                }}
              />
              <Text
                style={{
                  color: colors.text,
                  fontWeight: '600',
                  textAlign: 'center',
                }}
              >
                Hold to create link
              </Text>
            </View>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Main>
  )
}

export default Send
