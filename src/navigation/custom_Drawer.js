import * as React from 'react';
import {Dimensions} from 'react-native';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

import {images, FONTS, AppRequired, icons} from '../constants';

export function custom_Drawer(props) {
  const [items] = React.useState([
    {
      imageSourse: icons.user,

      navOptionName: 'Profile',
    },
    // {
    //   imageSourse: icons.examIcon,
    //   navOptionName: 'Exam List',
    // },

    // {
    //   imageSourse: icons.test,
    //   navOptionName: 'Solved exams',
    // },
    {
      imageSourse: icons.file,
      navOptionName: 'Summarys',
    },
    {
      imageSourse: icons.video_files,

      navOptionName: 'my library',
    },
  ]);

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            // justifyContent:'center'
          }}>
          <View style={{margin: 10}}>
            <Image
              source={images.AppLogo}
              style={{borderRadius: 100, width: 70, height: 70}}
            />
          </View>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{fontSize: 18, fontFamily: FONTS.fontFamily}}>
              {AppRequired.appName}
            </Text>
          </View>
        </View>
        <View
          style={{width: '100%', height: 2, backgroundColor: 'lightgray'}}
        />

        {items.map((item, key) => (
          <TouchableOpacity
            onPress={() => {
              //   setState({position: key});
              if (key == 0) {
                props.navigation.closeDrawer();
              } else if (key == 1) {
                props.navigation.navigate('SummaryList');

                // props.navigation.navigate('ExamList');
              } else if (key == 2) {
                props.navigation.navigate('VideosLibrary');

                // props.navigation.navigate('SolvedExams');
              }
              // else if (key == 3) {
              //   props.navigation.navigate('SummaryList');
              // } else if (key == 4) {
              //   props.navigation.navigate('VideosLibrary');
              // }
              props.navigation.closeDrawer();
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingTop: 10,
                paddingBottom: 10,
                backgroundColor: '#efefefef',
                margin: 7,
                borderRadius: 8,
              }}>
              <>
                <View
                  style={{
                    marginRight: 15,
                    marginLeft: 10,
                    width: 40,
                    alignItems: 'center',
                  }}>
                  <Image
                    source={item.imageSourse}
                    style={{
                      width: 30,
                      height: 30,
                      tintColor: key == 0 ? 'darkgray' : '',
                    }}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: FONTS.fontFamily,
                    // color: '#000',
                    // letterSpacing: 1.5,
                  }}>
                  {item.navOptionName}
                </Text>
              </>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
