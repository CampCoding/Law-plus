import * as React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  FlatList,
  Animated,
  Image,
  NativeModules,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Title,
  Spinner,
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';

import axios from 'axios';

const {width, height} = Dimensions.get('window');
import NetInfo from '@react-native-community/netinfo';
import {AppRequired, COLORS, FONTS, images} from '../../constants';

export default class SolvedExam extends React.Component {
  //constructor

  constructor(props) {
    super(props);

    this.state = {
      id: this.props.navigation.getParam('quiz_id'),
      quiz_name: this.props.navigation.getParam('quiz_name'),
      questions: [],
      loading: true,
      bottomConnectionMsg: new Animated.Value(-100),
      connection_Status: 'Offline',
    };
    this._subscription;
  }

  componentWillUnmount() {
    // this._subscription && this._subscription()
  }
  async componentDidMount() {
    // this._subscription = NetInfo.addEventListener(
    //   this._handelConnectionInfoChange,
    // );
    // this.backHandler = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   this.backAction,
    // )
    this.forbidFunction();
    this.get_questions();

    const unsubscribe = NetInfo.addEventListener(async (state) => {
      // console.log('Connection value ' + state.isConnected);
      // console.log('Connection type ' + state.type);
      if (state.isConnected == true) {
        this.setState({
          connection_Status: 'Online',
        });
        Animated.spring(this.state.bottomConnectionMsg, {
          toValue: -100,
        }).start();
      } else {
        this.setState({
          connection_Status: 'Offline',
        });
        Animated.spring(this.state.bottomConnectionMsg, {toValue: 0}).start();
      }
    });
  }

  allowFunction = async () => {
    try {
      const result = await NativeModules.PreventScreenshotModule.allow();
      // console.log(result);
    } catch (e) {
      // console.log(e);
    }
  };

  forbidFunction = async () => {
    try {
      const result = await NativeModules.PreventScreenshotModule.forbid();
      // console.log(result);
    } catch (e) {
      // console.log(e);
    }
  };
  // _handelConnectionInfoChange = async (NetInfoState) => {
  //   const data = JSON.parse(await AsyncStorage.getItem('AllData'));
  //   if (NetInfoState.isConnected == true) {
  //     this.setState(({}) => ({
  //       connection_Status: 'Online',
  //     }));

  //     this.get_questions();

  //     Animated.spring(this.state.bottomConnectionMsg, {
  //       toValue: -100,
  //     }).start();
  //   } else {
  //     this.setState(({}) => ({
  //       connection_Status: 'Offline',
  //     }));
  //     Animated.spring(this.state.bottomConnectionMsg, {toValue: 0}).start();
  //   }
  // };

