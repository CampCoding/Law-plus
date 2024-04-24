import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  Modal,
  ToastAndroid,
} from 'react-native';
import {Container, Spinner} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import {AppRequired, COLORS, FONTS} from '../../constants';

const {width, height} = Dimensions.get('window');

export default class NewPassword extends React.Component {
  constructor() {
    super();
    this.state = {
      icon: false,
      icon2: false,
      secure: true,
      nPassword: '',
      rePassword: '',
      email: '',
      data: '',
      loading: false,
      renderError: '',
      resModal: false,
      resMassage: '',
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

  async resetPassFun() {
    if (this.state.nPassword == '') {
      this.setState({renderError: 'من فضلك ادخل كلمة السر'});
    } else if (
      this.state.nPassword.length < 6 ||
      this.state.rePassword.length < 6
    ) {
      this.setState({renderError: 'كلمة السر يجب ان تكون اكثر من 6 احرف'});
      // this.setState({nPassword: '',rePassword: ''});
    } else if (this.state.nPassword != this.state.rePassword) {
      this.setState({
        renderError: 'من فضلك تأكد من تطابق كلمة السر',
      });
    } else {
      this.setState({renderError: ''});
      this.setState({loading: true});
      let student_token = await AsyncStorage.getItem('fcmToken');

      const dataToSend = {
        student_email: this.props.navigation.getParam('email'),
        student_password: this.state.rePassword,
        student_token,
      };
      if (this.state.connection_Status == 'Online') {
        // console.log(dataToSend);
        axios
          .post(
            AppRequired.Domain + 'authentication/update_student_password.php',
            dataToSend,
          )
          .then((res) => {
            // console.log(res.data);

            this.setState({loading: false});

            switch (res.data.trim()) {
              case 'error':
                this.setState({
                  resModal: true,
                  resMassage: 'حدث خطأ ما الرجاء حاول مره اخرى',
                });

                break;
              case 'success':
                ToastAndroid.show(
                  'قد تم تغير كلمه السر بنجاح',
                  ToastAndroid.CENTER,
                );

                this.props.navigation.navigate('Login');
                break;
              default:
                this.setState({
                  resModal: true,
                  resMassage: 'حدث خطأ ما الرجاء حاول مره اخرى',
                });
            }
          });
      } else {
        this.setState({loading: false});
        this.setState({
          resModal: true,
          resMassage: 'من فضلك تحقق من اتصالك بالأنترنت',
        });
      }
    }
  }

  loading() {
    if (this.state.loading) {
      return <Spinner color="white" />;
    } else {
      return (
        <Text
          style={{
            color: 'white',
            fontSize: 20,
            alignSelf: 'center',
            fontFamily: FONTS.fontFamily,
          }}>
          تأكيد
        </Text>
      );
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
      <Container
        style={{
          // width: "100%",
          // height: "100%",
          backgroundColor: '#EFF1F0',
        }}>
        {/* -------------------- */}
        <ScrollView style={{flex: 1}}>
          <View
            style={{
              alignItems: 'center',
              width: '100%',
              justifyContent: 'center',
              marginTop: height * 0.07,
            }}>
            <View
              style={{
                width: '90%',
                marginBottom: 30,
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: height * 0.04,
                  fontFamily: FONTS.fontFamily,
                }}>
                تغيير كلمة السر ؟
              </Text>
              <Text
                style={{
                  fontSize: height * 0.025,
                  fontFamily: FONTS.fontFamily,
                }}>
                من فضلك أدخل كلمة السر الجديدة
              </Text>
            </View>
            <View
              style={{
                width: '90%',
                height: height * 0.07,
                backgroundColor: '#EFF1F0',
                // justifyContent: "space-between",
                flexDirection: 'row',
                alignSelf: 'center',
              }}>
              <View
                style={{
                  backgroundColor: '#FFFFFF',
                  width: '15%',
                  height: height * 0.07,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <FontAwesome5 color={COLORS.primary} name="lock" size={24} />
              </View>

              <TextInput
                placeholder="كلمة السر الجديدة"
                secureTextEntry={!this.state.icon}
                style={{
                  backgroundColor: '#fff',
                  flex: 1,
                  marginLeft: 3,
                  paddingRight: 15,
                  fontFamily: FONTS.fontFamily,
                  textAlign: 'right',
                  width: '100%',
                }}
                value={this.state.nPassword}
                onChangeText={(value) => {
                  this.setState({
                    nPassword: value,
                    renderError: '',
                  });
                }}
              />

              <View
                style={{
                  backgroundColor: '#ddd',
                  opacity: 0.8,
                  width: '15%',
                  height: height * 0.07,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    let x = this.state.icon;
                    this.setState({icon: !x});
                  }}>
                  <FontAwesome5
                    name={this.state.icon ? 'eye' : 'eye-slash'}
                    size={height * 0.02}
                    style={{color: '#848687'}}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {/* --------------------------- */}
            <View
              style={{
                width: '90%',
                height: height * 0.07,
                backgroundColor: '#DCDEDD',
                // justifyContent: "space-between",
                flexDirection: 'row',
                marginTop: 20,
              }}>
              <View
                style={{
                  backgroundColor: '#FFFFFF',
                  width: '15%',
                  height: height * 0.07,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <FontAwesome5 color={COLORS.primary} name="lock" size={24} />
              </View>

              <TextInput
                placeholder="تأكيد كلمة السر"
                secureTextEntry={!this.state.icon2}
                style={{
                  backgroundColor: '#fff',
                  flex: 1,
                  marginLeft: 3,
                  paddingRight: 15,
                  fontFamily: FONTS.fontFamily,
                  textAlign: 'right',
                  width: '100%',
                }}
                value={this.state.rePassword}
                onChangeText={(value) => {
                  this.setState({
                    rePassword: value,
                    renderError: '',
                  });
                }}
              />
              <View
                style={{
                  backgroundColor: '#ddd',
                  opacity: 0.8,
                  width: '15%',
                  height: height * 0.07,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    let x = this.state.icon2;
                    this.setState({icon2: !x});
                  }}>
                  <FontAwesome5
                    name={this.state.icon2 ? 'eye' : 'eye-slash'}
                    size={height * 0.02}
                    style={{color: '#848687'}}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <Text
              style={{
                alignSelf: 'center',
                color: 'red',
                fontSize: 14,
                opacity: 0.5,
                marginTop: 10,
                fontFamily: FONTS.fontFamily,
              }}>
              {this.state.renderError}
            </Text>

            {/* --------------------------- */}

            <View
              style={{
                width: '100%',
                height: height * 0.1,
                // backgroundColor: "blue",
                alignItems: 'center',
                justifyContent: 'center',
                // position: "absolute",
                // bottom: 15
              }}>
              <TouchableOpacity
                onPress={this.resetPassFun.bind(this)}
                style={{
                  width: '85%',
                  height: height * 0.07,
                  backgroundColor: COLORS.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: height * 0.01,
                }}>
                {this.loading()}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <Modal
          visible={this.state.resModal}
          onRequestClose={() => {
            this.setState({resModal: false});
          }}
          transparent={true}>
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <View
              style={{
                width: width * 0.9,
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

              <View style={{paddingHorizontal: 20, paddingVertical: 12}}>
                <Text
                  style={{
                    fontFamily: FONTS.fontFamily,
                    color: COLORS.primary,
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
                  style={{alignItems: 'center', justifyContent: 'center'}}
                  onPress={() => {
                    this.setState({resModal: false});
                  }}>
                  <Text
                    style={{
                      fontFamily: FONTS.fontFamily,
                      color: COLORS.primary,
                      fontSize: 20,
                    }}>
                    إلغاء
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <ViewConnectionMsg ConnectionEnter="لا يوجد اتصال بالأنترنت" />
      </Container>
    );
  }
}

const styles = StyleSheet.create({});
