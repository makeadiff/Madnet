import React from 'react'
import App from '../../App'
var jest = require('jest')

jest.mock('../../init-fcm.js', () => {
  return {}
})

it('App Runs', () => {
  shallow(<App />)
})
