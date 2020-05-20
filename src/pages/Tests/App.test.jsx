import React from 'react';
// import { render } from '@testing-library/react';
import App from '../../App';
var jest = require('jest');

var firebasemock    = require('firebase-mock');

var mockauth = new firebasemock.MockAuthentication();
var mockdatabase = new firebasemock.MockFirebase();
var mockfirestore = new firebasemock.MockFirestore();
var mockstorage = new firebasemock.MockStorage();
var mockmessaging = new firebasemock.MockMessaging();
var mocksdk = new firebasemock.MockFirebaseSdk(
  // use null if your code does not use RTDB
  null,
  // use null if your code does not use AUTHENTICATION
  null,
  null,
  null,
  // use null if your code does not use MESSAGING
  () => {
    return mockmessaging;
  }
);
jest.mock('../../init-fcm.js', () => {
  return mocksdk;
});

it('App Runs', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
});
