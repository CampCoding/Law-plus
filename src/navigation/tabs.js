import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator, BottomTabBar } from 'react-navigation-tabs';
import { COLORS, FONTS, icons, images } from '../constants';
import { custom_Drawer } from './custom_Drawer';

import {
  MainPage,
  // MorePages,
  MyLibrary,
  // WatchStreamVideo,
  // WatchIndvidualVideo,
  Charge,
  Profile,
  Notifications,
  SeeMore,
  Seloved_Student_Exam,
  SolvedExams,
  SolvedExam,
  // CopyRight,
  MoneyTransactionsDetails,
  ChargeDetails,
  ExpensesDetails,
  // //
  MovePage,
  StudentChallenge,
  MovePageExamsQuizes,
  FinishDetails,
  QuestionDetails,
  ExamPageQuestion,
  FinishChallenge,
  PendingChalenge,
  VSpage,
  // //
  SummaryList,
  Viewer,
  // //
  // QuizList,
  // QuizQutionsWithoutTime,
  // QuizQuationWithoutTime2,
  // QuizQuationWithTime,
  // QuizPageWithTimeCheck,
  // //
  // ExamList,
  FullPageExam,
  // FullPageExamWithAnswers,
  // FullPageTimerAnswerdExam,
  // FullPageTimerExam,
  // //
  Setting,
  AboutCamp,
  VideosLibrary,
  MySingleVideoDetails,
  BuyVideos,
  AboutApp,
  VideoComment
} from '../screens/Home';

import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import AllTransactions from '../screens/Home/Expenses_Charge_Profile/AllTransactions';
import ContactUsScreen from '../screens/Home/ContactUsScreen';
import VideoQAPage from '../screens/Home/VideoQAPage';
import ReferFriend from '../screens/Home/ReferFriend';

const ProfilePageDrawer = createDrawerNavigator(
  {
    ProfilePage: {
      screen: Profile,
    },
  },
  {
    drawerBackgroundColor: '#fff',
    keyboardDismissMode: 'on-drag',
    drawerType: 'slide',
    contentComponent: custom_Drawer,
  },
);

const MainPageStack = createStackNavigator(
  {
    MainPage: { screen: MainPage },
    Profile: { screen: ProfilePageDrawer },
    //
    // ExamList: {screen: ExamList},
    FullPageExam: { screen: FullPageExam },
    // FullPageExamWithAnswers: {screen: FullPageExamWithAnswers},
    // FullPageTimerAnswerdExam: {screen: FullPageTimerAnswerdExam},
    // FullPageTimerExam: {screen: FullPageTimerExam},
    //
    SeeMore: { screen: SeeMore },
    Seloved_Student_Exam: { screen: Seloved_Student_Exam },
    SolvedExams: { screen: SolvedExams },
    SolvedExam: { screen: SolvedExam },
    //
    SummaryList: { screen: SummaryList },
    Viewer: { screen: Viewer },
    //
    VideosLibrary: { screen: VideosLibrary },
    BuyVideos: { screen: BuyVideos },
    ContactUsScreen: { screen: ContactUsScreen },

    MySingleVideoDetails: { screen: MySingleVideoDetails },
    VideoComment: { screen: VideoComment },
    VideoQAPage: { screen: VideoQAPage },
    //
    MovePage: { screen: MovePage },
    StudentChallenge: { screen: StudentChallenge },
    MovePageExamsQuizes: { screen: MovePageExamsQuizes },
    FinishDetails: { screen: FinishDetails },
    QuestionDetails: { screen: QuestionDetails },
    ExamPageQuestion: { screen: ExamPageQuestion },
    FinishChallenge: { screen: FinishChallenge },
    PendingChalenge: { screen: PendingChalenge },
    VSpage: { screen: VSpage },
    Notifications: { screen: Notifications },
    Charge: { screen: Charge },
    ChargeDetails: { screen: ChargeDetails },
    ExpensesDetails: { screen: ExpensesDetails },
    MoneyTransactionsDetails: { screen: MoneyTransactionsDetails },
    AllTransactions: { screen: AllTransactions },

  },
  {
    initialRouteName: 'MainPage',
    headerMode: 'none',
  },
);
MainPageStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  let routeName = navigation.state.routes[navigation.state.index].routeName;
  if (
    routeName == 'Profile' ||
    routeName == 'ExamList' ||
    routeName == 'FullPageExam' ||
    routeName == 'FullPageExamWithAnswers' ||
    routeName == 'FullPageTimerAnswerdExam' ||
    routeName == 'FullPageTimerExam' ||
    routeName == 'SeeMore' ||
    routeName == 'Seloved_Student_Exam' ||
    routeName == 'SummaryList' ||
    routeName == 'Viewer' ||
    routeName == 'SolvedExams' ||
    routeName == 'VideosLibrary' ||
    routeName == 'MySingleVideoDetails' ||
    routeName == 'BuyVideos' ||
    routeName == 'ContactUsScreen' ||
    routeName == 'MovePage' ||
    routeName == 'StudentChallenge' ||
    routeName == 'MovePageExamsQuizes' ||
    routeName == 'FinishDetails' ||
    routeName == 'QuestionDetails' ||
    routeName == 'ExamPageQuestion' ||
    routeName == 'FinishChallenge' ||
    routeName == 'PendingChalenge' ||
    routeName == 'VSpage' ||
    routeName == 'Notifications' ||
    routeName == 'Charge' ||
    routeName == 'ChargeDetails' ||
    routeName == 'ExpensesDetails' ||
    routeName == 'MoneyTransactionsDetails' ||
    routeName == 'AllTransactions' ||
    routeName == 'VideoComment' ||
    routeName == 'VideoQAPage'
  ) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible,
  };
};

