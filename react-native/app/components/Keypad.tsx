import { colors } from '@app/styles/common'
import React from 'react'
import { StyleSheet, View, Pressable, Text } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

const buttonStyle = StyleSheet.create({
  button: {
    padding: 25,
    backgroundColor: colors.primaryBackground,
    color: colors.text,
    fontSize: 24,
    border: 'none',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    padding: 25,
    justifyContent: 'space-between',
    width: '100%',
  },
})

function Keypad({ onChange }: { onChange: any }) {
  const handleChange = (value) => {
    onChange(value)
  }
  return (
    <View>
      <View style={buttonStyle.row}>
        <Pressable style={buttonStyle.button} onPress={() => handleChange(1)}>
          <Text style={{ color: colors.text }}>1</Text>
        </Pressable>
        <Pressable style={buttonStyle.button} onPress={() => handleChange(2)}>
          <Text style={{ color: colors.text }}>2</Text>
        </Pressable>
        <Pressable style={buttonStyle.button} onPress={() => handleChange(3)}>
          <Text style={{ color: colors.text }}>3</Text>
        </Pressable>
      </View>
      <View style={buttonStyle.row}>
        <Pressable style={buttonStyle.button} onPress={() => handleChange(4)}>
          <Text style={{ color: colors.text }}>4</Text>
        </Pressable>
        <Pressable style={buttonStyle.button} onPress={() => handleChange(5)}>
          <Text style={{ color: colors.text }}>5</Text>
        </Pressable>
        <Pressable style={buttonStyle.button} onPress={() => handleChange(6)}>
          <Text style={{ color: colors.text }}>6</Text>
        </Pressable>
      </View>
      <View style={buttonStyle.row}>
        <Pressable style={buttonStyle.button} onPress={() => handleChange(7)}>
          <Text style={{ color: colors.text }}>7</Text>
        </Pressable>
        <Pressable style={buttonStyle.button} onPress={() => handleChange(8)}>
          <Text style={{ color: colors.text }}>8</Text>
        </Pressable>
        <Pressable style={buttonStyle.button} onPress={() => handleChange(9)}>
          <Text style={{ color: colors.text }}>9</Text>
        </Pressable>
      </View>
      <View style={buttonStyle.row}>
        <Pressable style={buttonStyle.button} onPress={() => handleChange('.')}>
          <Text style={{ color: colors.text }}>.</Text>
        </Pressable>
        <Pressable style={buttonStyle.button} onPress={() => handleChange(0)}>
          <Text style={{ color: colors.text }}>0</Text>
        </Pressable>
        <Pressable style={buttonStyle.button} onPress={() => handleChange(0)}>
          <Icon name="arrow-left" size={20} style={{ color: colors.text }} />
        </Pressable>
      </View>
    </View>
  )
}

export default Keypad
