import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  ToastAndroid,
  Alert,
} from 'react-native';

import axios from 'axios';
import CountDown from 'react-native-countdown-component';
import SMSVerifyCode from 'react-native-sms-verifycode';
import {AppRequired, COLORS, FONTS} from '../../constants';
import AsyncStorage from '@react-native-community/async-storage';
const {width, height} = Dimensions.get('window');

export default class Forgetpass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      codeSent: this.props.navigation.getParam('code'),
      code: '',
      viewed: false,
      Disable: false,
      codeFromData: '8888',
      renderError: '',
      email: this.props.navigation.getParam('email'),
    };
    this.verifycode = null;
  }

  async reSendCode() {
    var code = '';
    for (let i = 0; i < 6; i++) {
      let x = Math.floor(Math.random() * 10);
      code += x;
    }
    let student_token = await AsyncStorage.getItem('fcmToken');

    let data_to_send = {
      email: this.state.email,
      code: code,
      student_token,
    };
    axios
      .post(
        AppRequired.Domain + 'authentication/send_reset_code.php',
        data_to_send,
      )
      .then((res) => {
        // console.log(data_to_send);
        if (res.data.trim() == 'emailSent') {
          // ToastAndroid.show("قد تم إعاده إرسال الكود إلى بريدك الالكترونى",
          // ToastAndroid.CENTER
          // )
          this.setState({
            codeSent: code,
          });
        }
      });
  }

  onInputCompleted = (text) => {
    this.sendcodeFun(text);
  };

  sendcodeFun(code) {
    var codeSent = this.state.codeSent;
    var userEmail = this.state.email;
    if (code != codeSent) {
      ToastAndroid.show(
        'هذا الكود غير صحيح من فضلك ادخل الكود صحيح',
        ToastAndroid.CENTER,
      );
    } else {
      this.props.navigation.navigate('NewPassword', {
        email: userEmail,
      });
    }
  }

  render() {
    return (
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: '#fff',
          // backgroundColor:"red"
        }}>
        {/* ---------------------------- */}
        <View
          style={{
            height: height * 0.05,
            // backgroundColor: 'yellow',
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: height * 0.1,
          }}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 18,
              textAlign: 'center',
              fontFamily: FONTS.fontFamily,
            }}>
            ادخل الكود الذي تم ارساله الي الايميل التالي
          </Text>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: FONTS.fontFamily,
              fontSize: 17,
            }}>
            {this.state.email}
          </Text>
        </View>
        {/* --------------square-------------- */}
        <View
          style={{
            width: '100%',
            // backgroundColor: 'yellow',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <SMSVerifyCode
            ref={(ref) => (this.verifycode = ref)}
            focusedCodeViewBorderColor={COLORS.primary}
            verifyCodeLength={6}
            onInputCompleted={this.onInputCompleted}
          />
        </View>
        {/* -------------------------- */}
        <View
          style={{
            marginTop: '10%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{marginBottom: 5}}>إذا لم يصلك الكود اضغط</Text>
          <TouchableOpacity
            disabled={this.state.Disable}
            onPress={() => {
              this.reSendCode();
              this.setState({
                viewed: !this.state.viewed,
                Disable: !this.state.Disable,
              });
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 15,
                textAlign: 'center',
                marginBottom: 5,
              }}>
              إعادة إرسال الرمز؟
            </Text>
          </TouchableOpacity>
          {/* ---------------------------------- */}
          {this.state.viewed ? (
            <View
              style={{
                flexDirection: 'row',
                // backgroundColor: 'yellow',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{paddingLeft: 10, alignItems: 'center'}}>
                إعادة فى
              </Text>
              {/* <Text> */}
              <CountDown
                // style={{width:20}}
                size={20}
                until={30}
                onFinish={
                  () =>
                    this.setState({
                      viewed: !this.state.viewed,
                      Disable: !this.state.Disable,
                    })
                  // alert('Finished')
                }
                digitStyle={{backgroundColor: '#FFF'}}
                digitTxtStyle={{color: '#1CC625'}}
                timeToShow={['H']}
                timeLabels={{s: null}}
              />
              {/* </Text> */}
            </View>
          ) : null}
          {/* --------------------------------------- */}
        </View>
        <View style={{width: '100%', height: 50}}></View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  boxstyle: {
    width: width * 0.15,
    height: height * 0.1,
    backgroundColor: '#fff',
    borderRadius: height * 0.01,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: {width: 6, height: 15},
    shadowOpacity: 0.7,
    shadowRadius: 14.78,
    elevation: 22,
  },
});