  async get_questions() {
    // this.setState({disabled: true});
    let student_token = await AsyncStorage.getItem('fcmToken');

    let data_to_send = {
      id: this.state.id,
      student_token,
    };

    axios
      .post(AppRequired.Domain + `home/select_questions.php`, data_to_send)
      .then((res) => {
        if (res.status == 200) {
          // console.log(res.data)
          if (res.data != 'error') {
            if (res.data.questions.length > 0) {
              this.setState({
                questions: res.data.questions,
              });
              // console.log(this.state.questions)
            } else {
              Alert.alert(
                AppRequired.appName + '',
                'لا يوجد أسئله',
                [
                  {
                    text: '',
                    onPress: () => {},
                    style: 'cancel',
                  },
                  {text: 'حسنا', onPress: () => {}},
                ],
                {cancelable: false},
              );
            }
          } else {
            Alert.alert(
              AppRequired.appName + '',
              'عذرا يرجي المحاوله في وقتا لاحق',
              [
                {
                  text: '',
                  onPress: () => {},
                  style: 'cancel',
                },
                {text: 'حسنا', onPress: () => {}},
              ],
              {cancelable: false},
            );
          }
        } else {
          Alert.alert(
            AppRequired.appName + '',
            'عذرا يرجي المحاوله في وقتا لاحق',
            [
              {
                text: '',
                onPress: () => {},
                style: 'cancel',
              },
              {text: 'حسنا', onPress: () => {}},
            ],
            {cancelable: false},
          );
        }
        this.setState({loading: false});
      });
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
      <Container style={{backgroundColor: '#fff', paddingBottom: 50}}>
        <View
          style={{
            width: width,
            height: height * 0.1,
            backgroundColor: COLORS.primary,
            borderBottomLeftRadius: 50,
            borderBottomRightRadius: 50,
            flexDirection: 'row',
          }}>
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack();
              }}>
              <Icon
                name="arrow-right"
                style={{fontSize: 24, color: '#fff', marginLeft: 10}}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{flex: 2, alignItems: 'center', justifyContent: 'center'}}>
            <Text
              style={{
                fontFamily: FONTS.fontFamily,
                color: '#fff',
                fontSize: 18,
              }}>
              {this.state.quiz_name.slice(0, 22)}
            </Text>
          </View>
          <View style={{flex: 1}} />
        </View>
        {/* <Header style={{backgroundColor: color}} androidStatusBarColor={color}>
          <Left style={{flex: 1}}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack();
              }}>
              <Icon
                name="arrow-right"
                style={{fontSize: 20, color: '#fff', marginLeft: 10}}
              />
            </TouchableOpacity>
          </Left>
          <Body
            style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
            <Title
              numberOfLines={2}
              style={{
                fontSize: 17,
                fontFamily: fontFamily,
                alignSelf: 'center',
                textAlign: 'center',
              }}>
              {this.state.quiz_name.slice(0, 22)}
            </Title>
          </Body>
          <Right />
        </Header> */}
        {
          // <Text>{item.exam_name}</Text>
        }

        {this.state.loading == true &&
        this.state.connection_Status == 'Online' ? (
          <Spinner color={COLORS.primary} size={40} style={{marginTop: 200}} />
        ) : (
          <View>
            {this.state.questions.length == 0 ? (
              <View
                style={{
                  width: width,
                  height: height - 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    color: COLORS.primary,
                    fontFamily: FONTS.fontFamily,
                  }}>
                  لا يوجد اسئلة محلوله
                </Text>
              </View>
            ) : this.state.loading == false ? (
              <View style={{marginVertical: 15}}>
                <FlatList
                  data={this.state.questions}
                  renderItem={({item, index}) => (
                    <>
                      {item.question_image == null ? null : (
                        <View
                          style={{
                            // flex: 1,
                            width: '100%',
                            // height: 200,
                            // marginTop: 30,
                            // backgroundColor: 'red',
                          }}>
                          <View
                            style={{
                              // backgroundColor: 'red',
                              width: '90%',
                              margin: '5%',
                            }}>
                            <Text
                              style={{
                                textAlign: 'left',
                                alignSelf: 'flex-start',
                                fontSize: 18,
                              }}>
                              {'( ' + (index + 1)}
                            </Text>
                          </View>
                          <View style={{width: '100%', height: 200}}>
                            <Image
                              source={{uri: item.question_image}}
                              style={{
                                flex: 1,
                                width: null,
                                height: null,
                                // width: '100%',
                                // height: 200,
                                // alignSelf: 'center',
                                // marginTop: 10,
                                marginBottom: 30,
                                resizeMode: 'contain',
                              }}
                            />
                          </View>
                        </View>
                      )}
                      <View
                        style={{
                          width: '90%',
                          alignSelf: 'center',
                          marginBottom: 15,
                          borderRadius: 7,
                          elevation: 1,
                        }}>
                        <View
                          style={{
                            // backgroundColor: '#ddd',
                            paddingHorizontal: 12,
                            paddingVertical: 15,
                            // borderTopLeftRadius: 10,
                            // borderTopRightRadius: 10,
                          }}>
                          {item.question_image == null ? (
                            <Text style={{fontSize: 22, color: '#000'}}>
                              {index + 1 + ')  ' + item.question_text}
                            </Text>
                          ) : (
                            <Text style={{fontSize: 22, color: '#000'}}>
                              {item.question_text}
                            </Text>
                          )}
                        </View>

                        <View
                          style={{
                            backgroundColor: COLORS.primary,
                            paddingHorizontal: 12,
                            paddingVertical: 20,
                            borderBottomLeftRadius: 10,
                            borderBottomRightRadius: 10,
                          }}>
                          <Text style={{fontSize: 18, color: '#FFF'}}>
                            {item.question_valid_answer}
                          </Text>
                        </View>
                      </View>
                    </>
                  )}
                />
              </View>
            ) : this.state.connection_Status != 'Offline' ? null : (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: height / 3,
                }}>
                <Image
                  style={{width: '70%', height: height / 4}}
                  source={images.NoInternet}
                />
                <Text
                  style={{
                    marginTop: 10,
                    fontSize: 18,
                    fontFamily: FONTS.fontFamily,
                  }}>
                  لا يوجد اتصال بالإنترنت
                </Text>
              </View>
            )}
          </View>
        )}
        <ViewConnectionMsg ConnectionEnter="لا يوجد اتصال بالإنترنت" />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  ConnectionView: {
    width: '100%',
    height: 20,
    position: 'absolute',
    zIndex: 222,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
