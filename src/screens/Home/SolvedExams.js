import * as React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  FlatList,
  UIManager,
  Platform,
  ScrollView,
  LayoutAnimation,
  Animated,
  Image,
  NativeModules,
} from 'react-native';
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
import {UserContext} from '../Context/UserContext';
import AsyncStorage from '@react-native-community/async-storage';
const {width, height} = Dimensions.get('window');
import NetInfo from '@react-native-community/netinfo';
import {AppRequired, COLORS, FONTS, images} from '../../constants';

class ExpandableItemComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      layoutHeight: 0,
      bottomConnectionMsg: new Animated.Value(-100),
      connection_Status: 'Offline',
    };
  }

  componentDidMount() {
    this.allowFunction();
  }

  allowFunction = async () => {
    try {
      const result = await NativeModules.PreventScreenshotModule.allow();
      // console.log(result);
    } catch (e) {
      // console.log(e);
    }
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.item.isExpanded) {
      this.setState(() => {
        return {
          layoutHeight: null,
        };
      });
    } else {
      this.setState(() => {
        return {
          layoutHeight: 0,
        };
      });
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.layoutHeight !== nextState.layoutHeight) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <View>
        {/*Header of the Expandable List Item*/}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={this.props.onClickFunction}
          style={{
            width: '90%',
            alignSelf: 'center',
            paddingHorizontal: 12,
            paddingVertical: 15,
            borderTopLeftRadius: 7,
            borderTopStartRadius: 7,
            borderBottomLeftRadius: this.props.item.isExpanded ? 0 : 7,
            borderBottomRightRadius: this.props.item.isExpanded ? 0 : 7,
            backgroundColor: '#fff',
            marginBottom: 0,
            flexDirection: 'row',
            justifyContent: 'space-between',
            elevation: 0.2,
          }}>
          <Text style={styles.headerText}>{this.props.item.category_name}</Text>
          <Icon
            name={this.props.item.isExpanded ? 'angle-down' : 'angle-left'}
            style={{fontSize: 26, color: COLORS.primary, marginLeft: 10}}
          />
        </TouchableOpacity>

        <View
          style={{
            height: this.state.layoutHeight,
            overflow: 'hidden',
            marginBottom: 10,
            width: '90%',
            alignSelf: 'center',
            paddingHorizontal: 12,
            // paddingVertical: 15,
            borderBottomLeftRadius: 7,
            borderBottomRightRadius: 7,
            backgroundColor: '#fff',
            // elevation:2
          }}>
          {/*Content under the header of the Expandable List Item*/}
          {this.props.item.subcategory.map((item, key) => (
            <TouchableOpacity
              key={key}
              style={styles.content}
              onPress={() =>
                this.props.navigation.navigate('SolvedExam', {
                  quiz_name:
                    this.props.item.category_name == 'الامتحانات'
                      ? item.exam_name
                      : item.quiz_name,
                  // quiz_id:"Exam_1",
                  quiz_id:
                    this.props.item.category_name == 'الامتحانات'
                      ? 'Exam_' + item.exam_id
                      : 'Quiz_' + item.quiz_id,
                })
              }>
              <View
                style={{
                  flex: 1,
                  backgroundColor: COLORS.primary,
                  borderTopLeftRadius: 5,
                  borderBottomLeftRadius: 5,
                }}></View>

              <View style={{flex: 20}}>
                <Text style={styles.text}>
                  {this.props.item.category_name == 'الامتحانات'
                    ? item.exam_name
                    : item.quiz_name}
                </Text>
              </View>

              {/* <View style={styles.separator} /> */}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }
}

export default class SolvedExams extends React.Component {
  //constructor
  static contextType = UserContext;

  constructor(props) {
    super(props);

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    this.state = {
      generation_id: '',
      student_id: '',
      exams: [],
      loading: true,
      bottomConnectionMsg: new Animated.Value(-100),
      connection_Status: 'Online',
    };
    this._subscription;
  }

  componentWillUnmount() {
    // this._subscription && this._subscription()
  }
  async componentDidMount() {
    this._subscription = NetInfo.addEventListener(
      this._handelConnectionInfoChange,
    );
  }
  _handelConnectionInfoChange = async (NetInfoState) => {
    const data = JSON.parse(await AsyncStorage.getItem('AllData'));
    if (NetInfoState.isConnected == true) {
      this.setState(({}) => ({
        connection_Status: 'Online',
      }));

      if (data != null) {
        this.setState({
          student_id: data.student_id,
          generation_id: data.student_generation_id,
        });

        this.get_exams();
      }

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

  async get_exams() {
    // this.setState({loading: true})
    // this.setState({disabled: true});
    let {teacherData} = this.context;
    let student_token = await AsyncStorage.getItem('fcmToken');

    let data_to_send = {
      generation_id: teacherData.subject_id,

      student_id: this.state.student_id,
      student_token,
    };

    // alert(JSON.stringify(data_to_send))
    axios
      .post(AppRequired.Domain + `home/select_public.php`, data_to_send)
      .then((res) => {
        if (res.status == 200) {
          // console.log(res.data);
          if (res.data != 'error') {
            if (res.data.exams.length > 0 || res.data.quiz.length > 0) {
              let real_data = [
                {
                  isExpanded: false,
                  category_name: 'الامتحانات',
                  subcategory: res.data.exams,
                },
                {
                  isExpanded: false,
                  category_name: 'الواجبات',
                  subcategory: res.data.quiz,
                },
              ];
              this.setState({
                exams: real_data,
              });
              // console.log(this.state.exams)
            } else {
            }
          } else {
            Alert.alert(
              AppRequired.appName + '',
              'عذرا يرجي المحاوله في وقت لاحق',
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
            'عذرا يرجي المحاوله في وقت لاحق',
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

  updateLayout = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const array = [...this.state.exams];
    //For Single Expand at a time
    array.map((value, placeindex) =>
      placeindex === index
        ? (array[placeindex]['isExpanded'] = !array[placeindex]['isExpanded'])
        : (array[placeindex]['isExpanded'] = false),
    );
    //For Multiple Expand at a time
    //array[index]['isExpanded'] = !array[index]['isExpanded'];
    this.setState(() => {
      return {
        exams: array,
      };
    });
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
      <Container style={{backgroundColor: '#fff'}}>
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
                fontSize: 22,
              }}>
              الامتحانات المحلوله
            </Text>
          </View>
          <View style={{flex: 1}} />
        </View>
        {
          // <Text>{item.exam_name}</Text>
        }
        {this.state.loading == true &&
        this.state.connection_Status == 'Online' ? (
          <Spinner color={COLORS.primary} size={40} style={{marginTop: 200}} />
        ) : this.state.loading == false ? (
          <View>
            {this.state.exams.length == 0 ? (
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
                  لا توجد امتحانات محلوله
                </Text>
              </View>
            ) : (
              <View style={styles.container}>
                <ScrollView>
                  {this.state.exams.map((item, key) => (
                    <ExpandableItemComponent
                      key={item.category_name}
                      onClickFunction={this.updateLayout.bind(this, key)}
                      item={item}
                      navigation={this.props.navigation}
                    />
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        ) : this.state.connection_Status != 'offline' ? null : (
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
        <ViewConnectionMsg ConnectionEnter="لا يوجد اتصال بالإنترنت" />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,

    paddingTop: 15,
    backgroundColor: '#FFF',
  },

  header: {
    width: '90%',
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 15,
    borderRadius: 7,
    backgroundColor: '#fff',
    marginBottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 20,
    fontWeight: '700',
    // fontFamily: 'serif',
    // letterSpacing: 3
  },
  separator: {
    height: 0.5,
    // backgroundColor: '#808080',
    width: '95%',
    marginLeft: 16,
    marginRight: 16,
  },
  text: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  content: {
    // paddingBosubcategoryom: 10,
    // paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#F5f5f5',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    // borderWidth:1,
    borderRadius: 10,
    elevation: 0.5,
    flexDirection: 'row',
    marginBottom: '2%',
  },
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
