// import React, {Component} from 'react';
// import {
//   Text,
//   View,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Dimensions,
//   Animated,
//   ToastAndroid,
//   Image,
// } from 'react-native';
// import AsyncStorage from '@react-native-community/async-storage';
// import {UserContext} from '../Context/UserContext';

// const {width, height} = Dimensions.get('window');
// import axios from 'axios';
// import ProgressBar from 'react-native-progress/Bar';

// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

// import NetInfo from '@react-native-community/netinfo';
// import {NavigationEvents} from 'react-navigation';
// import {StatusBar} from 'react-native';
// import {AppRequired, COLORS, FONTS, images, SIZES} from '../../constants';
// export default class Profile extends Component {
//   static contextType = UserContext;
//   constructor(props) {
//     super(props);
//     this.state = {
//   dataa: {
//     exams: [],
//   },
//   visable: false,
//   arr: [],
//   numbro: 100,
//   final_ratio: 0,
//   success_ratio: 0,
//   failed_ratio: 0,
//   total_final: 0,
//   num_of_Ques: 1,
//   my_solve_ques: 0,
//   isloading: false,
//   balance: '',
//   student_id: '',
//   studentId: '',
//   generationId: '',
//   studentName: '',
//   loading: true,
//   checkLogoutLoading: false,

//   show: false,
//   connection_Status: 'Online',
//   refreshing: false,

//   showModalForDrawer: false,
//   failedLogout: false,
//   showLogoutModal: false,
//   newNotification: false,
//   chartData: {
//     labels: ['Jan', 'Feb', 'Mar'], // optional
//     data: [0.4, 0.6, 0.8],
//   },
//   teacherData: {},
//   teacherName: this.props.navigation.getParam('teacherName'),
// };
//   }

// async componentDidMount() {
//   const data = JSON.parse(await AsyncStorage.getItem('AllData'));
//   let {teacherData} = this.context;

//   if (data != null) {
//     this.setState({
//       studentId: data.student_id,
//       generationId: data.student_generation_id,
//       studentName: data.student_name,
//       teacherData,
//     });
//     this.info();
//   }

//   const unsubscribe = NetInfo.addEventListener(async (state) => {
//     if (state.isConnected == true) {
//       this.setState({
//         connection_Status: 'Online',
//       });
//       this.info();
//       Animated.spring(this.state.bottomConnectionMsg, {
//         toValue: -100,
//       }).start();
//     } else {
//       this.setState({
//         connection_Status: 'Offline',
//       });
//       Animated.spring(this.state.bottomConnectionMsg, {toValue: 0}).start();
//     }
//   });
// }

// info = async () => {
//   let {teacherData} = this.context;
//   let student_token = await AsyncStorage.getItem('fcmToken');

//   let data_to_send = {
//     generation_id: teacherData.subject_id,
//     student_id: this.state.studentId,
//     student_token,
//   };

//   axios
//     .post(AppRequired.Domain + 'home/get_profile_info.php', data_to_send)
//     .then((res) => {
//       if (res.status == 200) {
//         if (res.data != 'error') {
//           if (Object.keys(res.data).length > 3) {
//             this.setState({
//               dataa: res.data,
//               exams: res.data.exams,
//             });
//             this.save_points(res.data);
//           } else {
//             this.setData();
//             ToastAndroid.showWithGravityAndOffset(
//               'قد تمت إزالتك',
//               ToastAndroid.LONG,
//               ToastAndroid.CENTER,
//               25,
//               50,
//             );
//             this.props.navigation.navigate('Auth');
//           }
//         } else {
//           ToastAndroid.showWithGravityAndOffset(
//             'عذرا يرجى المحاوله فى وقت لاحق',
//             ToastAndroid.LONG,
//             ToastAndroid.CENTER,
//             25,
//             50,
//           );
//         }
//       } else {
//         ToastAndroid.showWithGravityAndOffset(
//           'عذرا يرجى المحاوله فى وقت لاحق',
//           ToastAndroid.LONG,
//           ToastAndroid.CENTER,
//           25,
//           50,
//         );
//       }
//       this.setState({loading: false});
//     });
// };

// async save_points(data) {
//   let studentData = JSON.parse(await AsyncStorage.getItem('AllData'));
//   studentData.student_points = data.points;
//   await AsyncStorage.setItem('AllData', JSON.stringify(studentData));
// }
// _onRefresh = async () => {
//   this.info();
// };

