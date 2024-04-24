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
import { AppRequired, COLORS, FONTS, images } from '../../constants';
import { WebView } from 'react-native-webview';
export default class AboutApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: [
        {
          phone: '01019737505',
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
          <Left style={{ flex: 1 }}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack();
              }}>
              <Icon
                name="arrow-right"
                style={{ fontSize: 20, color: '#fff', marginLeft: 10 }}
              />
            </TouchableOpacity>
          </Left>
          <Body
            style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
            <Title
              numberOfLines={2}
              style={{
                fontSize: 20,
                fontFamily: FONTS.fontFamily,
                alignSelf: 'center',
                textAlign: 'center',
              }}>
              {AppRequired.appName}
            </Title>
          </Body>
          <Right />
        </Header>
        {/* ----------- */}

        <>
          {/* <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ marginBottom: 20 }}> */}
          <View style={{ flex: 1 }}>
            <WebView
              style={{
                flex: 1,
                width: "100%",
                height: "100%"
              }}
              source={{ uri: "https://camp-coding.online/law_plus/student/home/about_us.php" }}
            />
          </View>
          {/* </ScrollView> */}
        </>
      </Container>
    );
  }
}
