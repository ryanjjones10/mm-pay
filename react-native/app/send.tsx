import React from 'react'
import { View, Text } from 'react-native'
import { testAddr } from './constants'
import { truncateAddress } from './utils'

const Send = () => {
  return (
    <View>
      <Text>Send</Text>
      <Text>{`To: ${truncateAddress(testAddr)}`}</Text>
    </View>
  )
}

export default Send
