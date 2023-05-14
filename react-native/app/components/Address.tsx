import React, { useEffect, useState } from 'react'
import * as Clipboard from 'expo-clipboard'
import { Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

import { truncate } from '@app/utils'
import { colors } from '@app/styles/common'

const Address = ({
  address,
  isCopyable,
}: {
  address: string
  isCopyable: boolean
}) => {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false)
      }, 2000)

      return () => clearTimeout(timeout)
    }
  }, [copied])
  const copyToClipboard = async (address: string) => {
    await Clipboard.setStringAsync(address)
  }

  const handleCopy = () => {
    copyToClipboard(address).then(() => setCopied(true))
  }
  //console.debug('[Address]: ', address)
  return (
    <View
      style={{
        width: '100%',
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
      }}
    >
      <Text
        style={{
          color: copied ? colors.secondaryText : colors.text,
          fontSize: 20,
          fontWeight: '400',
        }}
      >
        {truncate(address)}
      </Text>
      {isCopyable ? (
        <TouchableOpacity onPress={handleCopy}>
          <Icon
            name="copy"
            size={15}
            style={{
              marginLeft: 10,
              color: copied ? colors.secondaryText : colors.primaryBrand,
            }}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  )
}

export default Address
