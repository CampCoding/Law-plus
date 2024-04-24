import * as React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
const {width, height} = Dimensions.get('window');
import DeviceInfo from 'react-native-device-info';
import {AppRequired, COLORS, FONTS, images} from '../../constants';

export default class CopyRight extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      androidId: '',
      brande: '',
      deviceId: '',
      buildNumber: '',
      carrier: '',
      deviceName: '',
      ip: '',
      mac: '',
      serialNumber: '',
      model: '',
    };
  }

  componentDidMount() {
    this.getDeviceInfo();
  }

  getDeviceInfo = () => {
    /////////////////////   androidId
    DeviceInfo.getAndroidId().then((androidId) => {
      this.setState({
        androidId: androidId,
      });
    });

    ///////////////////////    Brand
    let brand = DeviceInfo.getBrand();
    this.setState({
      brande: brand,
    });
    ////////////////////     getBuildNumber
    let buildNumber = DeviceInfo.getBuildNumber();
    this.setState({
      buildNumber: buildNumber,
    });
    ///////////////////    getCarrier
    DeviceInfo.getCarrier().then((carrier) => {
      this.setState({
        carrier: carrier,
      });
    });

    ///////////////////    deviceId
    let deviceId = DeviceInfo.getDeviceId();
    this.setState({
      deviceId: deviceId,
    });
    ///////////////////  deviceId
    DeviceInfo.getDeviceName().then((deviceName) => {
      this.setState({
        deviceName: deviceName,
      });
    });
    ///////////////     IpAddress
    DeviceInfo.getIpAddress().then((ip) => {
      this.setState({
        ip: ip,
      });
    });
    /////////////////   MacAddress
    DeviceInfo.getMacAddress().then((mac) => {
      this.setState({
        mac: mac,
      });
    });
    ////////////////////// PhoneNumber

    ///////////////////////   SerialNumber
    DeviceInfo.getSerialNumber().then((serialNumber) => {
      this.setState({
        serialNumber: serialNumber,
      });
    });
    ////////////////////////    modal (Android   iOS  Windows)
    let model = DeviceInfo.getModel();
    this.setState({
      model: model,
    });
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <StatusBar backgroundColor={COLORS.secondary} />
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
              <FontAwesome5
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
              حقوق النشر
            </Text>
          </View>
          <View style={{flex: 1}} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          // style={{ padding: 20 }}
        >
          <View
            style={{
              flexDirection: 'row',
              padding: 20,
            }}>
            <Image style={{height: 170, width: 130}} source={images.AppLogo} />
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{fontFamily: FONTS.fontFamily, fontSize: 20}}>
                {AppRequired.teacherName}
              </Text>
            </View>
          </View>

          <View
            style={{
              width: '95%',
              alignSelf: 'center',
              backgroundColor: '#ddd',
              borderRadius: 10,
              padding: 7,
              elevation: 1,
              marginBottom: 20,
            }}>
            <Text
              style={{
                color: 'red',
                fontFamily: FONTS.fontFamily,
                fontSize: 18,
                textAlign: 'center',
              }}>
              هذا المحتوى غير مصرح بتسجيله فى حاله القيام بتسجيله و نشره سيتم
              تحويل عنوانك إلى الجهات المختصه فى أمن الدوله و سيواجه الفاعل
              بغرامه ماليه 100,000 جنيهاً مصرياً على كل سرقه تتم من المحتوى
            </Text>
            <Text
              style={{
                fontFamily: FONTS.fontFamily,
                fontSize: 18,
                textAlign: 'center',
              }}>
              الأستاذ مش مسامح من يسرق و من يشجع السرقه
            </Text>
          </View>

          <View
            style={{
              width: '95%',
              alignSelf: 'center',
              backgroundColor: '#ddd',
              borderRadius: 10,
              padding: 7,
              elevation: 1,
              marginBottom: 20,
              // padding:20
              // padding: 7,
              // margin: '2.5%',
              // backgroundColor: '#f00'
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
                fontWeight: 'bold',
              }}>
              مواصفات الجهاز :
            </Text>
            <Text style={{fontFamily: FONTS.fontFamily, fontSize: 15}}>
              Device Name : {this.state.deviceName}
            </Text>
            <Text style={{fontFamily: FONTS.fontFamily, fontSize: 15}}>
              Device Model : {this.state.brande} {this.state.deviceId}
            </Text>
            <Text style={{fontFamily: FONTS.fontFamily, fontSize: 15}}>
              {this.state.carrier}
            </Text>
            <Text style={{fontFamily: FONTS.fontFamily, fontSize: 15}}>
              Device Id: {this.state.androidId}
            </Text>
            <Text style={{fontFamily: FONTS.fontFamily, fontSize: 15}}>
              Build Number : {this.state.buildNumber}
            </Text>
            <Text style={{fontFamily: FONTS.fontFamily, fontSize: 15}}>
              ip Address : {this.state.ip}
            </Text>
            <Text style={{fontFamily: FONTS.fontFamily, fontSize: 15}}>
              mac Address : {this.state.mac}
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}
