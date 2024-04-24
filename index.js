/**
 * @format
 */
import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import UserContextProvider from './src/screens/Context/UserContext';

// AppRegistry.registerComponent(appName,
//      () => App
//      );
AppRegistry.registerComponent(
  appName,
  () => (props) => (
    <UserContextProvider>
      <App {...props} />
    </UserContextProvider>
  ),
  // () => App,
);
