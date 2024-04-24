import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  FlatList,
  StatusBar,
  Modal,
  StyleSheet,
  ActivityIndicator,
  ToastAndroid,
  Linking,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import NetInfo from '@react-native-community/netinfo';
import firebase from 'react-native-firebase';
import LottieView from 'lottie-react-native';

import { TextInput, Snackbar, Button } from 'react-native-paper';
import axios from 'axios';
import * as Animatable from 'react-native-animatable';
import { RefreshControl } from 'react-native';
import {
  AppRequired,
  COLORS,
  FONTS,
  images,
  SIZES,
  lottie,
  icons,
} from '../../constants';
import { UserContext } from '../Context/UserContext';
export default class BuyVideos extends React.Component {
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.state = {
      allLictures: [],
      isPageLoading: true,
      connectionStatus: false,
      visableBuyModal: false,
      visableBuyWholeModal: false,

      buying_code: '',
      isWantSubscripe: false,
      payButtonLoading: false,
      vedio_details: {},
      selected_index: 0,
      availableToBuy: false,
      buyingWholeMsg: '',
      money: 0,
      getBalanceLoading: true,
    };
  }

  async componentDidMount() {
    let { teacherData } = this.context;
    this.setState({
      buyingWholeMsg: teacherData.discount,
    });
    const unsubscribe = NetInfo.addEventListener((state) => {
      this.setState({
        connectionStatus: state.isConnected,
      });
    });
    this.props.navigation.addListener(
      'didFocus',
      payload => {
        this.setState({ isPageLoading: true });
        this.getAllMyLictures();
        this.getCurrentBalence();
      });



  }



  getCurrentBalence = async () => {
    let StudentData = JSON.parse(await AsyncStorage.getItem('AllData'));
    let student_token = await AsyncStorage.getItem('fcmToken')
    let data_to_send = {
      student_id: StudentData.student_id,
      student_token: student_token
    };
    axios
      .post(AppRequired.Domain + 'home/select_balance.php', data_to_send)
      .then((res) => {
        console.log(res.data)
        if (res.status == 200) {
          if (res.data * 0 == 0) {
            this.setState({
              money: parseFloat(res.data),
              // getBalanceLoading: false,
            });
          } else {
            ToastAndroid.showWithGravity(
              'عذرا حدث خطأ ما',
              ToastAndroid.SHORT,
              ToastAndroid.CENTER,
            );
            // this.setState({getBalanceLoading: false});
          }
        } else {
          ToastAndroid.showWithGravity(
            'عذرا حدث خطأ ما',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
          // this.setState({getBalanceLoading: false});
        }
      });
  };

  getAllMyLictures = async () => {
    let { teacherData } = this.context;
    const data = JSON.parse(await AsyncStorage.getItem('AllData'));

    let data_to_send = {
      student_id: data.student_id,
      subject_id: teacherData.subject_id,
    };

    console.log(data_to_send)

    axios
      .post(
        AppRequired.Domain + 'home/lectures/select_lectures.php',
        data_to_send,
      )
      .then((res) => {
        console.log(res.data);
        this.setState({
          isPageLoading: false,
        });
        if (Array.isArray(res.data) && res.data.length != 0) {
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].lecture_locked == 1) {
              this.setState({
                availableToBuy: true,
              });
              break;
            }
          }
          this.setState({
            allLictures: res.data,
            thereIsVideos: true,
          });
        } else {
          this.setState({ allLictures: [] });
        }
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  async buyVideo(reason) {
    this.setState({
      payButtonLoading: true,
    });

    let { teacherData } = this.context;

    const data = JSON.parse(await AsyncStorage.getItem('AllData'));
    let student_token = await AsyncStorage.getItem('fcmToken');

    let selected_item = this.state.vedio_details;
    var data_to_send = {};

    var domain = '';

    if (reason == 'one') {
      domain = AppRequired.Domain + 'home/lectures/buy_single_lecture.php';
      data_to_send = {
        student_id: data.student_id,
        lecture_id: selected_item.lec_id,
        // code: this.state.buying_code.trim(),
        student_token,
      };
    } else {
      domain = AppRequired.Domain + 'home/lectures/buy_all_lecetures_by_code.php';

      data_to_send = {
        student_id: data.student_id,
        subject_id: teacherData.subject_id,
        code: this.state.buying_code.trim(),
        student_token,
      };
    }

    axios
      .post(domain, data_to_send)
      .then((res) => {
        if (res.status == 200) {
          console.log(res.data)
          if (res.data == 'success') {
            // this.setState({
            //   visableSnackBar: true,
            // });

            alert(
              reason == 'one'
                ? 'تم شراء المحاضرة بنجاح'
                : 'تم شراء جميع المحاضرات بنجاح',
            );
            this.getCurrentBalence();

            let allData = this.state.allLictures;

            if (reason == 'one') {
              allData[this.state.selected_index].lecture_locked = '0';
              this.setState({
                allLictures: allData,
                buying_code: '',
                isWantSubscripe: false,
                visableBuyModal: false,
              });

              for (let i = 0; i < allData.length; i++) {
                if (allData[i].lecture_locked == 1) {
                  this.setState({
                    availableToBuy: true,
                  });
                  break;
                } else {
                  this.setState({
                    availableToBuy: false,
                  });
                }
              }
            } else {
              allData.map((item) => (item.lecture_locked = '0'));
              this.setState({
                allLictures: allData,
                buying_code: '',
                isWantSubscripe: false,
                visableBuyWholeModal: false,
                availableToBuy: false,
              });
            }
          } else if (res.data == 'code_not_found') {
            ToastAndroid.showWithGravityAndOffset(
              'الكود الذى ادخلتة غير صالح',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
          } else if (res.data == 'code_used') {

            Alert.alert("قانوني بلس",
              'هذا الكود مستخدم من قبل',

            );
          }
          else if (res.data == 'code_invalid') {
            Alert.alert("قانوني بلس",
              'هذا الكود غير صالح للاستخدام',

            );
          } else if (res.data == "balance_not_enough") {
            Alert.alert("قانوني بلس",
              "رصيدك لا يكفي لشراء المحاضرة"
            );
          }
          else if (res.data == 'wrong_code') {
            ToastAndroid.showWithGravityAndOffset(
              'هذا الكود الذى ادخلتة غير صالح',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
          } else if (res.data == 'not_avilable') {
            ToastAndroid.showWithGravityAndOffset(
              '',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
          } else {
            ToastAndroid.showWithGravityAndOffset(
              'الرجاء المحاولة فى وقت لاحق',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
          }
        } else {
          ToastAndroid.showWithGravityAndOffset(
            'الرجاء المحاولة فى وقت لاحق',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50,
          );
        }
      })
      .finally(() => {
        this.setState({
          payButtonLoading: false,
        });
      });
  }
  // async buyVideo(reason) {
  //   this.setState({
  //     payButtonLoading: true,
  //   });

  //   const data = JSON.parse(await AsyncStorage.getItem('AllData'));
  //   let student_token = await AsyncStorage.getItem('fcmToken');

  //   let selected_item = this.state.vedio_details;
  //   var data_to_send = {};

  //   if (reason == 'one') {
  //     data_to_send = {
  //       student_id: data.student_id,
  //       lecture_ids: selected_item.lec_id + '//CAMP//0',
  //       code: this.state.buying_code.trim(),
  //       student_token,
  //       boughtQte: 'one',
  //     };
  //   } else {
  //     let allData = this.state.allLictures;
  //     let lecture_ids = '';
  //     for (let i = 0; i < allData.length; i++) {
  //       if (i == allData.length - 1) {
  //         lecture_ids += allData[i].lec_id;
  //       } else {
  //         lecture_ids += allData[i].lec_id + '//CAMP//';
  //       }
  //     }
  //     data_to_send = {
  //       student_id: data.student_id,

  //       lecture_ids,
  //       code: this.state.buying_code.trim(),
  //       student_token,
  //       boughtQte: 'more',
  //     };
  //   }

  //   axios
  //     .post(AppRequired.Domain + 'home/lectures/buy_lecture.php', data_to_send)
  //     .then((res) => {
  //       if (res.status == 200) {
  //         if (res.data == 'success') {
  //           // this.setState({
  //           //   visableSnackBar: true,
  //           // });
  //           this.popNotification(
  //             reason == 'one'
  //               ? 'تم شراء المحاضرة بنجاح'
  //               : 'تم شراء جميع المحاضرات بنجاح',
  //           );

  //           let allData = this.state.allLictures;

  //           if (reason == 'one') {
  //             allData[this.state.selected_index].lecture_locked = '0';
  //             this.setState({
  //               allLictures: allData,
  //               buying_code: '',
  //               isWantSubscripe: false,
  //               visableBuyModal: false,
  //             });

  //             for (let i = 0; i < allData.length; i++) {
  //               if (allData[i].lecture_locked == 1) {
  //                 this.setState({
  //                   availableToBuy: true,
  //                 });
  //                 break;
  //               } else {
  //                 this.setState({
  //                   availableToBuy: false,
  //                 });
  //               }
  //             }
  //           } else {
  //             allData.map((item) => (item.lecture_locked = '0'));
  //             this.setState({
  //               allLictures: allData,
  //               buying_code: '',
  //               isWantSubscripe: false,
  //               visableBuyWholeModal: false,
  //               availableToBuy: false,
  //             });
  //           }
  //         } else if (res.data == 'code_not_found') {
  //           ToastAndroid.showWithGravityAndOffset(
  //             'الكود الذى ادخلتة غير صالح',
  //             ToastAndroid.LONG,
  //             ToastAndroid.CENTER,
  //             25,
  //             50,
  //           );
  //         } else if (res.data == 'card_used') {
  //           ToastAndroid.showWithGravityAndOffset(
  //             'هذا الكود مستخدم من قبل',
  //             ToastAndroid.LONG,
  //             ToastAndroid.CENTER,
  //             25,
  //             50,
  //           );
  //         } else if (res.data == 'wrong_code') {
  //           ToastAndroid.showWithGravityAndOffset(
  //             'هذا الكود الذى ادخلتة غير صالح',
  //             ToastAndroid.LONG,
  //             ToastAndroid.CENTER,
  //             25,
  //             50,
  //           );
  //         } else if (res.data == 'not_avilable') {
  //           ToastAndroid.showWithGravityAndOffset(
  //             '',
  //             ToastAndroid.LONG,
  //             ToastAndroid.CENTER,
  //             25,
  //             50,
  //           );
  //         } else {
  //           ToastAndroid.showWithGravityAndOffset(
  //             'الرجاء المحاولة فى وقت لاحق',
  //             ToastAndroid.LONG,
  //             ToastAndroid.CENTER,
  //             25,
  //             50,
  //           );
  //         }
  //       } else {
  //         ToastAndroid.showWithGravityAndOffset(
  //           'الرجاء المحاولة فى وقت لاحق',
  //           ToastAndroid.LONG,
  //           ToastAndroid.CENTER,
  //           25,
  //           50,
  //         );
  //       }
  //     })
  //     .finally(() => {
  //       this.setState({
  //         payButtonLoading: false,
  //       });
  //     });
  // }

  popNotification(msg) {
    const channel = new firebase.notifications.Android.Channel(
      'test-channel',
      'Test Channel',
      firebase.notifications.Android.Importance.Max,
    ).setDescription('My apps channel');
    firebase.notifications().android.createChannel(channel);

    const notification = new firebase.notifications.Notification()
      .setNotificationId('notificationId')
      .setTitle(AppRequired.appName)
      .setBody(msg);

    notification.android
      .setChannelId('test-channel')
      .android.setSmallIcon('ic_launcher');

    // Display the notification
    firebase.notifications().displayNotification(notification);
  }

  renderHeader() {
    return (
      <View
        style={{
          width: SIZES.width,
          height: SIZES.height * 0.1,
          backgroundColor: COLORS.primary,
          borderBottomLeftRadius: 50,
          borderBottomRightRadius: 50,
          flexDirection: 'row',
        }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.goBack();
            }}>
            <FontAwesome5
              name="arrow-right"
              style={{ fontSize: 24, color: '#fff', marginLeft: 10 }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
          <Text
            numberOfLines={2}
            style={{
              fontFamily: FONTS.fontFamily,
              color: '#fff',
              fontSize: 18,
            }}>
            {this.context.teacherData.subject_name}
          </Text>
        </View>

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('Notifications')
            }}>
            <Image source={icons.notification} style={{ width: 25, height: 25 }} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderMyVideoDetails = (item, index) => {
    return (
      <Animatable.View
        animation="fadeInUpBig"
        key={index}
        delay={index * 50}
        useNativeDriver>
        <TouchableOpacity
          activeOpacity={0.6}
          style={{
            ...styles.lectureContainer,
          }}
          onPress={() => {
            if (item.lecture_locked == 1) {
              this.setState({
                visableBuyModal: true,
                vedio_details: item,
                selected_index: index,
              });
            } else {
              console.log(item)
              this.props.navigation.navigate('VideosLibrary', {
                lectureData: item,
              });
            }
          }}>
          {item.lecture_locked == 1 ? (
            <View style={{ alignItems: 'center' }}>
              <FontAwesome5 name="lock" color="gold" size={24} />

              <Text
                style={{
                  color: '#fff',
                  fontFamily: FONTS.fontFamily,
                  fontSize: 8,
                }}>
                {item.lec_arrangement}
              </Text>
            </View>
          ) : (
            <Text
              style={{
                color: '#fff',
                fontFamily: FONTS.fontFamily,
                fontSize: 18,
              }}>
              {item.lec_arrangement}
            </Text>
          )}
        </TouchableOpacity>
      </Animatable.View>
    );
  };

  renderBody() {
    return (
      <View
        style={{
          // flex: 1,
          width: '95%',
          height: '98%',
          alignSelf: 'center',
          backgroundColor: COLORS.primary,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#fff',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,

          elevation: 5,
        }}>
        <FlatList
          data={this.state.allLictures}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isPageLoading}
              onRefresh={this.componentDidMount.bind(this)}
              colors={[COLORS.primary, COLORS.secondary, COLORS.third]}
            />
          }
          numColumns={4}
          columnWrapperStyle={{
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            flex: 1,
          }}
          renderItem={({ item, index }) => this.renderMyVideoDetails(item, index)}
          ListEmptyComponent={
            !this.state.isPageLoading && (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '90%',
                  margin: '5%',
                  marginTop: '50%',
                }}>
                <LottieView
                  source={lottie.noData}
                  autoPlay
                  loop
                  style={{ height: SIZES.width * 0.5, width: '100%' }}
                  resizeMode="contain"
                />
              </View>
            )
          }
        />
      </View>
    );
  }

  renderBuyWhole() {
    return (
      <>
        {/* <Button
          style={{
            width: '80%',
            marginVertical: 20,
            alignSelf: 'center',

            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,

            elevation: 5,
            borderRadius: 8,
          }}
          labelStyle={{
            fontFamily: FONTS.fontFamily,
            marginHorizontal: 10,
          }}
          color={COLORS.primary}
          mode="contained"
          onPress={() => {
            this.setState({
              visableBuyWholeModal: true,
              buying_code: '',
            });
          }}>
          شراء الكل
        </Button> */}

      </>);
  }
  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#ffffff',
        }}>
        <StatusBar backgroundColor={COLORS.primary} />
        {this.renderHeader()}
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}>
          {this.renderBody()}
        </View>

        {this.state.availableToBuy && this.renderBuyWhole()}
        <Button
          style={{
            width: '80%',
            marginVertical: 10,
            alignSelf: 'center',

            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,

            elevation: 5,
            borderRadius: 8,
          }}
          labelStyle={{
            fontFamily: FONTS.fontFamily,
            marginHorizontal: 10,
          }}
          color={COLORS.primary}
          mode="contained"
          onPress={() => {
            let { teacherData } = this.context;
            // alert("dd")
            // this.props.navigation.navigate('MovePage');
            this.props.navigation.navigate('VideoComment', {
              type: "course",
              video_id: teacherData.subject_id
            });
          }}>
          الاستفسارات
        </Button>

        <Modal
          animationType="slide"
          visible={this.state.visableBuyModal}
          transparent={true}
          onRequestClose={() => {
            this.setState({
              visableBuyModal: false,
              buying_code: '',
              isWantSubscripe: false,
            });
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              padding: 10,
            }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    visableBuyModal: false,
                    buying_code: '',
                    isWantSubscripe: false,
                  });
                }}
                style={{
                  width: 50,
                  alignSelf: 'flex-end',
                  marginBottom: 10,
                }}>
                <Feather name="x" color="#fff" size={35} />
              </TouchableOpacity>

              <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={{ width: '100%', minHeight: 250 }}>
                  <Image
                    source={{ uri: this.state.vedio_details.lec_cover_link }}
                    style={{ width: '100%', height: 290 }}
                  />
                </View>

                <View style={{ padding: 15 }}>
                  {this.state.isWantSubscripe ? (
                    <>
                      <Animatable.View
                        animation="fadeIn"
                        style={{
                          alignItems: 'center',
                          marginVertical: 15,
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            fontFamily: FONTS.fontFamily,
                            fontSize: 20,
                          }}>
                          شراء محاضرة
                        </Text>

                        <Text
                          style={{
                            fontFamily: FONTS.fontFamily,
                            fontSize: 20,
                            color: COLORS.primary,
                          }}>
                          ({this.state.vedio_details.lec_title})
                        </Text>

                        {/* <TextInput
                          keyboardType="number-pad"
                          theme={{
                            colors: {
                              primary: COLORS.primary,
                              underlineColor: 'transparent',
                            },
                          }}
                          value={this.state.buying_code}
                          label={'كود الشراء'}
                          autoCapitalize={'none'}
                          onChangeText={(text) => {
                            this.setState({
                              buying_code: text,
                            });
                          }}
                          autoCorrect={false}
                          style={{
                            width: '90%',
                            alignSelf: 'center',
                            margin: '5%',
                          }}
                        /> */}
                        <Text
                          style={{
                            fontFamily: FONTS.fontFamily,
                            fontSize: 20,
                            color: COLORS.primary,
                          }} >
                          سعر المحاضرة : {this.state.vedio_details.lecture_price}
                        </Text>
                        <View style={{
                          flexDirection: "row",
                          alignItems: "center"
                        }}>

                          <Text
                            style={{
                              fontFamily: FONTS.fontFamily,
                              fontSize: 20,
                              color: COLORS.primary,
                            }} >
                            رصيدك : {this.state.money}
                          </Text>
                          {this.state.money < this.state.vedio_details.lecture_price &&
                            <TouchableOpacity
                              style={{
                                // ...styles.subscripeButton
                                marginLeft: SIZES.base
                              }}
                              onPress={() => {
                                this.setState({ visableBuyModal: false })
                                this.props.navigation.navigate('Charge')
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 24,
                                  color: COLORS.searchBar,
                                  fontFamily: FONTS.fontFamily,
                                }}>
                                شحن
                              </Text>
                            </TouchableOpacity>
                          }
                        </View>
                        {/* <TouchableOpacity
                          onPress={() => {
                            this.props.navigation.navigate("ContactUsScreen", { contact: this.state.vedio_details.instructions })
                            // Linking.openURL('https://api.whatsapp.com/send?text=ارغب في  شراء حصة&phone=+201019737505')
                          }}
                          style={{
                            alignSelf: "flex-start",
                            flexDirection: "row"
                          }}>
                          <Image
                            source={icons.online_chat}
                            style={{
                              width: 50,
                              height: 50,
                              marginRight: 15

                            }}
                            resizeMode='contain'
                          />
                          <Text
                            style={{
                              fontSize: 20,
                              color: '#000',
                              fontFamily: FONTS.fontFamily,
                            }}>
                            تواصل معنا لشراء المحاضرة
                          </Text>

                        </TouchableOpacity> */}

                      </Animatable.View>
                      <Animatable.View
                        animation="lightSpeedIn"
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-around',
                        }}>
                        <TouchableOpacity
                          disabled={this.state.money < this.state.vedio_details.lecture_price}
                          onPress={() => {
                            if (this.state.connectionStatus) {
                              // if (this.state.buying_code.trim().length != 14) {
                              //   ToastAndroid.showWithGravityAndOffset(
                              //     'الرجاء كتابة كود الشراء صحيح',
                              //     ToastAndroid.LONG,
                              //     ToastAndroid.CENTER,
                              //     25,
                              //     50,
                              //   );
                              // } else {
                              // if ()
                              this.buyVideo('one');
                              // else
                              // alert(
                              //   "رصيدك لا يكفي لشراء المحاضرة"
                              // );
                              // Alert.alert('Anglo-Academy', "رصيدك لا يكفي لشراء المحاضرة", [
                              //   {
                              //     text: 'إلغاء',
                              //     onPress: () => { },
                              //     style: 'cancel',
                              //   },
                              //   {
                              //     text: 'شحن', onPress: () => {
                              // this.setState({ visableBuyModal: false })
                              // this.props.navigation.navigate('Charge')
                              //     }
                              //   },
                              // ]);

                              // }
                            } else {
                              ToastAndroid.showWithGravityAndOffset(
                                'الرجاء التأكد من اتصالك بالإنترنت',
                                ToastAndroid.LONG,
                                ToastAndroid.CENTER,
                                25,
                                50,
                              );
                            }
                          }}
                          style={{
                            ...styles.subscripeButton,
                            opacity: this.state.money < this.state.vedio_details.lecture_price ? .5 : 1
                          }}>
                          {this.state.payButtonLoading == true ? (
                            <ActivityIndicator
                              size={30}
                              style={{ padding: 5 }}
                              color={'#fff'}
                            />
                          ) : (
                            <Text
                              style={{
                                fontSize: 20,
                                color: '#fff',
                                fontFamily: FONTS.fontFamily,
                              }}>
                              شراء
                            </Text>
                          )}
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => {
                            this.setState({
                              isWantSubscripe: false,
                            });
                          }}
                          style={{
                            ...styles.canselButton,
                          }}>
                          <Text
                            style={{
                              fontSize: 20,
                              fontFamily: FONTS.fontFamily,
                              color: '#fff',
                            }}>
                            الرجوع
                          </Text>
                        </TouchableOpacity>
                      </Animatable.View>
                    </>
                  ) : (
                    <Animatable.View animation="fadeIn">
                      <View>
                        <Text
                          style={{
                            fontFamily: FONTS.fontFamily,
                            fontSize: 20,
                          }}>
                          {this.state.vedio_details.lec_title}
                        </Text>
                        <Text style={{ color: 'rgba(0,0,0,0.6)', fontSize: 18 }}>
                          {this.state.vedio_details.lec_descriprion}
                        </Text>
                      </View>

                      <TouchableOpacity
                        onPress={() => {
                          this.setState({
                            isWantSubscripe: true,
                          });
                        }}
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#3ab54a',
                          borderRadius: 8,
                          paddingVertical: 10,
                          paddingHorizontal: 30,
                          alignSelf: 'center',
                          width: '40%',
                          marginTop: 10,
                        }}>
                        <Text
                          style={{
                            fontWeight: 'bold',
                            fontSize: 20,
                            color: '#fff',
                          }}>
                          شراء
                        </Text>
                      </TouchableOpacity>
                    </Animatable.View>
                  )}
                </View>
              </View>
            </ScrollView>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          visible={this.state.visableBuyWholeModal}
          transparent={true}
          onRequestClose={() => {
            this.setState({
              visableBuyWholeModal: false,
              buying_code: '',
            });
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              padding: 10,
            }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    visableBuyWholeModal: false,
                    buying_code: '',
                  });
                }}
                style={{
                  width: 50,
                  alignSelf: 'flex-end',
                  marginBottom: 10,
                }}>
                <Feather name="x" color="#fff" size={35} />
              </TouchableOpacity>

              <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={{ width: '100%', minHeight: 250 }}>
                  <Image
                    source={images.AppLogo}
                    style={{ width: '100%', height: 200, marginTop: 30 }}
                    resizeMode="contain"
                  />
                </View>

                <View style={{ padding: 15 }}>
                  <>
                    <Animatable.View
                      animation="fadeIn"
                      style={{
                        alignItems: 'center',
                        marginVertical: 15,
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          fontFamily: FONTS.fontFamily,
                          fontSize: 20,
                        }}>
                        {this.state.buyingWholeMsg == ''
                          ? 'شراء جميع محاضرات المادة'
                          : `خصم ${this.state.buyingWholeMsg}% عند شراء جميع المحاضرات`}
                      </Text>

                      <TextInput
                        keyboardType="number-pad"
                        theme={{
                          colors: {
                            primary: COLORS.primary,
                            underlineColor: 'transparent',
                          },
                        }}
                        value={this.state.buying_code}
                        label={'كود الشراء'}
                        autoCapitalize={'none'}
                        onChangeText={(text) => {
                          this.setState({
                            buying_code: text,
                          });
                        }}
                        autoCorrect={false}
                        style={{
                          width: '90%',
                          alignSelf: 'center',
                          margin: '5%',
                        }}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          Linking.openURL('https://api.whatsapp.com/send?text=ارغب في  شراء الحصص&phone=+201019737505')
                        }}
                        style={{
                          alignSelf: "flex-start",
                          flexDirection: "row"
                        }}>
                        <Image
                          source={icons.whatsapp}
                          style={{
                            width: 50,
                            height: 50,
                            marginRight: 15

                          }}
                          resizeMode='contain'
                        />
                        <Text
                          style={{
                            fontSize: 20,
                            color: '#000',
                            fontFamily: FONTS.fontFamily,
                          }}>
                          واتساب
                        </Text>

                      </TouchableOpacity>
                    </Animatable.View>
                    <Animatable.View
                      animation="lightSpeedIn"
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          if (this.state.connectionStatus) {
                            if (this.state.buying_code.trim().length != 14) {
                              Alert.alert("Anglo Academy",
                                'الرجاء كتابة كود الشراء صحيح',

                              );
                            } else {
                              this.buyVideo('whole');
                            }
                          } else {
                            ToastAndroid.showWithGravityAndOffset(
                              'الرجاء التأكد من اتصالك بالإنترنت',
                              ToastAndroid.LONG,
                              ToastAndroid.CENTER,
                              25,
                              50,
                            );
                          }
                        }}
                        style={{
                          ...styles.subscripeButton,
                        }}>
                        {this.state.payButtonLoading == true ? (
                          <ActivityIndicator
                            size={30}
                            style={{ padding: 5 }}
                            color={'#fff'}
                          />
                        ) : (
                          <Text
                            style={{
                              fontSize: 20,
                              color: '#fff',
                              fontFamily: FONTS.fontFamily,
                            }}>
                            شراء
                          </Text>
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          this.setState({
                            visableBuyWholeModal: false,
                            buying_code: '',
                          });
                        }}
                        style={{
                          ...styles.canselButton,
                        }}>
                        <Text
                          style={{
                            fontSize: 20,
                            fontFamily: FONTS.fontFamily,
                            color: '#fff',
                          }}>
                          الرجوع
                        </Text>
                      </TouchableOpacity>
                    </Animatable.View>
                  </>
                </View>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  subscripeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3ab54a',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 30,
    alignSelf: 'center',
    flex: 1,
    marginEnd: 10,
  },
  canselButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f60941',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
    alignSelf: 'center',
    flex: 1,
    marginStart: 10,
  },
  lectureContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    width: 70,
    height: 70,
    borderRadius: 70 / 2,
    borderColor: '#fff',
    borderWidth: 1,
    backgroundColor: COLORS.third,
  },
});
