import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import Share from 'react-native-share';
import { COLORS, FONTS, SIZES, images, lottie } from '../../constants';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-community/async-storage';
import Axios from 'axios';
import LottieView from 'lottie-react-native';
const ReferFriend = ({ navigation }) => {
  const [referralCode, setReferralCode] = useState({})
  const [loading, setLoading] = useState(true)


  useEffect(async () => {

    let StudentData = JSON.parse(await AsyncStorage.getItem('AllData'));
    Axios.post("https://camp-coding.online/law_plus/student/authentication/app_link.php", { student_id: StudentData.student_id }).then((res) => {
      // console.log(res.data)
      if (res.data.status == "success") {
        setReferralCode(res.data.message)
        setLoading(false)
      }


    })
  }, [])

  const handleShare = async () => {
    try {
      const shareOptions = {
        title: 'Share Referral Code',
        message: `Use my referral code ${referralCode.code} to get started on our app ${referralCode.app_link}!`,
      };
      await Share.open(shareOptions);
    } catch (error) {
      console.log('Error sharing:', error.message);
    }
  };

  return (
    <View style={styles.container}>


      <View
        style={{
          width: SIZES.width,
          height: SIZES.height * 0.1,
          backgroundColor: COLORS.primary,
          borderBottomLeftRadius: 50,
          borderBottomRightRadius: 50,
          flexDirection: 'row',
        }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Icon
              name="arrow-right"
              style={{ fontSize: 26, color: '#fff', marginLeft: 10 }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 2,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontFamily: FONTS.fontFamily,
              color: '#fff',
              fontSize: 22,
            }}>
            دعوة صديق
          </Text>
        </View>
        <View style={{ flex: 1 }} />
      </View>
      {loading ? <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          width: '90%',
          margin: '5%',
          marginTop: '5%',
        }}>
        <ActivityIndicator size={50} color={COLORS.searchBar} />
      </View> :
        Object.keys(referralCode).length > 0 ?
          <ScrollView contentContainerStyle={{
            paddingHorizontal: 10
          }}>
            <Image
              source={images.referFriend} // Replace with your image path
              style={styles.image}
              resizeMode="cover"
            />
            <Text style={styles.heading}>ادعو صديقك</Text>
            <Text style={styles.stepText}>{
              referralCode.text
            }</Text>

            <View style={styles.codeBox}>
              <Text style={{
                color: COLORS.lightGray3,
                textAlign: "center"

              }}>Your code</Text>
              <Text style={styles.code}>{referralCode.code}</Text>
            </View>
            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <Text style={styles.shareButtonText}>Share</Text>
            </TouchableOpacity>
          </ScrollView> :
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              width: '90%',
              margin: '5%',
              marginTop: '5%',
            }}>
            <LottieView
              source={lottie.noData}
              autoPlay
              loop
              style={{ height: SIZES.width * 0.5, width: '100%' }}
              resizeMode="contain"
            />
          </View>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    // paddingHorizontal: 20,
  },
  image: {
    width: "100%",
    height: 200,
    marginVertical: 20,
    borderRadius: 10
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    color: COLORS.searchBar
  },
  stepText: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  codeBox: {
    // borderWidth: 1,
    // borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginTop: 100,
    backgroundColor: COLORS.searchBar
  },
  code: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: "center"

  },
  shareButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  shareButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: "center"
  },
});

export default ReferFriend;
