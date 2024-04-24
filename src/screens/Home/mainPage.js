import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ToastAndroid,
  RefreshControl,
  Alert,
  StatusBar,
  BackHandler,
  Animated,
  Platform,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import * as Animatable from 'react-native-animatable';
import axios from 'axios';
import firebase from 'react-native-firebase';
import { AppRequired, COLORS, FONTS, images, SIZES } from '../../constants';
import { Container, Header, Body, Right, Title } from 'native-base';
import DeviceInfo from 'react-native-device-info';
import { UserContext } from '../Context/UserContext';
const ITEM_SIZE =
  Platform.OS === 'ios' ? SIZES.width * 0.72 : SIZES.width * 0.50;
const EMPTY_ITEM_SIZE = (SIZES.width - ITEM_SIZE) / 2;
export default class MainPage extends React.Component {
  static contextType = UserContext;
  constructor() {
    super();
    this.state = {
      scrollX: new Animated.Value(0),
      connection_Status: 'Online',
      streamsOfMonth: [],
      loading: true,
      refreshing: false,
      //
      visableAppProfModal: false,
      code: '',
      codeerr: '',
      checkTeacherRes: false,
      //
      selectedTeacher: {},
      show_dialog: false,
      message: '',
    };
  }

  ///////////////////////////////////////////////////    notification

  async componentDidMount() {
    this.checkPermission();
    this.createNotificationListeners();

    const unsubscribe = NetInfo.addEventListener(async (state) => {
      if (state.isConnected == true) {
        this.setState({
          connection_Status: 'Online',
        });
        this.getData();
      } else {
        this.setState({
          connection_Status: 'Offline',
        });
      }
    });

    // Register all listener for notification
  }

  setData = async () => {
    await AsyncStorage.clear();
    await AsyncStorage.setItem('switch', 'Auth');
  };

  async save_points(data) {
    let studentData = JSON.parse(await AsyncStorage.getItem('AllData'));
    studentData.student_points = data.points;
    await AsyncStorage.setItem('AllData', JSON.stringify(studentData));
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
    let fcmToken = await firebase.messaging().getToken();
    let storeToken = await AsyncStorage.getItem('fcmToken');

    if (fcmToken != storeToken) {
      this.saveToken(fcmToken);
    } else {
      // console.log('the same token');
    }
  }

