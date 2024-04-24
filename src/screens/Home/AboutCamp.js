import * as React from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  Linking,
  TouchableOpacity,
  ToastAndroid,
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
import FontAwesome5Brands from 'react-native-vector-icons/FontAwesome5Pro';
import {AppRequired, COLORS, FONTS, images} from '../../constants';

export default class AboutAld7y7 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: [
        {
          phone: '01090768598',
        },
      ],
    };
  }

  render() {
    return (
      <Container>
        <Header
          androidStatusBarColor={COLORS.primary}
          style={{
            backgroundColor: COLORS.primary,
          }}>
          <Left style={{flex: 1}}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack();
              }}>
              <Icon
                name="arrow-right"
                style={{fontSize: 20, color: '#fff', marginLeft: 10}}
              />
            </TouchableOpacity>
          </Left>
          <Body
            style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
            <Title
              numberOfLines={2}
              style={{
                fontSize: 20,
                fontFamily: FONTS.fontFamily,
                alignSelf: 'center',
                textAlign: 'center',
              }}>
              Camp Coding
            </Title>
          </Body>
          <Right />
        </Header>
        {/* ----------- */}

        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{marginBottom: 20}}>
            <View
              style={{
                backgroundColor: '#fff',
                width: '90%',
                marginHorizontal: '5%',
                marginVertical: '2%',
                elevation: 5,
                borderRadius: 15,
                flexDirection: 'row',
                // paddingHorizontal: 10,
                overflow: 'hidden',
              }}>
              <View
                style={{
                  // flex: 2,
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    width: '100%',

                    height: 200,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={images.Camp}
                    style={{
                      height: '100%',
                      width: '100%',
                      // borderRadius: 100,
                    }}
                  />
                </View>
              </View>
            </View>

            <View
              style={{
                elevation: 5,
                borderRadius: 15,
                backgroundColor: '#fff',
                width: '90%',
                alignSelf: 'center',
                marginVertical: 20,
                padding: 10,
                paddingLeft: 30,
              }}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 2,
                  // justifyContent: 'space-between',
                }}
                onPress={() => {
                  Linking.openURL('fb://page/105408154982508');
                }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 18,
                    color: COLORS.primary,
                    flex: 3,
                    textAlign: 'right',
                  }}>
                  Camp Coding Page
                </Text>

                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <FontAwesome5Brands
                    name="facebook-square"
                    color="#007aff"
                    size={33}
                  />
                </View>
              </TouchableOpacity>
              {/* --- */}
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#ddd',
                  width: '80%',
                  alignSelf: 'center',
                }}
              />
              {/* ---- */}
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 2,
                  // justifyContent: 'space-between',
                }}
                onPress={() => {
                  Linking.openURL(`mailto:teachers-app@camp-coding.com`);
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontWeight: 'bold',
                    fontSize: 18,
                    color: COLORS.primary,
                    flex: 3,
                  }}>
                  teachers-app@camp-coding.com
                </Text>

                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={images.logo_gmail}
                    style={{
                      height: 30,
                      width: 30,
                      // borderRadius: 100,
                    }}
                  />
                  {/* <Icon name="mail-bulk" color="#007aff" size={33} /> */}
                </View>
              </TouchableOpacity>
            </View>

            {/* ------- */}
            {/* ------- */}
            {/* ------- */}

            <View
              style={{
                width: '90%',
                alignSelf: 'center',
                marginTop: 0,
                // alignItems:'center'
              }}>
              <Text
                style={{
                  // fontWeight: 'bold',
                  fontSize: 20,
                  // color: '#8B008B',
                  fontFamily: FONTS.fontFamily,
                  marginTop: 10,
                  marginRight: 5,
                }}>
                تواصل معنا من خلال
              </Text>
            </View>
            {/* --------- */}

            <View
              style={{
                backgroundColor: '#fff',
                width: '90%',
                marginHorizontal: '5%',
                elevation: 5,
                borderRadius: 15,
                padding: 7,
              }}>
              {this.state.phone.map((item, index) => {
                return (
                  <>
                    <View
                      style={{
                        width: '100%',
                        alignItems: 'center',

                        marginVertical: 6,
                      }}>
                      <View
                        style={{
                          width: '100%',
                          paddingHorizontal: 8,

                          flexDirection: 'row',

                          justifyContent: 'space-between',
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            Linking.openURL(`https://wa.me/+2${item.phone}`);
                          }}>
                          <FontAwesome5Brands
                            name="whatsapp-square"
                            color={COLORS.primary}
                            size={33}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{paddingLeft: 15, paddingRight: 5}}
                          onPress={() => {
                            Linking.openURL(`tel:${item.phone}`);
                          }}>
                          <Icon
                            name="phone-square"
                            color={COLORS.primary}
                            size={33}
                          />
                        </TouchableOpacity>
                        <Text
                          style={{
                            fontWeight: 'bold',
                            fontSize: 21,
                            textAlign: 'center',
                          }}>
                          {`${item.phone}`}
                        </Text>
                      </View>
                    </View>

                    {index != this.state.phone.length - 1 ? (
                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: '#ddd',
                          width: '80%',
                          alignSelf: 'center',
                        }}
                      />
                    ) : null}
                  </>
                );
              })}
            </View>

            {/* ------------------- */}
            <View
              style={{
                width: '90%',
                alignSelf: 'center',
                marginTop: 15,
                // alignItems:'center'
                // backgroundColor:"#f00"
              }}>
              <Text
                style={{
                  // fontWeight: 'bold',
                  fontFamily: FONTS.fontFamily,
                  fontSize: 20,
                  // color: '#8B008B',

                  marginRight: 5,
                }}>
                أو عن طريق الايميل الاتي
              </Text>

              <View
                style={{
                  width: '100%',
                  // height: 40,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#fff',
                  elevation: 5,
                  borderRadius: 15,
                  padding: 15,
                  // padding: 5,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(`mailto:info@camp-coding.com'`);
                  }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontWeight: 'bold',
                      fontSize: 18,
                      textDecorationLine: 'underline',
                      color: COLORS.primary,
                    }}>
                    info@camp-coding.com
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* -------- */}
            <View style={{height: 20}}></View>
            {/* ---------------- */}
          </ScrollView>
        </>
      </Container>
    );
  }
}
