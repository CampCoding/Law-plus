import React, {Component} from 'react';
import {Container, Spinner} from 'native-base';
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  Modal,
  Dimensions,
  ActivityIndicator,
  TextInput,
  ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import NetInfo from '@react-native-community/netinfo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import {AppRequired, COLORS, FONTS, images} from '../../constants';
const {width, height} = Dimensions.get('window');

export default class EmailForReset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wating: true,
      AllData: {},
      loading: false,
      connection_Status: 'Offline',
      bottomConnectionMsg: new Animated.Value(-100),
      code: '',
      codeError: '',
      showLogoutModal: false,
      logoutLoading: false,
    };
    this._subscription;
  }

  componentWillUnmount() {
    this._subscription && this._subscription();
  }
  async componentDidMount() {
    this._subscription = NetInfo.addEventListener(
      this._handelConnectionInfoChange,
    );
  }

  _handelConnectionInfoChange = async (NetInfoState) => {
    let AllData = JSON.parse(await AsyncStorage.getItem('AllData'));

    if (NetInfoState.isConnected == true) {
      this.setState({
        connection_Status: 'Online',
        AllData,
      });

      Animated.spring(this.state.bottomConnectionMsg, {
        toValue: -100,
      }).start();
    } else {
      this.setState({
        connection_Status: 'offline',
      });
      Animated.spring(this.state.bottomConnectionMsg, {toValue: 0}).start();
    }
  };

  CheckCode = async () => {
    let code = this.state.code;
    if (code == '') {
      this.setState({
        codeError: 'ادخل الكود',
      });
    } else {
      var pure_code = code.replace(/\s/g, '');
      if (pure_code * 0 == 0) {
        this.setState({
          loading: true,
        });

        let student_token = await AsyncStorage.getItem('fcmToken');

        let data_to_send = {
          student_id: this.state.AllData.student_id,
          code: pure_code,
          student_token,
        };
        console.log(data_to_send);
        axios
          .post(
            AppRequired.Domain + 'authentication/verification_student.php',
            data_to_send,
          )
          .then((res) => {
            console.log(res.data);
            if (res.status == 200) {
              if (res.data == 'used_code') {
                this.setState({
                  show_dialog: true,
                  message: 'تم شحن الكارت من قبل',
                });
              } else if (res.data == 'invalid_code') {
                /*
              invalid_code
              invalid_code_for_collection
              success
              error
              */
                this.setState({
                  show_dialog: true,
                  message: 'كود الشخص غير صحيح',
                });
              } else if (typeof res.data === 'object') {
                this.setData(res.data);
                this.props.navigation.navigate('HomePages');
              } else if (res.data == 'error') {
                this.setState({
                  show_dialog: true,
                  message: 'عذراً يرجي المحاوله لاحقاً',
                });
              } else {
              }
            } else {
              this.setState({
                show_dialog: true,
                message: 'عذراً يرجي المحاوله لاحقاً',
              });
            }
          })
          .finally(() => {
            this.setState({loading: false});
          });
      } else {
        this.setState({
          codeError: 'ادخل الكود صحيح',
        });
      }
    }
  };

  setData = async (data) => {
    await AsyncStorage.setItem('AllData', JSON.stringify(data));
    await AsyncStorage.setItem('switch', 'Home');
  };

  logOut = async () => {
    await AsyncStorage.setItem('switch', 'Auth');
    this.props.navigation.navigate('Auth');
    this.setState({showLogoutModal: false});
  };

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
        <StatusBar backgroundColor="#EFF1F0" barStyle="dark-content" />
        <ScrollView>
          <View
            style={{
              width: 108,
              height: 140,
              alignSelf: 'center',
              marginTop: 25,
            }}>
            <Image
              source={images.AppLogo}
              style={{flex: 1, width: '100%', height: '100%'}}
              resizeMode="contain"
            />
          </View>
          <Text
            style={{
              fontFamily: FONTS.fontFamily,
              color: COLORS.primary,
              fontSize: 20,
              alignSelf: 'center',
            }}>
            {AppRequired.appName}
          </Text>

          <Text
            style={{
              alignSelf: 'center',
              fontFamily: FONTS.fontFamily,
              color: COLORS.primary,
              fontSize: 22,
            }}>
            أدخل كود تأكيد الدخول
          </Text>

          <View
            style={{
              flexDirection: 'row',
              width: '90%',
              alignSelf: 'center',
              height: height * 0.07,
              marginVertical: 20,
              backgroundColor: '#DCDEDD',
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff',
                marginRight: 5,
                width: 50,
              }}>
              <FontAwesome5
                color={COLORS.primary}
                name="shield-alt"
                size={30}
              />
            </View>

            <TextInput
              placeholder="أدخل الكود"
              keyboardType="number-pad"
              style={{
                flex: 1,
                backgroundColor: '#fff',
                fontFamily: FONTS.fontFamily,
                fontSize: 17,
                textAlign: 'center',
              }}
              value={this.state.code}
              onChangeText={(value) => {
                this.setState({
                  code: value
                    .replace(/\s/g, '')
                    .replace(/(\d{4})/g, '$1 ')
                    .trim(),
                  codeError: '',
                });
              }}
            />
          </View>

          <Text
            style={{
              textAlign: 'center',
              color: 'red',
              fontSize: 14,
              fontWeight: '800',
              fontFamily: FONTS.fontFamily,
              marginTop: 5,
            }}>
            {this.state.codeError}
          </Text>

          <TouchableOpacity
            onPress={() => this.CheckCode()}
            disabled={this.state.loading}>
            <View
              style={{
                width: '90%',
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                backgroundColor: COLORS.primary,
                margin: 10,
                alignSelf: 'center',
                borderRadius: 10,
              }}>
              {this.state.loading == false ? (
                <Text
                  style={{
                    fontSize: 16,
                    color: '#FFFFFF',
                    // fontWeight: 'bold',
                    fontFamily: FONTS.fontFamily,
                    fontStyle: 'normal',
                  }}>
                  تاكيد...
                </Text>
              ) : (
                <ActivityIndicator color="white" size={30} />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              this.setState({
                showLogoutModal: true,
              });
            }}>
            <View
              style={{
                width: '90%',
                margin: '5%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 18, fontFamily: FONTS.fontFamily}}>
                تسجيل الخروج
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>

        {this.state.show_dialog ? (
          <View
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              backgroundColor: 'rgba(0,0,0,0.3)',
              alignItems: 'center',
              justifyContent: 'center',
              // opacity:0.5
            }}>
            <View
              style={{
                width: '85%',
                alignItems: 'center',
                backgroundColor: '#fff',
                borderRadius: 10,
                paddingTop: 10,
              }}>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: 'bold',
                  letterSpacing: 4,
                  marginBottom: 15,
                  marginTop: 5,
                  color: COLORS.primary,
                }}>
                {AppRequired.appName}
              </Text>

              <View
                style={{
                  height: 1,
                  backgroundColor: '#ddd',
                  width: '100%',
                }}
              />

              <Text
                style={{
                  fontSize: 16,
                  letterSpacing: 1.5,
                  marginVertical: 25,
                  fontFamily: FONTS.fontFamily,
                  color: COLORS.primary,
                }}>
                {this.state.message}
              </Text>

              <View
                style={{
                  height: 1,
                  backgroundColor: '#ddd',
                  width: '100%',
                }}
              />

              <TouchableOpacity
                style={{
                  width: '100%',
                  alignItems: 'center',
                }}
                onPress={() => {
                  this.setState({
                    show_dialog: false,
                  });
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    paddingVertical: 20,
                    color: COLORS.primary,
                  }}>
                  OK
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        <Modal
          visible={this.state.showLogoutModal}
          onRequestClose={() => {
            this.setState({showLogoutModal: false});
          }}
          transparent={true}>
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <View
              style={{
                width: '90%',
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
                  هل تريد تسجيل الخروج ؟
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
                  marginTop: 7,
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'red',
                    borderRadius: 8,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,

                    elevation: 5,
                  }}
                  onPress={() => {
                    this.logOut();
                  }}>
                  <Text
                    style={{
                      fontFamily: FONTS.fontFamily,
                      color: '#000',

                      fontSize: 20,
                    }}>
                    خروج
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  disabled={this.state.logoutLoading}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginHorizontal: 40,
                  }}
                  onPress={() => {
                    this.setState({showLogoutModal: false});
                  }}>
                  <Text
                    style={{
                      fontFamily: FONTS.fontFamily,
                      color: '#000',
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
const styles = StyleSheet.create({
  signuptxt: {
    fontSize: 18,
    fontFamily: FONTS.fontFamily,
    // fontWeight: 'bold',
    alignSelf: 'center',
    // marginBottom: 10,
    // lineHeight: 28,
  },
  icontxt: {
    marginLeft: 16,
    marginTop: 20,
    marginBottom: 25,
  },
  textinstyle: {
    width: '100%',
    height: '100%',
    flex: 1,
    textAlign: 'center',
  },
  ConnectionView: {
    width: '100%',
    height: 20,
    position: 'absolute',
    zIndex: 222,
    backgroundColor: '#492E41',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