const TabBarCustomButton = (props) => {
  // var isSelected = accessibilityState.selected;

  if (props.accessibilityStates == 'selected') {
    return (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', position: 'absolute', top: 0 }}>
          <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}></View>
          <Svg width={75} height={61} viewBox="0 0 75 61">
            <Path
              d="M75.2 0v61H0V0c4.1 0 7.4 3.1 7.9 7.1C10 21.7 22.5 33 37.7 33c15.2 0 27.7-11.3 29.7-25.9.5-4 3.9-7.1 7.9-7.1h-.1z"
              fill={'#FFFFFF'}
            />
          </Svg>
          <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}></View>
        </View>

        <TouchableOpacity
          style={{
            top: -22.5,
            justifyContent: 'center',
            alignItems: 'center',
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: '#FFFFFF',
          }}
          onPress={props.onPress}>
          {props.children}
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          height: 60,
          backgroundColor: '#FFFFFF',
        }}
        activeOpacity={1}
        onPress={props.onPress}>
        {props.children}
      </TouchableOpacity>
    );
  }
};

const CustomTabBar = (props) => {
  return <BottomTabBar {...props.props} />;
};

const MyLibraryStack = createStackNavigator(
  {
    MyLibrary: { screen: MyLibrary },
    Setting: { screen: Setting },
    AboutCamp: { screen: AboutCamp },
    AboutApp: { screen: AboutApp },
    ReferFriend: { screen: ReferFriend },
  },
  {
    initialRouteName: 'MyLibrary',
    headerMode: 'none',
  },
);

MyLibraryStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  let routeName = navigation.state.routes[navigation.state.index].routeName;
  if (
    routeName == 'Setting' ||
    routeName == 'AboutCamp' ||
    routeName == 'AboutApp' ||
    routeName == 'ReferFriend'

  ) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible,
  };
};

const Tabs = createBottomTabNavigator(
  {
    MainPage: {
      screen: MainPageStack,
      navigationOptions: {
        tabBarLabel: 'الرئيسيه',
        tabBarIcon: ({ tintColor }) => (
          <View>
            <SimpleLineIcons
              style={[{ color: tintColor }]}
              size={25}
              name={'home'}
            />
          </View>
        ),
        tabBarButtonComponent: (props) => <TabBarCustomButton {...props} />,
      },
    },

    MyLibrary: {
      screen: MyLibraryStack,
      navigationOptions: {
        tabBarLabel: 'مكتبتى',
        tabBarIcon: ({ tintColor }) => (
          <View>
            <Ionicons
              style={[{ color: tintColor }]}
              size={25}
              name={'ios-book-outline'}
            />
          </View>
        ),
        tabBarButtonComponent: (props) => <TabBarCustomButton {...props} />,
      },
    },
  },
  {
    tabBarOptions: {
      style: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        right: 0,
        borderTopWidth: 0,
        backgroundColor: 'transparent',
        elevation: 0,
      },
      showLabel: false,
      activeTintColor: COLORS.primary,
      labelStyle: { fontFamily: FONTS.fontFamily },
    },
    tabBarComponent: (props) => <CustomTabBar props={props} />,

    initialRouteName: 'MainPage',
  },
);

export default Tabs;
