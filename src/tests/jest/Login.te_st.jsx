import React from 'react'
import { IonCardTitle } from '@ionic/react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
import Login from '../../pages/Login'

var jest = require('jest')
jest.mock('../../init-fcm.js', () => {
  return {
    requestPermission: () => {
      return
    },
    onMessage: (callback) => {
      return
    },
    convertNotificationPayload: (payload) => {
      return {
        name: 'notification.title',
        description: 'notification.body',
        image: 'notification.icon'
        //  url : fcmOptions.link
      }
    },
    firebase: {
      auth: () => {
        return {
          getRedirectResult: () => {
            return Promise.resolve(true)
          }
        }
      }
    }
  }
})

describe('Login', () => {
  it('Login page renders correctly', () => {
    const login = shallow(<Login />)
    expect(login.find(IonCardTitle).text()).toEqual('Login to MADNet')

    // login.find("#email").simulate('change', { target: { value: "invalid-email.com" }})
    // login.find("#password").simulate('change', { target: { value: "wrong-password" }})
    // login.find("#login").simulate('click');
    // expect(login.state('message')).toBe("Please enter a valid email address.")

    // Creates a snapshot - it will fail if the structure is rendered wrong.
    const LoginJson = renderer.create(<Login />).toJSON()
    expect(LoginJson).toMatchSnapshot()
  })
})
