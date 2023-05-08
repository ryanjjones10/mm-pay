import { Main } from '@app/components/layout/Main'
import { colors } from '@app/styles/common'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Text, Clipboard, Share, Alert } from 'react-native'
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
      <div
        style={{
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          verticalAlign: 'middle',
          marginTop: '150px',
        }}
      >
        <div style={{ color: colors.success }}>
          <div>
            <Icon
              name="check-circle"
              size={20}
              style={{ color: colors.success, marginRight: '10px' }}
            />
          </div>
          <div style={{ marginTop: '10px' }}>
            <Text style={{ color: colors.success, fontWeight: 600 }}>
              Heres the link!
            </Text>
          </div>
        </div>
        <div style={{ marginTop: '20px', color: colors.text }}>{claimLink}</div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: ' center',
            marginTop: '20px',
          }}
        >
          <Button
            style={{ margin: '0px 10px', display: 'flex' }}
            variant="secondary"
            onClick={copyToClipboard}
          >
            <div>
              <Icon
                name="copy"
                size={15}
                style={{ color: colors.primaryBrand }}
              />
              <span style={{ marginLeft: '7px' }}>Copy</span>
            </div>
          </Button>
          <Button
            style={{ margin: '0px 10px', display: 'flex' }}
            onClick={handleShare}
          >
            <div>
              <Icon
                name="share-square-o"
                size={15}
                style={{ color: colors.text }}
              />
              <span style={{ marginLeft: '7px' }}>Share</span>
            </div>
          </Button>
        </div>
      </div>
    </Main>
  )
}

export default ClaimLink
