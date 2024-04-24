import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,Image } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
// import Toast from 'react-native-simple-toast';
import { COLORS, FONTS, SIZES, images } from '../constants';
import TimeDelivery from './TimeDelivery';
// import Image from 'react-native-fast-image';
import { RFValue } from 'react-native-responsive-fontsize';
const MsgComponent = props => {
  const { sender, massage, item, sendTime, index } = props;

  return (
    <>


      {item.question_replay != '' && item.question_replay != null && (
        <View
          // onLongPress={() => {
          // Clipboard.setString(item.message);
          // Toast.showWithGravity('تم نسخ النص', Toast.SHORT, Toast.BOTTOM);
          // }}
          style={{ marginVertical: 0 }}>
          <View style={[styles.TriangleShapeCSS, styles.left]} />
          <View
            style={[
              styles.masBox,
              {
                alignSelf: 'flex-start',
                backgroundColor: "white",
                borderRadius:RFValue(8)
              },
            ]}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={images.AppLogo}
                style={{
                  width: RFValue(20),
                  height: RFValue(20),
                }}
                resizeMode="contain"
              />
              <Text
                style={{
                  ...FONTS.h4,
                  color: "#000",
                  // fontFamily: FONTS.fontFamilyBold,
                  marginLeft: 10,
                }}>
               Anglo-Academy
              </Text>
            </View>
            <Text
              style={{
                paddingLeft: 5,
                color: "#000",
                ...FONTS.h4,
              }}>
              {item.question_replay}
            </Text>

            <View style={{
              marginBottom: 2,
            }} />
            {/* <TimeDelivery sender={false} item={item} /> */}

          </View>
        </View>
      )}


      <View
        // onLongPress={() => {
        // Clipboard.setString(item.message);
        // Toast.showWithGravity('تم نسخ النص', Toast.SHORT, Toast.BOTTOM);
        // }}

        style={{ marginVertical: 0 }}>
        <View style={[styles.TriangleShapeCSS, styles.right]} />
        <View
          style={[
            styles.masBox,
            {
              alignSelf: 'flex-end',
              backgroundColor: COLORS.primary,
            },
          ]}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              // backgroundColor:"#fff"
            }}>
            <Image
              source={images.AppLogo}
              style={{
                width: RFValue(30),
                height: RFValue(30),
                backgroundColor:"#fff"
              }}
              resizeMode="contain"
            />
            <Text
              style={{
                ...FONTS.h4,
                color:'white',
                // fontFamily: FONTS.fontFamilyBold,
                marginLeft: 10,
              }}>
              {item.student_name} 
            </Text>
          </View>
          <Text
            style={{
              paddingLeft: 5,
              color: "white",
              ...FONTS.h4,
            }}>
            {item.question_text}
          </Text>

          <TimeDelivery sender={true} item={item} />
        </View>
      </View>
      <View style={{
        flexDirection: "row", marginBottom: SIZES.base, justifyContent: "space-between", alignItems: "center", paddingHorizontal: RFValue(12)
      }}>
        <View style={{
          flex: 1, height: 2,
          backgroundColor: "white",

        }}>

        </View>
        <View style={{
          justifyContent: "center",
          alignItems: "center", paddingHorizontal: RFValue(10)
        }}>
          <Text
            numberOfLines={1}
            style={{
              flex: 1,
              color: "white",

            }}>{item.question}</Text>
        </View>
        <View style={{
          flex: 1, height: 2,
          backgroundColor: "white",

        }}>

        </View>

      </View>
    </>
  );
};

const styles = StyleSheet.create({
  masBox: {
    alignSelf: 'flex-end',
    marginHorizontal: 10,
    minWidth: 80,
    maxWidth: '80%',
    paddingHorizontal: 10,
    marginVertical: RFValue(10),
    paddingTop: 8,
    borderRadius: 8,
  },
  timeText: {
    fontFamily: 'AveriaSerifLibre-Light',
    fontSize: 10,
  },
  dayview: {
    alignSelf: 'center',
    height: 30,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: COLORS.white,
    borderRadius: 30,
    marginTop: 10,
  },
  iconView: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.third,
  },
  TriangleShapeCSS: {
    position: 'absolute',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 15,
    borderRightWidth: 5,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  left: {
    borderBottomColor:"white",
    left: 2,
    bottom: RFValue(14),
    transform: [{ rotate: '0deg' }],
  },
  right: {
    borderBottomColor: COLORS.primary,
    right: 1,
    bottom: 12,
    transform: [{ rotate: '140deg' }],
  },
});

export default MsgComponent;
