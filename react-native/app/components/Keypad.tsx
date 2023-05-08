import { colors } from '@app/styles/common'
import React from 'react'
import { StyleSheet } from 'react-native'

const buttonStyle = StyleSheet.create({
  button: {
    padding: '25px 5px',
    backgroundColor: colors.primaryBackground,
    color: colors.text,
    fontSize: '1.5rem',
    border: 'none',
  },
  row: {
    display: 'flex',
    padding: '25px',
    justifyContent: 'space-between',
  },
})

function Keypad() {
  return (
    <div>
      <div style={buttonStyle.row}>
        <button style={buttonStyle.button}>0</button>
        <button style={buttonStyle.button}>1</button>
        <button style={buttonStyle.button}>2</button>
      </div>
      <div style={buttonStyle.row}>
        <button style={buttonStyle.button}>3</button>
        <button style={buttonStyle.button}>4</button>
        <button style={buttonStyle.button}>5</button>
      </div>
      <div style={buttonStyle.row}>
        <button style={buttonStyle.button}>6</button>
        <button style={buttonStyle.button}>7</button>
        <button style={buttonStyle.button}>9</button>
      </div>
      <div style={buttonStyle.row}>
        <button style={buttonStyle.button}>.</button>
        <button style={buttonStyle.button}>0</button>
        <button style={buttonStyle.button}>=</button>
      </div>
    </div>
  )
}

export default Keypad
