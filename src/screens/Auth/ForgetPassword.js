import React, {Component} from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  ToastAndroid,
} from 'react-native';
import {Spinner} from 'native-base';
import {Container} from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

import NetInfo from '@react-native-community/netinfo';

import {AppRequired, COLORS, FONTS} from '../../constants';

const {width, height} = Dimensions.get('window');

export default class Forgetpass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Email: '',
      loading: false,
      data: '',
      code: '',
      renderError: '',
      bottomConnectionMsg: new Animated.Value(-100),
      connection_Status: 'Offline',
    };
    this._subscription;
  }

  componentWillUnmount() {
    this._subscription && this._subscription();
  }
  componentDidMount() {
    // this.allowFunction();
    this._subscription = NetInfo.addEventListener(
      this._handelConnectionInfoChange,
    );
  }
  _handelConnectionInfoChange = (NetInfoState) => {
    if (NetInfoState.isConnected == true) {
      this.setState(({}) => ({
        connection_Status: 'Online',
      }));
      Animated.spring(this.state.bottomConnectionMsg, {
        toValue: -100,
      }).start();
    } else {
      this.setState(({}) => ({
        connection_Status: 'offline',
      }));
      Animated.spring(this.state.bottomConnectionMsg, {toValue: 0}).start();
    }
  };

  validate = (text) => {
    let reg = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      this.setState({Email: text});
      return false;
    } else {
      this.setState({Email: text});
      return true;
    }
  };

  loading() {
    if (this.state.loading) {
      return <Spinner color="white" />;
    } else {
      return (
        <Text
          style={{
            color: '#fff',
            fontSize: 20,
            alignSelf: 'center',
            fontFamily: FONTS.fontFamily,
          }}>
          ارسال
        </Text>
      );
    }
  }

  async sendEmailFun() {
    if (this.state.Email == '') {
      this.setState({renderError: 'من فضلك ادخل الايميل '});
    } else {
      if (this.validate(this.state.Email.trim()) == true) {
        this.setState({loading: true});

        let code = '';
        for (let i = 0; i < 6; i++) {
          let x = Math.floor(Math.random() * 10);
          code += x;
        }
        let student_token = await AsyncStorage.getItem('fcmToken');

        let dataToSend = {
          email: this.state.Email,
          code: code,
          student_token,
        };
        // console.log(dataToSend);
        if (this.state.connection_Status == 'Online') {
          // console.log(
          //   AppRequired.Domain + 'authentication/send_reset_code.php',
          // );
          axios
            .post(
              AppRequired.Domain + 'authentication/send_reset_code.php',
              dataToSend,
            )
            .then((res) => {
              this.setState({loading: false});
              // alert(res.data)
              if (res.data.trim() == 'emailSent') {
                this.props.navigation.navigate('EnterCodeReset', {
                  code: code,
                  email: this.state.Email,
                });
              } else if (res.data.trim() == 'not_found') {
                ToastAndroid.showWithGravityAndOffset(
                  'هذا المستخدم غير موجود',
                  ToastAndroid.LONG,
                  ToastAndroid.CENTER,
                  25,
                  50,
                );
              } else if (res.data.trim() == 'user_not_found') {
                ToastAndroid.showWithGravityAndOffset(
                  'هذا المستخدم غير موجود',
                  ToastAndroid.LONG,
                  ToastAndroid.CENTER,
                  25,
                  50,
                );
              } else {
                ToastAndroid.showWithGravityAndOffset(
                  'حدث خطأ ما الرجاء حاول مره اخرى',
                  ToastAndroid.LONG,
                  ToastAndroid.CENTER,
                  25,
                  50,
                );
              }
            });
        } else {
          this.setState({loading: false});
          ToastAndroid.showWithGravityAndOffset(
            'من فضلك تحقق من اتصالك بالأنترنت',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50,
          );
        }
      } else {
        this.setState({renderError: 'من فضلك ادخل ايميل صحيح'});
      }
    }
  }
  render() {
    const ViewConnectionMsg = (props) => {
      return (
        <Animated.View
          style={[
            styles.ConnectionView,
            {bottom: this.state.bottomConnectionMsg},
          ]}>
          <View>
            <Text style={{color: 'white'}}>{props.ConnectionEnter}</Text>
          </View>
        </Animated.View>
      );
    };
    return (
      <Container style={{backgroundColor: '#EFF1F0'}}>
        <ScrollView
          style={{
            width: '100%',
            height: '100%',
          }}>
          {/* ------------------------------ */}
          <View
            style={{
              height: height / 6,
              // backgroundColor: "#88848E",
              justifyContent: 'center',
              paddingHorizontal: height * 0.03,
              marginTop: height * 0.08,
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 28,
                fontFamily: FONTS.fontFamily,
              }}>
              هل نسيت كلمة السر؟{' '}
            </Text>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 16,
                fontFamily: FONTS.fontFamily,
              }}>
              لا تقلق بإمكانك إعادة ضبط كلمة السر بسهولة فقط أخبرنا بالبريد
              الإلكترونى
            </Text>
          </View>
          {/* ------------Textinput----------------- */}
          <View
            style={{
              width: '100%',
              height: height * 0.1,
              // backgroundColor: "blue",
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: height * 0.05,
            }}>
            <View
              style={{
                width: '90%',
                height: height * 0.07,
                backgroundColor: '#DCDEDD',
                justifyContent: 'space-between',
                flexDirection: 'row',
                // marginBottom: height * 0.04,
              }}>
              <View
                style={{
                  backgroundColor: '#FFFFFF',
                  width: '15%',
                  height: height * 0.07,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <FontAwesome5
                  color={COLORS.primary}
                  name="envelope"
                  size={24}
                />
              </View>

              <TextInput
                placeholder="البريد الإلكترونى"
                style={{
                  paddingRight: 15,
                  backgroundColor: '#fff',
                  flex: 1,
                  marginLeft: 3,
                  width: '100%',
                  textAlign: 'right',
                  fontFamily: FONTS.fontFamily,
                  fontSize: 17,
                }}
                autoCapitalize="none"
                keyboardType="email-address"
                value={this.state.Email}
                onChangeText={(value) => {
                  this.setState({
                    Email: value,
                    renderError: '',
                  });
                }}
              />
            </View>
          </View>

          <Text
            style={{
              alignSelf: 'center',
              color: 'red',
              fontSize: 14,
              opacity: 0.8,
              // marginTop: 10,
              fontFamily: FONTS.fontFamily,
            }}>
            {this.state.renderError}
          </Text>

          {/* -----------------button------------------- */}
          <View
            style={{
              width: '100%',
              height: height * 0.1,
              // backgroundColor: "yellow",
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={this.sendEmailFun.bind(this)}
              disabled={this.state.loading == true ? true : false}
              style={{
                width: '80%',
                height: height * 0.07,
                backgroundColor: COLORS.primary,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: height * 0.01,
              }}>
              {this.loading()}
            </TouchableOpacity>
          </View>
          {/* --------------------------------------- */}
        </ScrollView>
      </Container>
    );
  }
}
