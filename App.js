import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import {
  Login,
  Pinding,
  Signup,
  ForgetPassword,
  EnterCodeForResetPassword,
  NewPassword,
} from './src/screens/Auth';
import {SwitchControle, IntroSlider} from './src/screens';
import Tabs from './src/navigation/tabs';

const HomePagesTabs = createStackNavigator(
  {
    MainApp: {
      screen: Tabs,
    },
  },
  {
    initialRouteName: 'MainApp',
    headerMode: 'none',
  },
);

const Auth = createStackNavigator(
  {
    Login: {screen: Login},
    Pinding: {screen: Pinding},
    Signup: {screen: Signup},
    ForgetPassword: {screen: ForgetPassword},
    EnterCodeReset: {screen: EnterCodeForResetPassword},
    NewPassword: {screen: NewPassword},
  },

  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
  },
);

const IntroSliderPage = createStackNavigator(
  {
    IntroSlider: {screen: IntroSlider},
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
  },
);

const PendingStack = createSwitchNavigator({
  Pending: {screen: Pinding},
});

const AppSwitch = createSwitchNavigator({
  SwitchControle: {screen: SwitchControle},
});

export default createAppContainer(
  createSwitchNavigator({
    AppSwitch: AppSwitch,
    IntroSlider: IntroSliderPage,
    Auth: Auth,
    PendingStack: PendingStack,
    HomePages: HomePagesTabs,
  }),
);