  async saveToken(fcmToken) {
    await AsyncStorage.setItem('fcmToken', fcmToken);

    let studentData = JSON.parse(await AsyncStorage.getItem('AllData'));
    let data_to_send = {
      student_id: studentData.student_id,
      student_token: fcmToken,
    };
    axios
      .post(
        AppRequired.Domain + 'authentication/update_student_token.php',
        data_to_send,
      )
      .then((res) => {
        if (res.status == 200) {
          if (res.data == 'same') {
            // console.log('finish send');
          } else {
            // console.log('error');
          }
        } else {
          // console.log('error');
        }
      });
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

  async createNotificationListeners() {
    // This listener triggered when notification has been received in foreground
    this.notificationListener = firebase
      .notifications()
      .onNotification((notification) => {
        // const {title, body, data} = notification;
        // Alert.alert(
        //   title,
        //   body,
        //   [
        //     {
        //       text: 'cancel',
        //       onPress: () => {},
        //     },
        //     {
        //       text: 'go',
        //       onPress: () => {
        //         if (data.page_to_go == 'vs') {
        //           this.props.navigation.navigate('PendingChalenge');
        //         } else if (data.page_to_go == 'exam') {
        //           this.props.navigation.navigate('ExamList');
        //         } else if (data.page_to_go == 'quiz') {
        //           this.props.navigation.navigate('QuizList');
        //         }
        //       },
        //     },
        //   ],
        //   {
        //     cancelable: true,
        //   },
        // );
      });

    // This listener triggered when app is in backgound and we click, tapped and opened notifiaction
    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened((notificationOpen) => {
        // const {title, body, data} = notificationOpen.notification;
        // if (data.page_to_go == 'vs') {
        //   this.props.navigation.navigate('PendingChalenge');
        // } else if (data.page_to_go == 'exam') {
        //   this.props.navigation.navigate('ExamList');
        // } else if (data.page_to_go == 'quiz') {
        //   this.props.navigation.navigate('QuizList');
        // }
      });

    // This listener triggered when app is closed and we click,tapped and opened notification
    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    // if (notificationOpen) {
    // const {title, body, data} = notificationOpen.notification;
    // if (data.page_to_go == 'vs') {
    //   this.props.navigation.navigate('PendingChalenge');
    // } else if (data.page_to_go == 'exam') {
    //   this.props.navigation.navigate('ExamList');
    // } else if (data.page_to_go == 'quiz') {
    //   this.props.navigation.navigate('QuizList');
    // }
    // }
  }

  ///////////////////////////////////////////////////   end notification
  async checkLogout() {
    this.setData();
    this.props.navigation.navigate('Auth');
  }
  async setData() {
    await AsyncStorage.clear();
    await AsyncStorage.setItem('switch', 'Auth');
  }
  getData = async () => {
    let StudentData = JSON.parse(await AsyncStorage.getItem('AllData'));
    let student_token = await AsyncStorage.getItem('fcmToken');
    let uniqueId = await DeviceInfo.getUniqueId();

    let data_to_send = {
      student_id: StudentData.student_id,
      student_token,
      genId: StudentData.generation_id,
      mac: uniqueId

    };
    console.log(data_to_send)

    axios
      .post(AppRequired.Domain + 'home/select_your doctors.php', data_to_send)
      .then((res) => {
        if (res.status == 200) {
          console.log(JSON.stringify(res.data));
          // if (res.data.version == '2') {
          if (Array.isArray(res.data.doctors) && res.data.doctors.length > 0) {
            this.setState({
              streamsOfMonth: [{ name: '' }, ...res.data.doctors, { name: '' }],
            });
          } else if (res.data == 'out') {
            this.checkLogout()
          }
          else {
            this.setState({
              streamsOfMonth: [],
            });
          }
          // } else {
          //   Alert.alert(
          //     AppRequired.appName,
          //     'يجب تحديث التطبيق',
          //     [
          //       {
          //         text: 'إغلاق',
          //         onPress: async () => {
          //           await Linking.openURL(
          //             'https://play.google.com/store/apps/details?id=com.camp_angloacademy',
          //           );
          //           BackHandler.exitApp();
          //         },
          //       },
          //     ],
          //     {
          //       cancelable: false,
          //     },
          //   );
          // }
        } else {
          ToastAndroid.showWithGravityAndOffset(
            'عذرا يرجى المحاوله فى وقت لاحق',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50,
          );
        }
      })
      .finally(() => {
        this.setState({
          loading: false,
          refreshing: false,
        });
      });
  };

  renderStreamsOfMonth = () => {
    const { scrollX } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <Animated.FlatList
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          data={this.state.streamsOfMonth}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.getData.bind(this)}
              colors={[COLORS.primary, COLORS.primary]}
            />
          }
          // horizontal
          bounces={false}
          decelerationRate={Platform.OS === 'ios' ? 0 : 0.98}
          snapToInterval={ITEM_SIZE}
          snapToAlignment="center"
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            {
              useNativeDriver: false,
            },
          )}
          contentContainerStyle={{
            alignItems: 'center',
            // marginBottom: 100,
            paddingBottom: 100
          }}
          scrollEventThrottle={16}
          ListEmptyComponent={() => {
            return (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: SIZES.width,

                  paddingTop: '40%',
                }}>
                <Text
                  style={{
                    fontFamily: FONTS.fontFamily,
                    fontSize: 20,
                  }}>
                  لا توجد مواد متاحه
                </Text>
              </View>
            );
          }}
          renderItem={({ item, index }) => {
            if (!item.subject_name) {
              return <View style={{ width: EMPTY_ITEM_SIZE }} />;
            }
            // const inputRange = [
            //   (index - 2) * ITEM_SIZE,
            //   (index - 1) * ITEM_SIZE,
            //   index * ITEM_SIZE,
            // ];

            // const translateY = scrollX.interpolate({
            //   inputRange,
            //   outputRange: [50, 100, 50],
            //   extrapolate: 'clamp',
            // });
            return (
              <Animatable.View
                animation="fadeInUp"
                key={index}
                delay={index * 100}
                useNativeDriver
                style={{
                  marginVertical: 10,
                  backgroundColor: 'white',
                  borderRadius: 34,
                  elevation: 5,
                  width: SIZES.width * 0.85,
                  overflow: 'hidden',
                }}>
                <TouchableOpacity
                  onPress={() => {

                    this.props.navigation.navigate('BuyVideos');
                    let { setTeacherData } = this.context;
                    setTeacherData(item);
                  }}
                  style={{
                    width: '100%',
                    padding: 10 * 2,
                    alignItems: 'center',
                    height: ITEM_SIZE * 1.6,
                    // height: '100%',
                    backgroundColor: COLORS.lightGray,
                  }}>
                  <Image
                    source={
                      item.subject_image
                        ? { uri: item.subject_image }
                        : images.AppLogo
                    }
                    style={styles.posterImage}
                    resizeMode="stretch"
                  />
                  <View
                    style={{
                      backgroundColor: COLORS.lightGray2,
                      paddingHorizontal: 10,
                      // paddingVertical: -2,
                      borderRadius: 8,
                      alignItems: 'center',
                      justifyContent: 'center',
                      flex: 1,
                    }}>
                    <Text
                      numberOfLines={2}
                      style={{
                        fontSize: 18,
                        fontFamily: FONTS.fontFamily,
                        textAlign: 'center',
                      }}>
                      {item.subject_name}
                    </Text>
                  </View>
                </TouchableOpacity>
                {item.discount != '' && (
                  <View
                    style={{
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      backgroundColor: COLORS.primary,
                      borderRadius: 8,
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
                        fontFamily: FONTS.fontFamily,
                        color: '#FFF',
                      }}>
                      خصم {item.discount}%
                    </Text>
                  </View>
                )}
              </Animatable.View>
            );
          }}
        />
      </View>
    );
  };

  render() {
    return (
      <Container style={{ backgroundColor: '#e9e9e9' }}>
        <Header
          androidStatusBarColor={COLORS.primary}
          style={{ backgroundColor: COLORS.primary }}>
          {/* <Left>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                this.setState({
                  visableAppProfModal: true,
                });
                // this.props.navigation.navigate('Charge');
              }}
              style={{
                ...styles.leftHeader,
                paddingHorizontal: 4,
                backgroundColor: '#089f50',
              }}>

              <AntDesign name="team" color={'#fff'} size={20} />
            </TouchableOpacity>
          </Left> */}
          <Body></Body>
          <Right>
            <Title>{AppRequired.appName}</Title>
          </Right>
        </Header>

        {this.state.loading == true &&
          this.state.connection_Status == 'Online' ? (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={images.InfinityLoading}
              style={{
                width: 100,
                height: 100,
              }}
              resizeMode="contain"
            />
          </View>
        ) : this.state.loading == false ? (
          this.renderStreamsOfMonth()
        ) : this.state.connection_Status == 'Offline' ? (
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <StatusBar backgroundColor={COLORS.secondary} />
            <Text
              style={{
                fontFamily: FONTS.fontFamily,
                fontSize: 22,
              }}>
              الرجاء التأكد من اتصالك بالأنترنت
            </Text>
          </View>
        ) : null}

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
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  item_of_month_stream: {
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
    margin: 16,
    borderRadius: 15,
    // flexDirection: 'row',
    // elevation: 1,
    overflow: 'hidden',
  },

  LinearGradientStyle: {
    width: '75%',
    height: '100%',
    padding: 15,
  },

  leftHeader: {
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 70 / 2,
    backgroundColor: '#000',
  },

  searchDataFilterContainer: {
    width: '100%',
    alignSelf: 'center',
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  posterImage: {
    width: '100%',
    height: ITEM_SIZE * .9,
    resizeMode: 'cover',
    borderRadius: 8,
    margin: 0,
    marginBottom: 5,
  },
});
