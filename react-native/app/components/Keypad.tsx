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

function Keypad({ onChange }: { onChange: any }) {
  const handleChange = (value) => {
    onChange(value)
  }
  return (
    <div>
      <div style={buttonStyle.row}>
        <button style={buttonStyle.button} onClick={() => handleChange(1)}>
          1
        </button>
        <button style={buttonStyle.button} onClick={() => handleChange(2)}>
          2
        </button>
        <button style={buttonStyle.button} onClick={() => handleChange(3)}>
          3
        </button>
      </div>
      <div style={buttonStyle.row}>
        <button style={buttonStyle.button} onClick={() => handleChange(4)}>
          4
        </button>
        <button style={buttonStyle.button} onClick={() => handleChange(5)}>
          5
        </button>
        <button style={buttonStyle.button} onClick={() => handleChange(6)}>
          6
        </button>
      </div>
      <div style={buttonStyle.row}>
        <button style={buttonStyle.button} onClick={() => handleChange(7)}>
          7
        </button>
        <button style={buttonStyle.button} onClick={() => handleChange(8)}>
          8
        </button>
        <button style={buttonStyle.button} onClick={() => handleChange(9)}>
          9
        </button>
      </div>
      <div style={buttonStyle.row}>
        <button style={buttonStyle.button} onClick={() => handleChange('.')}>
          .
        </button>
        <button style={buttonStyle.button} onClick={() => handleChange(0)}>
          0
        </button>
        <button style={buttonStyle.button} onClick={() => handleChange(0)}>
          =
        </button>
      </div>
    </div>
  )
}

export default Keypad
