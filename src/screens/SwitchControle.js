import * as React from 'react';
import {
  Text,
  View,
  StatusBar,
  Image,
  NativeModules,
  ToastAndroid,
  Alert,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-community/async-storage';

import RNExitApp from 'react-native-exit-app';
import { AppRequired, FONTS, images } from '../constants';
// import NetInfo from '@react-native-community/netinfo';

import axios from 'axios';
// import {ActivityIndicator} from 'react-native-paper';

export default class SwitchControle extends React.Component {
  constructor() {
    super();
    this.state = {
      connection_Status: false,
    };
  }
  componentDidMount = async () => {
    try {
      const result = await NativeModules.EmulatorDetector.isEmulator();
      // console.log(result);
      // const screenResu = await NativeModules.PreventScreenshotModule.allow();
      // console.log(screenResu);
      // console.log(result == true || result == 'error');
      if (result == true || result == 'error') {
        RNExitApp.exitApp();
      } else {
        this.enterWithoutCheck();
        // this.checkNetwork();
      }
    } catch (e) {
      RNExitApp.exitApp();
    }
  };

  // checkNetwork() {
  //   const unsubscribe = NetInfo.addEventListener(async (state) => {
  //     if (state.isInternetReachable == true) {
  //       this.setState({
  //         connection_Status: state.isInternetReachable,
  //       });
  //       this.req_check();
  //     } else {
  //       this.setState({
  //         connection_Status: state.isInternetReachable,
  //       });
  //     }
  //   });
  // }

  req_check() {
    axios
      .get(AppRequired.Domain + 'authentication/check_entry.php')
      .then((res) => {
        if (res.status == 200) {
          if (res.data == '0') {
            this.enterWithoutCheck();
            // alert('0');
          } else {
            // alert('not 0');

            this.enterWithCheck();
          }
        }
      })
      .catch(() => {
        Alert.alert(
          AppRequired.appName,
          'حدث خطأ الرجاء غلق التطبيق وإعادة المحاولة',
        );
      });
  }

  async enterWithoutCheck() {
    let SwitchNavigation = await AsyncStorage.getItem('switch');
    setTimeout(() => {
      if (SwitchNavigation != null || SwitchNavigation != undefined) {
        if (SwitchNavigation == 'Auth') {
          this.props.navigation.navigate('Auth');
        } else if (SwitchNavigation == 'Home') {
          this.props.navigation.navigate('HomePages');
        } else if (SwitchNavigation == 'Pending') {
          this.props.navigation.navigate('PendingStack');
        }
      } else {
        this.props.navigation.navigate('IntroSlider');
      }
    }, 3000);
  }

  async enterWithCheck() {
    let SwitchNavigation = await AsyncStorage.getItem('switch');
    var allowCarrier = false;

    await DeviceInfo.getCarrier().then((carrier) => {
      let SIMCard = carrier.toLowerCase();
      if (
        SIMCard.includes('vodafone') ||
        SIMCard.includes('orange') ||
        SIMCard.includes('we') ||
        SIMCard.includes('etisalat') ||
        SIMCard.includes('mobinil')
      ) {
        allowCarrier = true;
      }
    });

    if (allowCarrier) {
      setTimeout(() => {
        if (SwitchNavigation != null || SwitchNavigation != undefined) {
          if (SwitchNavigation == 'Auth') {
            this.props.navigation.navigate('Auth');
          } else if (SwitchNavigation == 'Home') {
            this.props.navigation.navigate('HomePages');
          } else if (SwitchNavigation == 'Pending') {
            this.props.navigation.navigate('PendingStack');
          }
        } else {
          this.props.navigation.navigate('IntroSlider');
        }
      }, 4000);
    } else {
      RNExitApp.exitApp();
    }
  }

  render() {
    return (
      <View
        style={{
          backgroundColor: '#fff',
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <StatusBar backgroundColor="#fff" />
        <Image
          source={images.splash}
          style={{ width: '95%', height: 400, resizeMode: 'contain' }}
        />

        <Text
          style={{
            fontFamily: FONTS.fontFamily,
            fontSize: 18,
          }}>
          {AppRequired.splashSlogan}
        </Text>
      </View>
    );
  }
}