// formatPersentage = (persentage) => {
//   return persentage / 100;
// };

// renderResults = () => {
//   return (
//     <View
//       style={{
//         paddingTop: '20%',
//         paddingVertical: 30,
//         // alignItems: 'center',
//         // justifyContent: 'center',
//       }}>
//       {/* <View style={styles.percentage_view}> */}

// <View>
//   <Text style={styles.text}>النجاح</Text>
//   <View style={styles.view_progress}>
//     <ProgressBar
//       progress={this.formatPersentage(this.state.dataa.success_ratio)}
//       color={'#188038'}
//       indeterminateAnimationDuration={1000}
//       borderWidth={0.5}
//       borderColor={'#188038'}
//       height={height * 0.02}
//       width={width * 0.7}
//     />
//     <Text style={styles.Percentage_text}>
//       {this.state.dataa.success_ratio} %
//     </Text>
//   </View>
// </View>

//       <View>
//         <Text style={styles.text}>الرسوب</Text>
//       </View>
//       <View style={styles.view_progress}>
//         <ProgressBar
//           // progress={this.state.failed_ratio}
//           progress={this.formatPersentage(this.state.dataa.failed_ratio)}
//           color={'#d93025'}
//           indeterminateAnimationDuration={60000}
//           borderWidth={0.5}
//           borderColor={'#d93025'}
//           height={height * 0.02}
//           width={width * 0.7}
//         />
//         <Text style={styles.Percentage_text}>
//           {this.state.dataa.failed_ratio} %
//         </Text>
//       </View>

//       <View>
//         <Text style={styles.text}>التراكمي</Text>
//       </View>

//       <View style={styles.view_progress}>
//         <ProgressBar
//           progress={this.formatPersentage(this.state.dataa.final_ratio)}
//           color={'#ffb74d'}
//           indeterminateAnimationDuration={60000}
//           borderWidth={0.5}
//           borderColor={'#ffb74d'}
//           height={height * 0.02}
//           width={width * 0.7}
//         />
//         <Text style={styles.Percentage_text}>
//           {this.state.dataa.final_ratio} %
//         </Text>
//       </View>

//       <View
//         style={{
//           flex: 1,
//           alignItems: 'center',
//           justifyContent: 'center',
//           marginTop: height * 0.06,
//         }}>
//         <View style={{}}>
//           <TouchableOpacity
//             style={{
//               flexDirection: 'row',
//               // flex: 1,
//               borderWidth: 1,
//               borderColor: COLORS.primary,
//               alignSelf: 'center',
//               borderRadius: 8,
//               // marginVertical: 20,
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}
//             onPress={() => {
//               this.props.navigation.navigate('SeeMore');
//             }}>
//             <View
//               style={{
//                 flex: 1.5,
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 height: 80,
//               }}>
//               <Text style={{fontFamily: FONTS.fontFamily, fontSize: 22}}>
//                 الواجبات المحلوله
//               </Text>
//             </View>
//             <View
//               style={{
//                 flex: 1,
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 backgroundColor: COLORS.primary,
//                 borderRadius: 7,
//                 height: '100%',
//               }}>
//               <Text
//                 style={{
//                   fontFamily: FONTS.fontFamily,
//                   fontSize: 22,
//                   color: '#fff',
//                 }}>
//                 {this.state.dataa.exams_count}
//               </Text>
//             </View>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* </View> */}
//     </View>
//   );
// };

//   render() {
// const ViewConnectionMsg = (props) => {
//   return (
//     <Animated.View
//       style={[
//         styles.ConnectionView,
//         {bottom: this.state.bottomConnectionMsg},
//       ]}>
//       <View>
//         <Text style={{color: 'white'}}>{props.ConnectionEnter}</Text>
//       </View>
//     </Animated.View>
//   );
// };
//     return (
// <>
//   <StatusBar backgroundColor={COLORS.secondary} />

