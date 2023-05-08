import React, { ReactElement } from 'react'
import { View } from 'react-native'

function Section({ children }: { children: ReactElement }) {
  return <View style={{ marginTop: 20, marginBottom: 20 }}>{children}</View>
}

export default Section
