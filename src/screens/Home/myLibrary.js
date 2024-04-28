import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Modal,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import { AppRequired, COLORS, FONTS, images, SIZES } from '../../constants';
import { Container, Header, Left, Body, Right, Title } from 'native-base';
import axios from 'axios';
// import Modal from 'react-native-modalbox';
export default class MyLibrary extends React.Component {
  constructor() {
    super();
    this.state = {
      connection_Status: 'Online',
      openLogoutModal: false,
      in_review: "0"
    };
  }


  check_in_rev() {
    axios.get("https://camp-coding.online/law_plus/android_review_v2.php").then((res) => {
      if (res.status == 200) {
        // console.log(res.data + "kkkk")
        this.setState({ in_review: res.data })
      }
    })
  }

  async componentDidMount() {
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      this.check_in_rev()
      if (state.isConnected == true) {
        this.setState({
          connection_Status: 'Online',
        });
      } else {
        this.setState({
          connection_Status: 'Offline',
        });
      }
    });
  }

  async checkLogout() {
    this.setData();
    this.props.navigation.navigate('Auth');
  }
  async setData() {
    await AsyncStorage.clear();
    await AsyncStorage.setItem('switch', 'Auth');
  }

  Sections({ name, image, onPress }) {
    return (
      <View
        style={{
          backgroundColor: '#fff',
          // alignItems: 'center',
          // justifyContent: 'center',
          margin: 16,
          borderRadius: 15,
          // flexDirection: 'row',
          // elevation: 1,
          overflow: 'hidden',
        }}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onPress}
          style={{ flex: 1 }}>
          <ImageBackground
            source={image}
            style={{
              height: 200,
              width: '100%',
              alignItems: 'flex-end',
            }}
            resizeMode="contain">
            <LinearGradient
              start={{ x: 0.0, y: 0 }}
              end={{ x: 0.1, y: 1.0 }}
              locations={[0, 0.5, 0.8]}
              useAngle={true}
              angle={90}
              angleCenter={{ x: 0.5, y: 0.5 }}
              colors={[
                '#fff',
                'rgba(255,255,255,0.9)',
                'rgba(255,255,255,0.01)',
              ]}
              style={{
                width: '75%',
                height: '100%',
                padding: 15,
                // alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  ...styles.popularBadge,
                  marginTop: 0,
                  marginRight: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    alignSelf: 'flex-end',
                    color: '#000',
                    fontFamily: FONTS.fontFamily,
                    fontSize: 20,
                  }}>
                  {name}
                </Text>
              </View>
            </LinearGradient>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    );
  }
  render() {
    return (
      <Container style={{ backgroundColor: '#e9e9e9' }}>
        <Header
          androidStatusBarColor={COLORS.primary}
          style={{ backgroundColor: COLORS.primary }}>
          <Left>
            <View
              style={{
                ...styles.leftHeader,
              }}></View>
          </Left>
          <Body></Body>
          <Right>
            <Title>{AppRequired.appName}</Title>
          </Right>
        </Header>

        <ScrollView
          contentContainerStyle={{
            marginBottom: 60,
          }}
          showsVerticalScrollIndicator={false}>
          {this.state.in_review == "0" &&
            <this.Sections
              name={'الشحن'}
              image={images.Charge}
              onPress={() => {
                this.props.navigation.navigate('Charge');
              }}
            />
          }
          {/* <this.Sections
            name={'الاشعارات'}
            image={images.setting}
            onPress={() => {
              this.props.navigation.navigate('Notifications');
            }}
          /> */}
          <this.Sections
            name={'الاعدادات'}
            image={images.setting}
            onPress={() => {
              this.props.navigation.navigate('Setting');
            }}
          />

          <this.Sections
            name={'دعوة صديق'}
            image={images.referFriend}
            onPress={() => {
              this.props.navigation.navigate('ReferFriend');
            }}
          />



          {this.state.in_review == "0" &&
            <this.Sections
              name={'دعم مشاكل الشحن'}
              image={images.support}
              onPress={() => {
                this.props.navigation.navigate('ContactUsScreen', {
                  type: "support"
                });
              }}
            />
          }
          <this.Sections
            name={'قانوني بلس'}
            image={images.AppLogo}
            onPress={() => {
              this.props.navigation.navigate('AboutApp');
            }}
          />
          <this.Sections
            name={'Camp Coding'}
            image={images.Camp}
            onPress={() => {
              this.props.navigation.navigate('AboutCamp');
            }}
          />

          <TouchableOpacity
            onPress={() => {
              this.setState({
                openLogoutModal: true,
              });
            }}
            style={{
              backgroundColor: 'rgba(255,0,0,0.6)',
              width: '80%',
              paddingHorizontal: 20,
              paddingVertical: 10,
              alignSelf: 'center',
              borderRadius: SIZES.radius,
              marginVertical: 100,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,

              elevation: 5,
            }}>
            <Text
              style={{
                color: '#000',
                fontFamily: FONTS.fontFamily,
                fontSize: 18,
              }}>
              تسجيل الخروج
            </Text>
          </TouchableOpacity>
        </ScrollView>
        <Modal
          visible={this.state.openLogoutModal}
          onRequestClose={() => {
            this.setState({
              openLogoutModal: false,
            });
          }}
          transparent={true}>
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
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

              <View style={{ paddingHorizontal: 20, paddingVertical: 12 }}>
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
                  marginVertical: 7,
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
                    this.checkLogout();
                    this.setState({
                      openLogoutModal: false,
                    });
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
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginHorizontal: 40,
                  }}
                  onPress={() => {
                    this.setState({
                      openLogoutModal: false,
                    });
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
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  leftUnderHeaderContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    padding: 7,
    justifyContent: 'flex-end',
  },
  streamMonthContainer: {
    marginHorizontal: 10,
    alignItems: 'center',
    // justifyContent: 'center',
    paddingVertical: 10,
    elevation: 1,
    overflow: 'hidden',
  },
  leftHeader: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchDataFilterContainer: {
    width: '100%',
    alignSelf: 'center',
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
});