//   <NavigationEvents onDidFocus={() => this.componentDidMount()} />
//   {/* <ScrollView showsVerticalScrollIndicator={false}> */}
//   {this.state.loading == true &&
//   this.state.connection_Status == 'Online' ? (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         // paddingTop: height * 0.4,
//         backgroundColor: COLORS.primary,
//       }}>
//       <Image
//         source={images.InfinityLoading}
//         style={{
//           width: 100,
//           height: 100,
//           tintColor: '#fff',
//         }}
//         resizeMode="contain"
//       />
//     </View>
//   ) : this.state.loading == false ? (
//     <View
//       style={{
//         flex: 1,
//         backgroundColor: COLORS.primary,
//       }}>
//       <View
//         style={{
//           // alignItems: 'center',
//           justifyContent: 'center',
//           backgroundColor: COLORS.primary,
//           height: 125,
//           // paddingTop: 20,
//         }}>
//         <TouchableOpacity
//           style={{
//             alignSelf: 'flex-start',
//             left: 20,
//             position: 'absolute',
//             top: 20,
//           }}
//           onPress={() => {
//             this.props.navigation.openDrawer();
//           }}>
//           <FontAwesome5
//             name={'align-right'}
//             size={24}
//             style={{color: '#fff', marginRight: 20}}
//           />
//         </TouchableOpacity>
//         <Text
//           numberOfLines={2}
//           style={{
//             color: '#fff',
//             fontSize: 28,
//             fontFamily: FONTS.fontFamily,
//             textAlign: 'center',
//           }}>
//           {this.state.studentName}
//         </Text>
//       </View>

//       <View
//         style={{
//           backgroundColor: 'white',
//           flex: 1,
//           borderTopRightRadius: 20,
//           borderTopLeftRadius: 20,

//           paddingHorizontal: 20,
//           paddingVertical: 20,
//           // alignItems: 'center',
//           // justifyContent: 'center',
//         }}>
//         <ScrollView showsVerticalScrollIndicator={false}>
//           <Text
//             style={{
//               textAlign: 'center',
//               fontFamily: FONTS.fontFamily,
//               fontSize: 20,
//             }}>
//             {this.state.teacherName}
//           </Text>
//           <Text
//             style={{
//               textAlign: 'center',
//               fontFamily: FONTS.fontFamily,
//               fontSize: 20,
//             }}>
//             {this.state.teacherData.subject_name}
//           </Text>

//           {/* <ProgressChart
//             data={this.state.chartData}
//             width={SIZES.width}
//             height={220}
//             strokeWidth={16}
//             radius={32}
//             chartConfig={{
//               backgroundColor: '#e26a00',
//               backgroundGradientFrom: '#efef',
//               backgroundGradientTo: '#ffa726',
//               decimalPlaces: 2, // optional, defaults to 2dp
//               color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
//               labelColor: (opacity = 1) =>
//                 `rgba(255, 255, 255, ${opacity})`,
//               style: {
//                 borderRadius: 16,
//               },
//               propsForDots: {
//                 r: '6',
//                 strokeWidth: '2',
//                 stroke: '#ffa726',
//               },
//             }}
//             hideLegend={false}
//             style={{
//               // marginVertical: 8,
//               borderRadius: 16,
//             }}
//           /> */}
//           {this.renderResults()}
//         </ScrollView>
//       </View>
//     </View>
//   ) : this.state.connection_Status == 'Offline' ? (
//     <View
//       style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
//       <StatusBar backgroundColor={COLORS.secondary} />
//       <Text
//         style={{
//           fontFamily: FONTS.fontFamily,
//           fontSize: 22,
//           color: '#fff',
//         }}>
//         الرجاء التأكد من اتصالك بالأنترنت
//       </Text>
//     </View>
//   ) : null}
//   {/* </ScrollView> */}
// </>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   ConnectionView: {
//     width: '100%',
//     height: 20,
//     position: 'absolute',
//     zIndex: 222,
//     backgroundColor: COLORS.primary,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   view_progress: {
//     marginVertical: height * 0.01,
//     // height: 40,
//     width: '90%',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     flexDirection: 'row',
//   },
//   Percentage_text: {
//     fontSize: 15,
//     marginHorizontal: 10,
//     marginBottom: 5,
//   },
// });

import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  ToastAndroid,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {UserContext} from '../Context/UserContext';

