import { colors } from '@app/styles/common'
import React from 'react'
import { StyleSheet, View, Pressable, Text } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

const buttonStyle = StyleSheet.create({
  button: {
    padding: 3,
    backgroundColor: colors.primaryBackground,
    color: colors.text,
    fontSize: 24,
    border: 'none',
    textAlign: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },
  buttonText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 18,
    textAlign: 'center',
    alignContent: 'center',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 35,
    paddingRight: 35,
    justifyContent: 'space-between',
    width: '100%',
  },
})

function Keypad({ current, onChange }: { current: string; onChange: any }) {
  const handleChange = (value) => {
    let newValue = value
    // handle backspace
    if (value === -1) {
      // handle backspace & 1 digit left
      if (current.length === 1) {
        newValue = '0'
      } else {
        newValue = current.slice(0, -1)
      }
    }
    // handle adding a digit
    else {
      // handle adding a digit when 0 is current value
      if (current === '0') {
        newValue = value.toString()
      } else {
        newValue = `${current}${value}`
      }
    }
    if (newValue === '') {
      onChange('0')
    }
    onChange(newValue)
  }
  return (
    <View>
      <View style={buttonStyle.row}>
        <Pressable style={buttonStyle.button} onPress={() => handleChange(1)}>
          <Text style={buttonStyle.buttonText}>1</Text>
        </Pressable>
        <Pressable style={buttonStyle.button} onPress={() => handleChange(2)}>
          <Text style={buttonStyle.buttonText}>2</Text>
        </Pressable>
        <Pressable style={buttonStyle.button} onPress={() => handleChange(3)}>
          <Text style={buttonStyle.buttonText}>3</Text>
        </Pressable>
      </View>
      <View style={buttonStyle.row}>
        <Pressable style={buttonStyle.button} onPress={() => handleChange(4)}>
          <Text style={buttonStyle.buttonText}>4</Text>
        </Pressable>
        <Pressable style={buttonStyle.button} onPress={() => handleChange(5)}>
          <Text style={buttonStyle.buttonText}>5</Text>
        </Pressable>
        <Pressable style={buttonStyle.button} onPress={() => handleChange(6)}>
          <Text style={buttonStyle.buttonText}>6</Text>
        </Pressable>
      </View>
      <View style={buttonStyle.row}>
        <Pressable style={buttonStyle.button} onPress={() => handleChange(7)}>
          <Text style={buttonStyle.buttonText}>7</Text>
        </Pressable>
        <Pressable style={buttonStyle.button} onPress={() => handleChange(8)}>
          <Text style={buttonStyle.buttonText}>8</Text>
        </Pressable>
        <Pressable style={buttonStyle.button} onPress={() => handleChange(9)}>
          <Text style={buttonStyle.buttonText}>9</Text>
        </Pressable>
      </View>
      <View style={buttonStyle.row}>
        <Pressable style={buttonStyle.button} onPress={() => handleChange('.')}>
          <Text style={buttonStyle.buttonText}>.</Text>
        </Pressable>
        <Pressable style={buttonStyle.button} onPress={() => handleChange(0)}>
          <Text style={buttonStyle.buttonText}>0</Text>
        </Pressable>
        <Pressable style={buttonStyle.button} onPress={() => handleChange(-1)}>
          <Icon name="arrow-left" size={15} style={buttonStyle.buttonText} />
        </Pressable>
      </View>
    </View>
  )
}

export default Keypad
