import moment from 'moment';
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {COLORS, FONTS} from '../constants';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// create a component
const TimeDelivery = props => {
  const {sender, item} = props;
  return (
    <View
      style={[
        styles.mainView,
        {
          justifyContent: 'flex-end',
        },
      ]}>
      <View>
        <Text
          style={{
            ...FONTS.h5,
            color: sender ? COLORS.white : COLORS.black,
          }}>
          {moment(item.time).format('lll')}
        </Text>
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  mainView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
});

//make this component available to the app
export default TimeDelivery;
