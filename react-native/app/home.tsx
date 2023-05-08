import React from 'react'
import { Text } from 'react-native'
import { testAddr, testBalance } from './constants'
import { truncateAddress } from './utils'

const Home = () => {
  return (
    <>
      <Text>Home</Text>
      <Text>{`Address: ${truncateAddress(testAddr)}`}</Text>
      <Text>{`Balance: ${testBalance}`}</Text>
    </>
  )
}

export default Home
