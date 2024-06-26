import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  TextInput,
  ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Picker } from 'native-base';
// import {Picker as SelectPicker} from '@react-native-picker/picker';
// import {Picker} from '@react-native-picker/picker';
// import RNPickerSelect from 'react-native-picker-select';
import { Spinner } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import firebase from 'react-native-firebase';
import { Hoshi } from 'react-native-textinput-effects';
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import DeviceInfo from 'react-native-device-info';
// import DropDownPicker from 'react-native-dropdown-picker';

import { AppRequired, COLORS, FONTS, images, SIZES } from '../../constants';
export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading_gens: true,
      genData: [],
      icon: false,
      icon2: false,
      name: '',
      nameerr: '',
      email: '',
      emailerr: '',
      pass: '',
      passerr: '',
      selected: '',
      selectederr: '',
      confirm: '',
      confirmerr: '',
      phone: '',
      phonerr: '',
      inviting_user_id: "",
      // generation_selected_id: '3',
      // generation_selected_value: 'الصف الثالث الثانوى',
      bottomConnectionMsg: new Animated.Value(-100),
      connection_Status: '',
      code: '',
      codeerr: '',
      sendCode: '',
      invite_code: "",
      invite_code_err: "",
      invitation_code_btn_pressed: false,
      loading: false,
      resModal: false,
      checkEmailRes: false,
      resMassage: '',
      generateCodeLoading: false,
      confirmEmail: false,
      openPicker: false,
      valuePicker: null,
      itemsPicker: [
        { label: 'الفرقة الاولى', value: '1' },
        { label: 'الفرقة الثانية', value: '2' },
        { label: 'الفرقة الثالثة', value: '3' },
        { label: 'الفرقة الرابعة', value: '4' },
      ],
    };
    this._subscription;
  }
  componentWillUnmount() {
    this._subscription && this._subscription();
  }
  async componentDidMount() {
    this.checkPermission();
    // this.allowFunction();
    this._subscription = NetInfo.addEventListener(
      this._handelConnectionInfoChange,
    );
  }

  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    // If Premission granted proceed towards token fetch
    if (enabled) {
      this.getToken();
    } else {
      // If permission hasn’t been granted to our app, request user in requestPermission method.
      this.requestPermission();
    }
  }
  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
  }

  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      // console.log('permission rejected');
    }
  }
  _handelConnectionInfoChange = (NetInfoState) => {
    if (NetInfoState.isConnected == true) {
      this.setState(({ }) => ({
        connection_Status: 'Online',
      }));
      // this.getgenedata();
      Animated.spring(this.state.bottomConnectionMsg, {
        toValue: -100,
      }).start();
    } else {
      this.setState(({ }) => ({
        connection_Status: 'offline',
      }));
      Animated.spring(this.state.bottomConnectionMsg, { toValue: 0 }).start();
    }
  };

  validate = (value) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(value).toLowerCase());
  };
  signup = async () => {
    let uniqueId = DeviceInfo.getUniqueId();

    let student_token = await AsyncStorage.getItem('fcmToken');
    this.setState({ loading: true });
    const sim_name = "vodafone"
    // (await DeviceInfo.getCarrier()).toLowerCase();
    let data_to_send = {
      name: this.state.name.trim(),
      email: this.state.email.trim(),
      password: this.state.pass,
      mobile: this.state.phone,
      mac: uniqueId,
      student_token,
      genId: this.state.valuePicker,
      sim_name,
      inviting_user_id: this.state.inviting_user_id
    };
    // console.log('data_to_send');
    // console.log('data_to_send');
    console.log(data_to_send)

    if (this.state.connection_Status == 'Online') {
      axios
        .post(
          AppRequired.Domain + 'authentication/student_signup.php',
          data_to_send,
        )
        .then((res) => {
          // console.log('res data');

          console.log(res.data);
          // console.log('res data');

          this.setState({ loading: false });

          if (res.status == 200) {
            if (res.data == 'email_found') {
              this.setState({
                resModal: true,
                resMassage: 'هذا البريد موجود بالفعل',
              });
            } else if (res.data == 'error') {
              this.setState({
                resModal: true,
                resMassage: 'عذرا يرجي المحاوله في وقتا لاحق .',
              });
            } else if (res.data == 'device_sign_before') {
              this.setState({
                resModal: true,
                resMassage: "عذرا ... تم تسجيل حساب من هذا الجهاز من قبل",
              });
            }
            else if (res.data == 'wrong_sim') {
              this.setState({
                resModal: true,
                resMassage: 'دخول غير مسموح ',
              });
            } else if (typeof res.data === 'object') {
              this.setUserData(res.data);
              this.props.navigation.navigate('HomePages');
            } else {
              this.setState({
                resModal: true,
                resMassage: 'عذرا يرجي المحاوله في وقتا لاحق ..',
              });
            }
          } else {
            this.setState({
              resModal: true,
              resMassage: 'عذرا يرجي المحاوله في وقتا لاحق ...',
            });
          }
        })
        .finally(() => {
          this.setState({
            code: '',
          });
        });
    } else {
      this.setState({ loading: false });
      this.setState({
        resModal: true,
        resMassage: 'من فضلك تحقق من اتصالك بالأنترنت',
      });
    }
  };
  setUserData = async (data) => {
    // let AllData = {
    //   student_email: data_to_send.email,
    //   student_id: resData,
    //   student_name: data_to_send.name,
    //   student_password: data_to_send.password,
    //   student_phone: data_to_send.mobile,
    //   student_serial: data_to_send.mac,
    //   genId: data_to_send.genId,
    // };

    // await AsyncStorage.setItem('AllData', JSON.stringify(AllData));
    // await AsyncStorage.setItem('switch', 'Pending');

    await AsyncStorage.setItem('AllData', JSON.stringify(data));
    await AsyncStorage.setItem('switch', 'Home');
  };
  checkEmail() {
    this.setState({ checkEmailRes: true });
    if (this.state.code == '') {
      this.setState({ checkEmailRes: false });

      ToastAndroid.showWithGravity(
        'الرجاء إدخال الكود',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    } else if (this.state.sendCode == this.state.code) {
      this.setState({ checkEmailRes: false, confirmEmail: false });

      this.signup();
    } else {
      this.setState({ checkEmailRes: false });

      ToastAndroid.showWithGravity(
        'الكود الذى أدخلته غير صحيح',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }
  }
  check_invitaion_code(code) {
    // this.setState({ generateCodeLoading: true });

    let dataToSend = {

      invitation_code: code,
    };
    console.log(code);
    axios
      .post(
        AppRequired.Domain + 'authentication/check_invitation_code.php',
        dataToSend,
      )
      .then((res) => {
        console.log(res.data)
        if (res.status == 200) {
          if (res.data.status == "success") {
            this.setState({ inviting_user_id: res.data.message.inviting_student_id, invitation_code_btn_pressed: true })
            ToastAndroid.showWithGravity(
              'تم تأكيد الكود بنجاح',
              ToastAndroid.SHORT,
              ToastAndroid.CENTER,
            );

          } else {
            this.setState({
              resModal: true,
              resMassage: ' كود غير صالح   ...',
            });

          }
        } else {
          this.setState({
            resModal: true,
            resMassage: 'عذرا يرجي المحاوله في وقتا لاحق ...',
          });
        }
      })
      .catch((error) => {

      });
  }




  sendCodeForConfirmEmail() {
    this.setState({ generateCodeLoading: true });
    let code = '';
    for (let i = 0; i < 6; i++) {
      let x = Math.floor(Math.random() * 10);
      code += x;
    }
    let dataToSend = {
      email: this.state.email,
      code: code,
    };
    console.log(dataToSend);
    axios
      .post(
        'https://camp-coding.online/law_plus/student/authentication/send_verification_code.php',
        dataToSend,
      )
      .then((res) => {
        console.log(res.data);
        if (res.status == 200) {

          if (res.data.trim() == 'emailSent') {
            this.setState({ generateCodeLoading: false, sendCode: code });
          } else if (res.data.trim() == 'emailExists') {
            ToastAndroid.showWithGravity(
              'هذا الايميل موجود بالفعل',
              ToastAndroid.SHORT,
              ToastAndroid.CENTER,
            );
            this.setState({
              confirmEmail: false,
            });
          } else if (res.data.trim() == 'error') {
            ToastAndroid.showWithGravity(
              'عذرا حدث خطأ ما ....',
              ToastAndroid.SHORT,
              ToastAndroid.CENTER,
            );
            this.setState({ generateCodeLoading: false, confirmEmail: false });
          } else {
            ToastAndroid.showWithGravity(
              'عذرا حدث خطأ ما .....',
              ToastAndroid.SHORT,
              ToastAndroid.CENTER,
            );
            this.setState({ generateCodeLoading: false, confirmEmail: false });
          }
        } else {
          ToastAndroid.showWithGravity(
            'عذرا حدث خطأ ما ......',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
          this.setState({ generateCodeLoading: false, confirmEmail: false });
        }
      })
      .catch((error) => {
        // console.log(error);
      });
  }

  checkbutton() {
    let error = 0;
    if (this.validate(this.state.email.trim())) {
      this.setState({ emailerr: '' });
    } else {
      error++;
      this.setState({ emailerr: 'ادخل بريد الكتروني صحيح' });
    }

    if (this.state.name.length >= 2) {
      this.setState({ nameerr: '' });
    } else {
      error++;
      this.setState({ nameerr: 'يجب ان يتكون الاسم من حرفين او اكثر' });
    }

    if (this.state.name * 0 != 0) {
      this.setState({ nameerr: '' });
    } else {
      error++;
      this.setState({ nameerr: 'يجب ان يتكون الاسم من حروف' });
    }

    if (this.state.pass == '' || this.state.pass.length < 6) {
      error++;
      this.setState({ passerr: 'كلمه المرور تتكون من 6 احرف او اكثر' });
    } else {
      this.setState({ passerr: '' });
    }

    if (this.state.pass == '' || this.state.confirm.length < 6) {
      error++;
      this.setState({ 1: 'كلمه المرور تتكون من 6 احرف او اكثر' });
    }
    if (this.state.confirm != this.state.pass) {
      error++;
      this.setState({ confirmerr: 'لا تتطابق كلمه المرور' });
    }

    if (
      (this.state.phone.startsWith('010') ||
        this.state.phone.startsWith('011') ||
        this.state.phone.startsWith('012') ||
        this.state.phone.startsWith('015') ||
        this.state.phone.startsWith('002') ||
        this.state.phone.startsWith('+2')) &&
      this.state.phone.length >= 11 &&
      this.state.phone.length <= 14
    ) {
      this.setState({ phonerr: '' });
    } else {
      error++;
      this.setState({ phonerr: 'ادخل رقم هاتف صحيح' });
    }

    if (error === 0) {
      if (this.state.connection_Status == 'Online') {
        this.signup();

        this.setState({ confirmEmail: true });
        this.sendCodeForConfirmEmail();
      } else {
        ToastAndroid.showWithGravityAndOffset(
          'الرجاء التحقق من اتصالك بالإنترنت',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
          25,
          50,
        );
      }
    }
  }

  // _changePickerVal(value, index) {
  //   this.setState({
  //     generation_selected_id: this.state.genData[index].generation_id,
  //     generation_selected_value: value,
  //   });
  // }
  // getgenedata() {
  //   axios.get(AppRequired.Domain + 'select_generations2.php').then((res) => {
  //     this.setState({
  //       genData: res.data.gens,
  //       generation_selected_id: res.data.gens[0].generation_id,
  //       generation_selected_value: res.data.gens[0].generation_name,
  //       loading_gens: false,
  //     });
  //   });
  // }

  render() {
    return (
      <>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              width: 230,
              height: 230,
              borderRadius: 115,
              backgroundColor: COLORS.primary,
              position: 'absolute',
              right: 10,
              top: -50,
            }}></View>
          <View
            style={{
              width: 230,
              height: 230,
              borderRadius: 115,
              backgroundColor: COLORS.secondary,
              position: 'absolute',
              right: -45,
              top: -25,
              //   alignContent: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: 130,
                height: 130,
                borderRadius: 130 / 2,
                backgroundColor: '#fff',
                marginLeft: 30,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                // source={require('./logocamp.jpg')}
                source={images.AppLogo}
                resizeMode="contain"
                style={{
                  width: '80%',
                  height: '80%',
                  // flex: 1,
                  // borderRadius: 120 / 2,
                }}
              />
            </View>
          </View>
          {/* -----------------project_name--------------- */}
          <View
            style={{
              width: '90%',
              marginHorizontal: '5%',
              marginTop: 210,
              paddingLeft: 10,
            }}>
            <Text
              style={{
                fontFamily: FONTS.fontFamily,
                fontSize: 20,
                color: COLORS.fontColor,
              }}>
              تسجيل
            </Text>
          </View>
          {/* ------------------Textinput----------------- */}
          <View
            style={{
              width: '90%',
              marginHorizontal: '5%',
              // backgroundColor: 'yellow',
            }}>
            {/* -----name---- */}
            <View style={styles.Textinputstyle}>
              <Hoshi
                label={'الاسم'}
                borderColor={COLORS.primary}
                style={{
                  width: '100%',
                  paddingLeft: 15,
                }}
                borderHeight={0.85}
                labelStyle={{
                  color: '#C9CCCC',
                }}
                inputStyle={{
                  color: '#000',
                  textAlign: 'right',
                  fontFamily: FONTS.fontFamily,
                }}
                value={this.state.name}
                onChangeText={(value) => {
                  this.setState({ name: value, nameerr: '' });
                }}
              />
            </View>
            {this.state.nameerr != '' ? (
              <Text style={styles.Textmessage_style}>{this.state.nameerr}</Text>
            ) : null}
            {/* -----mail---- */}
            <View style={styles.Textinputstyle}>
              <Hoshi
                autoCapitalize="none"
                autoCompleteType="email"
                label={'البريد الإلكترونى'}
                borderColor={COLORS.primary}
                keyboardType="email-address"
                style={{
                  width: '100%',
                  paddingLeft: 15,
                }}
                borderHeight={0.85}
                labelStyle={{
                  color: '#C9CCCC',
                }}
                inputStyle={{
                  color: '#000',
                  textAlign: 'right',
                  fontFamily: FONTS.fontFamily,
                }}
                value={this.state.email}
                onChangeText={(value) => {
                  this.setState({ email: value, emailerr: '' });
                }}
              />
            </View>
            {this.state.emailerr != '' ? (
              <Text style={styles.Textmessage_style}>
                {this.state.emailerr}
              </Text>
            ) : null}
            {/* ----------pass----------- */}
            <View style={[styles.Textinputstyle, { flexDirection: 'row' }]}>
              <View
                style={{
                  width: '100%',
                  //   backgroundColor: 'yellow',
                  justifyContent: 'center',
                }}>
                <Hoshi
                  label={'كلمه المرور'}
                  borderColor={COLORS.primary}
                  style={{
                    width: '100%',
                    paddingLeft: 15,
                  }}
                  borderHeight={0.85}
                  labelStyle={{
                    color: '#C9CCCC',
                  }}
                  inputStyle={{
                    color: '#000',
                    textAlign: 'right',
                    paddingRight: 60,
                    fontFamily: FONTS.fontFamily,
                  }}
                  secureTextEntry={!this.state.icon}
                  value={this.state.pass}
                  onChangeText={(value) => {
                    this.setState({ pass: value, passerr: '' });
                  }}
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  let x = this.state.icon;
                  this.setState({ icon: !x });
                }}
                style={{
                  width: '15%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  right: 0,
                  top: '50%',
                  marginBottom: -2,
                }}>
                <Icon name={this.state.icon ? 'eye' : 'eye-slash'} size={20} />
              </TouchableOpacity>
            </View>
            {this.state.passerr != '' ? (
              <Text style={styles.Textmessage_style}>{this.state.passerr}</Text>
            ) : null}
            {/* ----------resetpass----------- */}
            <View style={[styles.Textinputstyle, { flexDirection: 'row' }]}>
              <View
                style={{
                  width: '100%',
                  //   backgroundColor: 'yellow',
                  justifyContent: 'center',
                }}>
                <Hoshi
                  label={'تأكيد كلمه المرور'}
                  borderColor={COLORS.primary}
                  style={{
                    width: '100%',
                    paddingLeft: 15,
                  }}
                  borderHeight={0.85}
                  labelStyle={{
                    color: '#C9CCCC',
                  }}
                  inputStyle={{
                    color: '#000',
                    textAlign: 'right',
                    paddingRight: 60,
                    fontFamily: FONTS.fontFamily,
                  }}
                  secureTextEntry={!this.state.icon2}
                  value={this.state.confirm}
                  onChangeText={(value) => {
                    this.setState({ confirm: value, confirmerr: '' });
                  }}
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  let x = this.state.icon2;
                  this.setState({ icon2: !x });
                }}
                style={{
                  width: '15%',
                  alignItems: 'center',
                  justifyContent: 'center',

                  position: 'absolute',
                  right: 0,
                  top: '50%',
                  marginBottom: -2,
                }}>
                <Icon name={this.state.icon2 ? 'eye' : 'eye-slash'} size={20} />
              </TouchableOpacity>
            </View>
            {this.state.confirmerr != '' ? (
              <Text style={styles.Textmessage_style}>
                {this.state.confirmerr}
              </Text>
            ) : null}

            {/* --------phone-------- */}
            <View style={styles.Textinputstyle}>
              <Hoshi
                label={'رقم الهاتف'}
                keyboardType="phone-pad"
                borderColor={COLORS.primary}
                style={{
                  width: '100%',
                  paddingLeft: 15,
                }}
                borderHeight={0.85}
                labelStyle={{
                  color: '#C9CCCC',
                }}
                inputStyle={{
                  color: '#000',
                  textAlign: 'right',
                  fontFamily: FONTS.fontFamily,
                }}
                value={this.state.phone}
                onChangeText={(value) => {
                  this.setState({ phone: value, phonerr: '' });
                }}
              />
            </View>
            {this.state.phonerr != '' ? (
              <Text style={styles.Textmessage_style}>{this.state.phonerr}</Text>
            ) : null}


            <View style={[styles.Textinputstyle, { flexDirection: 'row' }]}>
              <View
                style={{
                  width: '100%',
                  //   backgroundColor: 'yellow',
                  justifyContent: 'center',
                }}>
                <Hoshi
                  label={'كود الدعوة'}
                  borderColor={COLORS.primary}
                  style={{
                    width: '100%',
                    paddingLeft: 15,
                  }}
                  borderHeight={0.85}
                  labelStyle={{
                    color: '#C9CCCC',
                  }}
                  inputStyle={{
                    color: '#000',
                    textAlign: 'right',
                    paddingRight: 60,
                    fontFamily: FONTS.fontFamily,
                  }}
                  // secureTextEntry={!this.state.icon}
                  value={this.state.invite_code}
                  onChangeText={(value) => {
                    this.setState({ invite_code: value, invite_code_err: "" });
                  }}
                />
              </View>
              <TouchableOpacity
                disabled={this.state.invitation_code_btn_pressed}
                onPress={() => {
                  if (this.state.invite_code.length == 8) {

                    this.check_invitaion_code(this.state.invite_code)
                  } else {

                    this.setState({ invite_code_err: 'كود الدعوة يتكون من 8 احرف  ' });
                  }
                }}
                style={{
                  width: '20%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  right: 0,
                  top: 20,
                  backgroundColor: COLORS.searchBar,
                  borderRadius: 10,
                  opacity: this.state.invitation_code_btn_pressed ? .5 : 1

                  // marginBottom: -2,
                }}>
                <Text
                  style={{
                    fontFamily: FONTS.fontFamily,
                    fontSize: 20,
                    color: COLORS.white,
                  }}>
                  تأكيد
                </Text>
              </TouchableOpacity>
            </View>
            {this.state.invite_code_err != '' ? (
              <Text style={styles.Textmessage_style}>{this.state.invite_code_err}</Text>
            ) : null}
          </View>



          {/* --------------picker--------------- */}
          {/* <DropDownPicker
            theme="DARK"
            dropDownContainerStyle={{
              borderColor: COLORS.primary,
              width: '90%',
              alignSelf: 'center',
            }}
            selectedItemContainerStyle={
              {
                // backgroundColor: COLORS.tra,
              }
            }
            selectedItemLabelStyle={{
              // fontWeight: 'bold',
              fontFamily: FONTS.fontFamily,
            }}
            itemSeparatorStyle={{
              backgroundColor: COLORS.primary,
            }}
            style={{
              alignSelf: 'center',
              width: '90%',
              borderColor: COLORS.primary,
              // marginBottom: 20,
              marginTop: 5,
            }}
            open={this.state.openPicker}
            value={this.state.valuePicker}
            items={this.state.itemsPicker}
            setOpen={(e) => {
              this.setState({
                openPicker: e,
              });
            }}
            setValue={(e) => {
              this.setState({
                valuePicker: e,
              });
            }}
            setItems={(e) => {
              this.setState({
                itemsPicker: e,
              });
            }}
            placeholder="يرجى اختيار الدفعة"
          /> */}
          {/* <RNPickerSelect
            value={this.state.valuePicker}
            onValueChange={(value) => console.log(value)}
            items={this.state.itemsPicker}
            placeholder="يرجى اختيار الدفعة"
          /> */}
          <Picker
            selectedValue={this.state.valuePicker}
            onValueChange={(e) => {
              this.setState({
                valuePicker: e,
              });
            }}
            mode="dropdown"
            placeholder="يرجى اختيار الدفعة"
            style={{
              width: '80%',
              fontFamily: FONTS.fontFamily,
            }}>
            {this.state.itemsPicker.map((res, index) => (
              <Picker.Item label={res.label} value={res.value} id={index} />
            ))}
          </Picker>
          {/* {this.state.loading_gens &&
          this.state.connection_Status == 'Online' ? (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Text
                style={{fontFamily: FONTS.fontFamily, color: COLORS.fontColor}}>
                الرجاء الانتظار حتى تحميل الدفعات
              </Text>
              <Image
                source={images.mainLoading}
                style={{
                  width: 100,
                  height: 100,
                }}
                resizeMode="contain"
              />
            </View>
          ) : this.state.connection_Status == 'offline' ? (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Text
                style={{fontFamily: FONTS.fontFamily, color: COLORS.fontColor}}>
                الرجاء التأكد من اتصالك بالانترنت
              </Text>
              <Image
                source={images.NoInternet}
                style={{
                  width: 100,
                  height: 100,
                }}
                resizeMode="contain"
              />
            </View>
          ) : (
            <View
              style={{
                width: '90%',
                height: 60,
                backgroundColor: '#ddd',
                borderRadius: 100,
                marginHorizontal: '5%',
                justifyContent: 'center',
                marginTop: 10,
              }}>
              <Picker
                selectedValue={this.state.generation_selected_value}
                onValueChange={this._changePickerVal.bind(this)}
                mode="dropdown"
                style={{
                  width: '80%',
                  fontFamily: FONTS.fontFamily,
                }}>
                {this.state.genData.map((res) => (
                  <Picker.Item
                    label={res.generation_name}
                    value={res.generation_name}
                    id={res.generation_id}
                  />
                ))}
              </Picker>
            </View>
          )} */}

          {/* ------------------press to sign-------------------- */}
          <TouchableOpacity
            disabled={this.state.loading}
            onPress={() => {
              this.checkbutton();
            }}
            style={{
              width: '90%',
              height: 60,
              marginHorizontal: '5%',
              backgroundColor: COLORS.primary,
              borderRadius: 30,
              marginTop: 15,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 40,
            }}>
            {this.state.loading == true ? (
              <Spinner color="#fff" size={40} />
            ) : (
              <Text
                style={{
                  fontSize: 18,
                  color: '#FFFFFF',
                  // fontWeight: 'bold',
                  fontFamily: FONTS.fontFamily,
                  fontStyle: 'normal',
                }}>
                التسجيل
              </Text>
            )}
          </TouchableOpacity>

          {/* -------------------------------------- */}

          <Modal
            visible={this.state.resModal}
            onRequestClose={() => {
              this.setState({ resModal: false });
            }}
            transparent={true}>
            <View
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <View
                style={{
                  width: SIZES.width * 0.9,
                  padding: 10,
                  backgroundColor: '#fff',
                  elevation: 22,
                  borderRadius: 15,
                }}>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 10,
                  }}>
                  <Text
                    style={{
                      fontFamily: FONTS.fontFamily,
                      color: COLORS.primary,
                      fontSize: 22,
                    }}>
                    {AppRequired.appName}
                  </Text>
                </View>
                <View
                  style={{
                    alignSelf: 'center',
                    width: '90%',
                    borderWidth: 1.5,
                    borderColor: '#ddd',
                  }}
                />

                <View style={{ paddingHorizontal: 20, paddingVertical: 12 }}>
                  <Text
                    style={{
                      fontFamily: FONTS.fontFamily,
                      color: COLORS.fontColor,
                      fontSize: 17,
                      textAlign: 'center',
                    }}>
                    {this.state.resMassage}
                  </Text>
                </View>

                <View
                  style={{
                    alignSelf: 'center',
                    width: '90%',
                    borderWidth: 1.5,
                    borderColor: '#ddd',
                  }}
                />

                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 7,
                  }}>
                  <TouchableOpacity
                    style={{ alignItems: 'center', justifyContent: 'center' }}
                    onPress={() => {
                      this.setState({ resModal: false });
                    }}>
                    <Text
                      style={{
                        fontFamily: FONTS.fontFamily,
                        color: COLORS.fontColor,
                        fontSize: 20,
                      }}>
                      إلغاء
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <Modal
            visible={this.state.confirmEmail}
            transparent={true}
            onRequestClose={() => {
              this.setState({
                confirmEmail: false,
              });
            }}
            animationType="fade">
            {this.state.generateCodeLoading ? (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                }}>
                <View
                  style={{
                    width: '90%',
                    height: 110,
                    backgroundColor: '#f7f7f7',
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Spinner color={COLORS.primary} />
                </View>
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                }}>
                <View
                  style={{
                    width: '90%',
                    padding: 5,
                    backgroundColor: '#f7f7f7',
                    borderRadius: 10,
                  }}>
                  <Text
                    style={{
                      alignSelf: 'center',
                      fontFamily: FONTS.fontFamily,
                      fontSize: 18,
                      color: COLORS.fontColor,
                    }}>
                    قد تم إرسال كود إلى الايميل التالى
                  </Text>
                  <Text
                    style={{
                      alignSelf: 'center',
                      fontFamily: FONTS.fontFamily,
                      fontSize: 16,
                      textAlign: 'center',
                      color: COLORS.fontColor,
                    }}>
                    {this.state.email}
                  </Text>
                  <View
                    style={[
                      styles.TextinputstyleForConfirm,
                      { alignSelf: 'center', marginTop: 7 },
                    ]}>
                    <View style={styles.TextinputIconstyle}>
                      <Icon name="inbox" color={COLORS.primary} size={27} />
                    </View>
                    <View style={styles.Textinputstyle1}>
                      <TextInput
                        placeholder="أدخل الكود"
                        style={{
                          paddingRight: 15,
                          textAlign: 'center',
                          fontSize: 17,
                          fontFamily: FONTS.fontFamily,
                          borderRadius: 8,
                        }}
                        value={this.state.code}
                        keyboardType="number-pad"
                        onChangeText={(value) => {
                          this.setState({
                            code: value,
                            // .replace(/\s/g, '')
                            // .replace(/(\d{4})/g, '$1 ')
                            // .trim(),
                            codeerr: '',
                          });
                        }}
                      />
                    </View>
                  </View>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: 'red',
                      fontSize: 14,
                      fontWeight: '800',
                      fontFamily: FONTS.fontFamily,
                    }}>
                    {this.state.codeerr}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '90%',
                      alignSelf: 'center',
                      marginVertical: 7,
                    }}>
                    <Text style={{ fontFamily: FONTS.fontFamily }}>
                      إن لم يصلك كود إضغط{' '}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({ code: '' });
                        this.sendCodeForConfirmEmail();
                      }}>
                      <Text
                        style={{
                          fontFamily: FONTS.fontFamily,
                          color: COLORS.primary,
                        }}>
                        {' '}
                        إعاده إرسال
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    disabled={this.state.checkEmailRes}
                    onPress={() => {
                      this.checkEmail();
                    }}
                    style={{
                      marginBottom: 15,
                      alignSelf: 'center',
                      width: '50%',
                      height: 40,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: COLORS.primary,
                      borderRadius: 5,
                    }}>
                    {this.state.checkEmailRes ? (
                      <Spinner color={'#fff'} />
                    ) : (
                      <Text
                        style={{ fontFamily: FONTS.fontFamily, color: '#fff' }}>
                        تأكيد
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Modal>
        </ScrollView >
      </>
    );
  }
}

const styles = StyleSheet.create({
  Textinputstyle: {
    width: '100%',
    height: 60,
    marginBottom: 15,
  },
  TextinputstyleForConfirm: {
    width: '90%',
    height: SIZES.height * 0.07,
    backgroundColor: '#DCDEDD',
    justifyContent: 'space-between',
    flexDirection: 'row',
    // marginBottom: height * 0.02,
  },
  Textmessage_style: {
    textAlign: 'center',
    color: 'red',
    fontSize: 14,
    fontFamily: FONTS.fontFamily, // fontFamily: fontFamily,
  },
  TextinputIconstyle: {
    backgroundColor: '#fff',
    width: '15%',
    height: SIZES.height * 0.07,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Textinputstyle1: {
    backgroundColor: '#FFFFFF',
    width: '84%',
    // height: SIZES.height * 0.07,
    // borderRadius: 8,
    justifyContent: 'center',
  },
});
