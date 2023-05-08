import { Main } from '@app/components/layout/Main'
import { colors } from '@app/styles/common'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Text, Clipboard, Share, Alert, View } from 'react-native'
import Button from '@app/components/ui/Button'

function ClaimLink() {
  const linkUUID = '14308sDf3C'
  const claimLink = `pay.metamask.io/${linkUUID}`

  const copyToClipboard = () => {
    Clipboard.setString(claimLink)
  }

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: claimLink,
      })
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      Alert.alert(error.message)
    }
  }

  return (
    <Main>
      <View
        style={{
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <Icon
              name="check-circle"
              size={20}
              style={{ color: colors.success, marginRight: 10 }}
            />
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={{ color: colors.success, fontWeight: '600' }}>
              Heres the link!
            </Text>
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <Text style={{ color: colors.text }}>{claimLink}</Text>
        </View>
        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: 20,
            flexDirection: 'row',
          }}
        >
          <Button variant="secondary" onClick={copyToClipboard}>
            <View style={{ margin: 10, display: 'flex', flexDirection: 'row' }}>
              <Icon
                name="copy"
                size={15}
                style={{ color: colors.primaryBrand }}
              />
              <Text style={{ marginLeft: 7, color: colors.text }}>Copy</Text>
            </View>
          </Button>
          <Button onClick={handleShare}>
            <View style={{ margin: 10, display: 'flex', flexDirection: 'row' }}>
              <Icon
                name="share-square-o"
                size={15}
                style={{ color: colors.text }}
              />
              <Text style={{ marginLeft: 7, color: colors.text }}>Share</Text>
            </View>
          </Button>
        </View>
      </View>
    </Main>
  )
}

export default ClaimLink