const {width, height} = Dimensions.get('window');
import axios from 'axios';
import ProgressBar from 'react-native-progress/Bar';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import NetInfo from '@react-native-community/netinfo';
import {NavigationEvents} from 'react-navigation';
import {StatusBar} from 'react-native';
import {AppRequired, COLORS, FONTS, images, SIZES} from '../../constants';
export default class Profile extends Component {
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.state = {
      dataa: {
        exams: [],
      },
      visable: false,
      arr: [],
      numbro: 100,
      final_ratio: 0,
      success_ratio: 0,
      failed_ratio: 0,
      total_final: 0,
      num_of_Ques: 1,
      my_solve_ques: 0,
      isloading: false,
      balance: '',
      student_id: '',
      studentId: '',
      generationId: '',
      studentName: '',
      loading: true,
      checkLogoutLoading: false,

      show: false,
      connection_Status: 'Online',
      refreshing: false,

      showModalForDrawer: false,
      failedLogout: false,
      showLogoutModal: false,
      newNotification: false,

      teacherData: {},
      teacherName: this.props.navigation.getParam('teacherName'),
    };
  }

  async componentDidMount() {
    const data = JSON.parse(await AsyncStorage.getItem('AllData'));
    let {teacherData} = this.context;

    if (data != null) {
      this.setState({
        studentId: data.student_id,
        generationId: data.student_generation_id,
        studentName: data.student_name,
        teacherData,
      });
      this.info();
    }
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      if (state.isConnected == true) {
        this.setState({
          connection_Status: 'Online',
        });
        this.info();
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
  info = async () => {
    let {teacherData} = this.context;
    let student_token = await AsyncStorage.getItem('fcmToken');

    let data_to_send = {
      generation_id: teacherData.subject_id,
      student_id: this.state.studentId,
      student_token,
    };

    axios
      .post(AppRequired.Domain + 'home/get_profile_info.php', data_to_send)
      .then((res) => {
        if (res.status == 200) {
          // console.log(res.data);
          if (res.data != 'error') {
            if (Object.keys(res.data).length > 3) {
              this.setState({
                dataa: res.data,
                exams: res.data.exams,
              });
              this.save_points(res.data);
            } else {
              this.setData();
              ToastAndroid.showWithGravityAndOffset(
                'قد تمت إزالتك',
                ToastAndroid.LONG,
                ToastAndroid.CENTER,
                25,
                50,
              );
              this.props.navigation.navigate('Auth');
            }
          } else {
            ToastAndroid.showWithGravityAndOffset(
              'عذرا يرجى المحاوله فى وقت لاحق',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
          }
        } else {
          ToastAndroid.showWithGravityAndOffset(
            'عذرا يرجى المحاوله فى وقت لاحق',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50,
          );
        }
        this.setState({loading: false});
      });
  };
  async save_points(data) {
    let studentData = JSON.parse(await AsyncStorage.getItem('AllData'));
    studentData.student_points = data.points;
    await AsyncStorage.setItem('AllData', JSON.stringify(studentData));
  }
  _onRefresh = async () => {
    this.info();
  };

  formatPersentage = (persentage) => {
    return persentage / 100;
  };

  renderResults = () => {
    return (
      <View
        style={{
          paddingTop: '20%',
          paddingVertical: 30,
          // alignItems: 'center',
          // justifyContent: 'center',
        }}>
        {/* <View style={styles.percentage_view}> */}

        <View>
          <Text style={styles.text}>النجاح</Text>
          <View style={styles.view_progress}>
            <ProgressBar
              progress={this.formatPersentage(
                this.state.dataa.success_ratio
                  ? this.state.dataa.success_ratio
                  : 0,
              )}
              color={'#188038'}
              indeterminateAnimationDuration={1000}
              borderWidth={0.5}
              borderColor={'#188038'}
              height={height * 0.02}
              width={width * 0.7}
            />
            <Text style={styles.Percentage_text}>
              {this.state.dataa.success_ratio} %
            </Text>
          </View>
        </View>

        <View>
          <Text style={styles.text}>الرسوب</Text>
        </View>
        <View style={styles.view_progress}>
          <ProgressBar
            // progress={this.state.failed_ratio}
            progress={this.formatPersentage(
              this.state.dataa.failed_ratio ? this.state.dataa.failed_ratio : 0,
            )}
            color={'#d93025'}
            indeterminateAnimationDuration={60000}
            borderWidth={0.5}
            borderColor={'#d93025'}
            height={height * 0.02}
            width={width * 0.7}
          />
          <Text style={styles.Percentage_text}>
            {this.state.dataa.failed_ratio} %
          </Text>
        </View>

        <View>
          <Text style={styles.text}>التراكمي</Text>
        </View>

        <View style={styles.view_progress}>
          <ProgressBar
            progress={this.formatPersentage(
              this.state.dataa.final_ratio ? this.state.dataa.final_ratio : 0,
            )}
            color={'#ffb74d'}
            indeterminateAnimationDuration={60000}
            borderWidth={0.5}
            borderColor={'#ffb74d'}
            height={height * 0.02}
            width={width * 0.7}
          />
          <Text style={styles.Percentage_text}>
            {this.state.dataa.final_ratio} %
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: height * 0.06,
          }}>
          <View style={{}}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                // flex: 1,
                borderWidth: 1,
                borderColor: COLORS.primary,
                alignSelf: 'center',
                borderRadius: 8,
                // marginVertical: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                this.props.navigation.navigate('SeeMore');
              }}>
              <View
                style={{
                  flex: 1.5,
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 80,
                }}>
                <Text style={{fontFamily: FONTS.fontFamily, fontSize: 22}}>
                  الواجبات المحلوله
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: COLORS.primary,
                  borderRadius: 7,
                  height: '100%',
                }}>
                <Text
                  style={{
                    fontFamily: FONTS.fontFamily,
                    fontSize: 22,
                    color: '#fff',
                  }}>
                  {this.state.dataa.exams_count}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* </View> */}
      </View>
    );
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
      <>
        <StatusBar backgroundColor={COLORS.secondary} />

        <NavigationEvents onDidFocus={() => this.componentDidMount()} />
        {/* <ScrollView showsVerticalScrollIndicator={false}> */}
        {this.state.loading == true &&
        this.state.connection_Status == 'Online' ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              // paddingTop: height * 0.4,
              backgroundColor: COLORS.primary,
            }}>
            <Image
              source={images.InfinityLoading}
              style={{
                width: 100,
                height: 100,
                tintColor: '#fff',
              }}
              resizeMode="contain"
            />
          </View>
        ) : this.state.loading == false ? (
          <View
            style={{
              flex: 1,
              backgroundColor: COLORS.primary,
            }}>
            <View
              style={{
                // alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: COLORS.primary,
                height: 125,
                // paddingTop: 20,
              }}>
              <TouchableOpacity
                style={{
                  alignSelf: 'flex-start',
                  left: 20,
                  position: 'absolute',
                  top: 20,
                }}
                onPress={() => {
                  this.props.navigation.openDrawer();
                }}>
                <FontAwesome5
                  name={'align-right'}
                  size={24}
                  style={{color: '#fff', marginRight: 20}}
                />
              </TouchableOpacity>
              <Text
                numberOfLines={2}
                style={{
                  color: '#fff',
                  fontSize: 28,
                  fontFamily: FONTS.fontFamily,
                  textAlign: 'center',
                }}>
                {this.state.studentName}
              </Text>
            </View>

            <View
              style={{
                backgroundColor: 'white',
                flex: 1,
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,

                paddingHorizontal: 20,
                paddingVertical: 20,
                // alignItems: 'center',
                // justifyContent: 'center',
              }}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontFamily: FONTS.fontFamily,
                    fontSize: 20,
                  }}>
                  {this.state.teacherName}
                </Text>
                <Text
                  style={{
                    textAlign: 'center',
                    fontFamily: FONTS.fontFamily,
                    fontSize: 20,
                  }}>
                  {this.state.teacherData.subject_name}
                </Text>

                {this.renderResults()}
              </ScrollView>
            </View>
          </View>
        ) : this.state.connection_Status == 'Offline' ? (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <StatusBar backgroundColor={COLORS.secondary} />
            <Text
              style={{
                fontFamily: FONTS.fontFamily,
                fontSize: 22,
                color: '#fff',
              }}>
              الرجاء التأكد من اتصالك بالأنترنت
            </Text>
          </View>
        ) : null}
        {/* </ScrollView> */}
      </>
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
  view_progress: {
    marginVertical: height * 0.01,
    // height: 40,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  Percentage_text: {
    fontSize: 15,
    marginHorizontal: 10,
    marginBottom: 5,
  },
});
