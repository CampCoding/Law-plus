import React, {
  createRef,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  FlatList,
  Animated,
  ImageBackground,
  findNodeHandle,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import {
  images as AppImages,
  AppRequired,
  COLORS,
  FONTS,
  SIZES,
  lotties,
} from '../../constants';
// import FastImage from 'react-native-fast-image';
import { RFValue } from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ActivityIndicator } from 'react-native-paper';
import { MsgComponent } from '../../components';
// import {useSelector} from 'react-redux';
// import {POST} from '../../../Helpers/ApiHelper';
import AnimatedLottieView from 'lottie-react-native';
// import utils from '../../../utils';
import Orientation from 'react-native-orientation';
import Axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
const images = {
  myQuestions: AppImages.AppLogo,
  otherQuestions: AppImages.questionsBg2,
};
const data = Object.keys(images).map(i => ({
  key: i,
  title: i,
  image: images[i],
  ref: createRef(),
}));

const Tab = forwardRef(({ item, onItemPress }, ref) => {
  return (
    <TouchableOpacity onPress={onItemPress}>
      <View ref={ref}>
        <Text
          style={{
            ...FONTS.h3,
            color: "white",
            textTransform: 'uppercase',
            // fontFamily: FONTS.f,
            // fontFamily: FONTS.fontFamilyBold,
          }}>
          {item.title == 'myQuestions' ? 'My Questions' : 'Other Questions'}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

const Indicator = ({ measures, scrollX }) => {
  const inputRange = data.map((_, i) => i * SIZES.width);
  const indicatorWidth = scrollX.interpolate({
    inputRange,
    outputRange: measures.map(measure => -measure.width),
  });
  const translateX = scrollX.interpolate({
    inputRange,
    outputRange: measures.map(measure => -measure.x),
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        height: RFValue(4),
        width: indicatorWidth,
        left: 0,
        backgroundColor: COLORS.third,
        bottom: RFValue(-10),
        transform: [
          {
            translateX,
          },
        ],
      }}
    />
  );
};

const Tabs = ({ data, scrollX, onItemPress }) => {
  const containerRef = useRef();
  const [measures, setMeasures] = useState([]);

  useEffect(() => {
    let m = [];
    data.forEach(item => {
      item.ref.current.measureLayout(
        containerRef.current,
        (x, y, width, height) => {
          m.push({
            x,
            y,
            width,
            height,
          });
          if (m.length === data.length) {
            setMeasures(m);
          }
        },
      );
    });
  });
  return (
    <View
      style={{
        position: 'absolute',
        top: RFValue(20),
        width: SIZES.width,
      }}>
      <View
        ref={containerRef}
        style={{
          justifyContent: 'space-evenly',
          flex: 1,
          flexDirection: 'row',
        }}>
        {data.map((item, index) => {
          return (
            <Tab
              key={item.key}
              item={item}
              ref={item.ref}
              onItemPress={() => {
                onItemPress(index);
              }}
            />
          );
        })}
      </View>
      {measures.length > 0 && (
        <Indicator measures={measures} scrollX={scrollX} />
      )}
    </View>
  );
};

const WholeCourseQuestions = ({ navigation, route }) => {
  // const {userData} = useSelector(s => s.UserReducer);
  // const {psData} = route.params;
  const scrollX = useRef(new Animated.Value(0)).current;
  const res = useRef();
  const onItemPress = useCallback(itemIndex => {
    res.current.scrollToOffset({
      offset: itemIndex * SIZES.width,
    });
  });

  // My Questions Vars
  const [loadingMyQuestions, setLoadingMyQuestions] = useState(false);
  const [loadingOtherQuestions, setLoadingOtherQuestions] = useState(true);

  const [disabledMsg, setDisabledMsg] = useState(false);
  const [msg, setMsg] = useState(false);
  const [myQuestions, setMyQuestions] = useState([]);
  const [otherQuestions, setOtherQuestions] = useState([]);

  useEffect(() => {
    // getMyQuestions();

    getOtherQuestions();
    return () => {
      if (navigation.getParam('type') === "video") {
        // console.log("eeee")
        Orientation.lockToLandscape();
      }
    }
  }, []);



  async function getOtherQuestions() {
    let data_to_Send = {
      video_id: navigation.getParam('video_id'),
      type: navigation.getParam('type')
    };


    Axios.post(AppRequired.Domain + 'home/live/select_course_questions.php', data_to_Send)
      .then((res) => {
        console.log(res.data)
        setOtherQuestions(res.data.message);
      })
    // if (res) {
    //   setOtherQuestions(res);
    // }
    setLoadingOtherQuestions(false);

  }

  const msgValid = txt => txt && txt.replace(/\s/g, '').length;
  async function sendMsg() {

    if (msg == '' || msgValid(msg) == 0) {
      utils.toastAlert('info', 'Enter Something ....');

      return;
    }
    await setDisabledMsg(true);
    let studentData = JSON.parse(await AsyncStorage.getItem('AllData'));


    let msgData = {
      student_id: studentData.student_id,
      text: msg.trim(),
      video_id: navigation.getParam('video_id'),
      type: navigation.getParam('type')
    };
    console.log(msgData)
    Axios.post(AppRequired.Domain + 'home/live/insert_qus.php', msgData)
      .then((res) => {
        getOtherQuestions();
        setMsg('');
      })




    setDisabledMsg(false);
  }
  const sorted = id => {
    if (id == 1) {
      return myQuestions.sort(function (a, b) {
        return new Date(b.time) < new Date(a.time)
          ? -1
          : new Date(b.time) > new Date(a.time)
            ? 1
            : 0;
      });
    } else {
      return otherQuestions.sort(function (a, b) {
        return new Date(b.time) < new Date(a.time)
          ? -1
          : new Date(b.time) > new Date(a.time)
            ? 1
            : 0;
      });
    }
  };

  function renderMyQuestions() {
    return (
      <View
        style={{
          flex: 1,
          marginVertical: RFValue(70),
          marginBottom: RFValue(105),

        }}>

        <FlatList
          style={{ flex: 1 }}
          data={sorted(1)}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index}
          inverted
          renderItem={({ item, index }) => {
            return <MsgComponent item={item} index={index} />;
          }}
          ListEmptyComponent={
            loadingMyQuestions ? (
              <ActivityIndicator size={30} color={COLORS.white} />
            ) : (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  // paddingTop: '25%',
                }}>
                {/* <AnimatedLottieView
                  source={lotties.emptyData}
                  loop
                  autoPlay
                  style={{
                    width: RFValue(200),
                    height: RFValue(200),
                  }}
                  resizeMode="contain"
                /> */}
              </View>
            )
          }
        />
      </View>
    );
  }
  function renderOtherQuestions() {
    return (
      <View
        style={{
          flex: 1,
          marginVertical: RFValue(65),
        }}>
        <FlatList
          style={{ flex: 1 }}
          data={
            otherQuestions
            // sorted(2)
          }
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index}
          inverted
          renderItem={({ item, index }) => {
            return <MsgComponent item={item} index={index} />;
          }}
          ListEmptyComponent={
            loadingOtherQuestions ? (
              <ActivityIndicator size={30} color={COLORS.white} />
            ) : (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  // paddingTop: '25%',
                }}>
                {/* <AnimatedLottieView
                  source={lotties.emptyData}
                  loop
                  autoPlay
                  style={{
                    width: RFValue(200),
                    height: RFValue(200),
                  }}
                  resizeMode="contain"
                /> */}
              </View>
            )
          }
        />
      </View>
    );
  }

  const [curIndex, setCurIndex] = useState(0);
  const _onViewableItemsChanged = useCallback(({ viewableItems, changed }) => {
    setCurIndex(viewableItems[0].index);
  }, []);

  const _viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  return (
    <View style={styles.container}>
      {/* <StatusBar hidden /> */}
      {/* <Animated.FlatList
        ref={res}
        data={data}
        keyExtractor={item => item.key}
        horizontal
        showsHorizontalScrollIndicator={false}
        // pagingEnabled
        // bounces={false}
        // onViewableItemsChanged={_onViewableItemsChanged}
        // viewabilityConfig={_viewabilityConfig}

        // onScroll={Animated.event(
        //   [{nativeEvent: {contentOffset: {x: scrollX}}}],
        //   {useNativeDriver: false},
        // )}
        renderItem={({item, index}) => {
          return ( */}
      <View
        style={{
          width: SIZES.width,
          height: SIZES.height,
          backgroundColor: "#000"
        }}>
        {/* <ImageBackground
                source={data[0].image}
                style={{
                  flex: 1,
                  paddingTop: RFValue(60),
                  // backgroundColor: 'red',
                }}
                resizeMode="cover">

                </ImageBackground> */}

        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: COLORS.darkOverlayColor,
          }}>

          {/* {index == 0 ? renderMyQuestions() : */}
          {renderOtherQuestions()
          }

        </View>
      </View>
      {/* );
        }}
      /> */}

      {/* <Tabs scrollX={scrollX} data={data} onItemPress={onItemPress} /> */}
      {curIndex == 0 && (
        <View
          style={{
            width: '100%',
            backgroundColor: "#000",
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 7,
            justifyContent: 'space-evenly',
            position: 'absolute',
            bottom: 0,
            minHeight: RFValue(60),
            maxHeight: RFValue(200)
          }}>
          <TextInput
            style={{
              backgroundColor: "#fff",
              width: '80%',
              borderRadius: 25,
              borderWidth: 0.5,
              borderColor: "#fff",
              paddingHorizontal: 15,
              color: COLORS.black,
              ...FONTS.h3,
              minHeight: RFValue(35),
              // textAlign:"auto",
              maxHeight: RFValue(200)

              // alignItems:"center",
              // justifyContent:"center",

            }}
            placeholder="type a question"
            placeholderTextColor={COLORS.black}
            multiline={true}
            value={msg}
            onChangeText={val => setMsg(val)}
          />


          <TouchableOpacity
            disabled={disabledMsg}
            onPress={() => {

              sendMsg();
            }}>
            <Ionicons
              style={{
                // marginHorizontal: 15,
                color: "#fff",
              }}
              name="paper-plane-sharp"
              size={35}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default WholeCourseQuestions;
