import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  Animated,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import LottieView from 'lottie-react-native';
import { TextButton } from '../components';
import { images, FONTS, COLORS, SIZES } from '../constants';
const onboarding_screens = [
  {
    id: 1,
    backgroundImage: require('../../assets/images/background_01.png'),
    bannerImage: require('../../assets/lottie/intro_dentest_1.json'),
    title: 'اهلا بيك فى قانوني بلس',
    description: 'تطبيق  قانوني بلس بداية طريق لتعلم احسن',
  },
  {
    id: 2,
    backgroundImage: require('../../assets/images/background_02.png'),
    // bannerImage: require('../assets/images/intro2.png'),
    bannerImage: require('../../assets/lottie/intro_dent_2.json'),

    title: 'المتابعة',
    description: 'على طول هتكون معانا خطوة بخطوة من بداية دخولك ليوم تخرجك',
  },
  {
    id: 3,
    backgroundImage: require('../../assets/images/background_01.png'),
    // bannerImage: require('../assets/images/intro3.png'),
    bannerImage: require('../../assets/lottie/intro_1.json'),

    title: 'التحصيل',
    description: 'هتطبق بأحدث الاساليب التعليمية لحد ما تكون مؤهل 100%',
  },
];
const IntroSlider = ({ navigation }) => {
  const [showStatus, setShowStatus] = React.useState('home');
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const onViewChangeRef = React.useRef(({ viewableItems, changes }) => {
    setCurrentIndex(viewableItems[0].index);
  });

  React.useEffect(() => { }, []);
  const flatListRef = React.useRef();
  const Dots = () => {
    const dotPosition = Animated.divide(scrollX, SIZES.width);
    return (
      <View
        style={{
          // flexDirection: 'row-reverse',
          flexDirection: 'row',

          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {onboarding_screens.map((item, index) => {
          const dotColor = dotPosition.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [
              COLORS.lightOrange,
              COLORS.primary,
              COLORS.lightOrange,
            ],
            extrapolate: 'clamp',
          });
          const dotWidth = dotPosition.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [10, 30, 10],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={`Dots-${index}`}
              style={{
                borderRadius: 5,
                marginHorizontal: 5,
                width: dotWidth,
                height: 10,
                backgroundColor: dotColor,
              }}
            />
          );
        })}
      </View>
    );
  };
  function renderHeaderLogo() {
    return (
      <View
        style={{
          position: 'absolute',
          top: SIZES.height > 800 ? 50 : 25,
          left: 0,
          right: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={images.AppLogo}
          resizeMode="contain"
          style={{
            width: 400,
            height: 200,
          }}
        />
      </View>
    );
  }

  function renderFooter() {
    return (
      <View
        style={{
          height: 100,
        }}>
        {/* Pagination / Dots */}
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
          }}>
          <Dots />
        </View>
        {/* Buttons */}
        {currentIndex < onboarding_screens.length - 1 && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: SIZES.padding,
              marginVertical: SIZES.padding,
            }}>
            <TextButton
              label="تخطى"
              buttonContainerStyle={{
                backgroundColor: null,
                marginHorizontal: 40,
              }}
              labelStyle={{
                color: COLORS.darkgray,
                fontFamily: FONTS.fontFamily,
                fontSize: 18,
              }}
              onPress={async () => {
                await AsyncStorage.setItem('switch', 'Auth');
                navigation.navigate('Auth');
              }}
            />
            <TextButton
              label={'التالى'}
              labelStyle={{
                fontFamily: FONTS.fontFamily,
                color: '#fff',
                fontSize: 18,
              }}
              buttonContainerStyle={{
                backgroundColor: COLORS.primary,
                height: 50,
                // width: 160,
                flex: 1,
                borderRadius: SIZES.radius,
              }}
              onPress={() => {
                flatListRef?.current?.scrollToIndex({
                  index: currentIndex + 1,
                  animated: true,
                });
              }}
            />
          </View>
        )}

        {currentIndex == 2 && (
          <View
            style={{
              paddingHorizontal: SIZES.padding,
              marginVertical: SIZES.padding,
            }}>
            <TextButton
              label="أبداء"
              labelStyle={{
                fontFamily: FONTS.fontFamily,
                fontSize: 18,
                color: '#fff',
              }}
              buttonContainerStyle={{
                height: 60,
                borderRadius: SIZES.radius,
              }}
              onPress={async () => {
                await AsyncStorage.setItem('switch', 'Auth');
                navigation.navigate('Auth');
              }}
            />
          </View>
        )}
      </View>
    );
  }
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}>
      <StatusBar backgroundColor={COLORS.primary} />

      {renderHeaderLogo()}
      <Animated.FlatList
        ref={flatListRef}
        horizontal
        pagingEnabled
        data={onboarding_screens}
        scrollEventThrottle={16}
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => `${item.id}`}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          {
            useNativeDriver: false,
          },
        )}
        onViewableItemsChanged={onViewChangeRef.current}
        renderItem={({ item, index }) => {
          return (
            <View
              style={{
                width: SIZES.width,
              }}>
              {/* Header */}
              <View
                style={{
                  flex: 3,
                }}>
                <ImageBackground
                  source={item.backgroundImage}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    height: index == 1 ? '95.7%' : '100%',
                    width: '100%',
                  }}>
                  <LottieView
                    source={item.bannerImage}
                    autoPlay
                    loop
                    style={{ height: SIZES.width * 0.5, width: '100%' }}
                    resizeMode="contain"
                  />
                  {/* <Image
                    source={item.bannerImage}
                    resizeMode="contain"
                    style={{
                      width: SIZES.width * 0.8,
                      height: SIZES.width * 0.8,
                      marginBottom: -SIZES.padding,
                    }}
                  /> */}
                </ImageBackground>
              </View>
              {/* Details */}
              <View
                style={{
                  flex: 1,
                  marginTop: 30,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: SIZES.radius,
                }}>
                <Text
                  style={{
                    ...FONTS.h1,
                    // fontSize: 25,
                    fontFamily: FONTS.fontFamily,
                  }}>
                  {item.title}
                </Text>
                <Text
                  style={{
                    marginTop: SIZES.radius,
                    textAlign: 'center',
                    color: COLORS.darkgray,
                    paddingHorizontal: SIZES.padding,
                    // fontSize: 20,
                    fontFamily: FONTS.fontFamily,
                  }}>
                  {item.description}
                </Text>
              </View>
            </View>
          );
        }}
      />

      {renderFooter()}
    </View>
  );
};

export default IntroSlider;
