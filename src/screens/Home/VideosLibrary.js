import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ScrollView,
  Dimensions,
  Image,
  FlatList,
  ImageBackground,
  StatusBar,
  Modal,
  ToastAndroid,
  PermissionsAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {
  Button,
  FAB,
  Portal,
  Provider,
  Menu,
  Divider,
  ActivityIndicator,
} from 'react-native-paper';
import axios from 'axios';
import * as Animatable from 'react-native-animatable';
import { RefreshControl } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { AppRequired, COLORS, FONTS, images } from '../../constants';
import { UserContext } from '../Context/UserContext';
import RNFetchBlob from 'rn-fetch-blob';

const { width, height } = Dimensions.get('window');
export default class VideosLibrary extends React.Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      My_videos_array: [],
      isPageLoading: true,

      vedio_details: null,
      thereIsVideos: false,
      checkInsertViewFun: false,
      isSelectedPlayer1: true,
      lec_data: this.props.navigation.getParam('lectureData')
    };
  }

  componentDidMount() {
    this.setState({ isPageLoading: true });

    this.getAllMyVediosFor();
  }

  getAllMyVediosFor = async () => {
    const data = JSON.parse(await AsyncStorage.getItem('AllData'));
    const lectureData = this.props.navigation.getParam('lectureData');
    // console.log(lectureData)
    let student_token = await AsyncStorage.getItem('fcmToken');

    let data_to_send = {
      student_id: data.student_id,
      lecture_id: lectureData.lec_id,
      student_token,
    };

    axios
      .post(
        AppRequired.Domain + 'home/lectures/select_lectures_video.php',
        data_to_send,
      )
      .then((res) => {
        console.log(res.data)
        if (res.status == 200) {
          this.setState({
            isPageLoading: false,
          });
          if (Array.isArray(res.data) && res.data.length != 0) {
            let resData = res.data;
            resData.map((item) => (item.visableOptionMenu = false));
            resData.map((item) => (item.downloadProgress = false));
            resData.map((item) => (item.enterToViewLoading = false));
            // resData.map((item) => (item.downloadProgressRatio = 0));

            this.setState({ My_videos_array: resData, thereIsVideos: true });
          } else {
            this.setState({ My_videos_array: [] });
          }
        } else {
          ToastAndroid.showWithGravityAndOffset(
            'الرجاء المحاولة فى وقت لاحق',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50,
          );
        }
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  insert_one_view = async (item, index) => {
    let videoData = item;

    videoData.which_player = 'player_2';

    let { teacherData } = this.context;
    // console.log(data);
    this.props.navigation.navigate('MySingleVideoDetails', {
      vedio_details: videoData,
      teacherData,
      refrish: this.getAllMyVediosFor,
    });

    // let allData = this.state.My_videos_array;

    // allData[index] = Object.assign(allData[index], {
    //   enterToViewLoading: true,
    // });
    // this.setState({
    //   My_videos_array: allData,
    // });
    // // alert('hi')
    // const data = JSON.parse(await AsyncStorage.getItem('AllData'));
    // let student_token = await AsyncStorage.getItem('fcmToken');

    // let videoData = item;

    // let data_to_send = {
    //   video_id: videoData.video_id,
    //   student_id: data.student_id,
    //   check_update: 'yet',
    //   student_token,
    // };

    // //    alert(JSON.stringify(videoData))
    // axios
    //   .post(AppRequired.Domain + 'home/insert_one_view.php', data_to_send)
    //   .then((res) => {
    //     if (res.status == 200) {
    //       if (res.data == 'success') {
    //         videoData.view_count = (
    //           parseInt(videoData.view_count) + 1
    //         ).toString();
    //         // videoData.which_player = this.state.isSelectedPlayer1
    //         //   ? 'player_1'
    //         //   : 'player_2';
    //         videoData.which_player = 'player_2';
    //         let allVideos = this.state.My_videos_array;

    //         allVideos[this.state.selectVideoIndex] = videoData;
    //         this.setState({videos_array: allVideos});
    //         // console.log(videoData);
    //         let {teacherData} = this.context;
    //         // console.log(data);
    //         this.props.navigation.navigate('MySingleVideoDetails', {
    //           vedio_details: videoData,
    //           teacherData,
    //           refrish: this.getAllMyVediosFor,
    //         });
    //         // console.log(videoData);
    //       } else if (res.data == 'error') {
    //       }
    //     }
    //   })
    //   .finally(() => {
    //     this.setState({
    //       isPageLoading: false,
    //     });
    //     let allData = this.state.My_videos_array;

    //     allData[index] = Object.assign(allData[index], {
    //       enterToViewLoading: false,
    //     });
    //     this.setState({
    //       My_videos_array: allData,
    //     });
    //   });
  };

  _optionMenuControl(index, option) {
    let allData = [...this.state.My_videos_array];
    allData[index] = Object.assign(allData[index], {
      visableOptionMenu: option == 'close' ? false : true,
    });
    this.setState({
      My_videos_array: allData,
    });
  }

  async _downloadPdf(item, index) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        ToastAndroid.showWithGravity(
          '1 item will be downloaded. see notification for details',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        );
        let allData = this.state.My_videos_array;

        allData[index] = Object.assign(allData[index], {
          downloadProgress: true,
        });
        this.setState({
          My_videos_array: allData,
        });
        var file_url = item.attach_pdf;
        const {
          dirs: { DownloadDir, DocumentDir },
        } = RNFetchBlob.fs;
        const { config } = RNFetchBlob;
        const isIos = Platform.OS === 'ios';
        const aPath = Platform.select({ ios: DocumentDir, android: DownloadDir });
        var ext = 'pdf';
        var file_ex = item.video_title;
        const fPath = `${aPath}/${file_ex}`;
        const configOption = Platform.select({
          ios: {
            fileCache: true,
            path: fPath,
            appendExt: ext,
          },
          android: {
            fileCache: false,
            appendExt: ext,
            addAndroidDownloads: {
              useDownloadManager: true,
              notification: true,
              path: aPath + '/' + file_ex,
              description: item.video_title + '.pdf',
            },
          },
        });
        if (isIos) {
          let allData = this.state.My_videos_array;

          allData[index] = Object.assign(allData[index], {
            downloadProgress: true,
          });
          this.setState({
            My_videos_array: allData,
          });
          // this.setState({loading: true, progress: 0});
          RNFetchBlob.config(configOption)
            .fetch('GET', file_url)
            .progress((received, total) => {
              // let allData = this.state.My_videos_array;
              // allData[index] = Object.assign(allData[index], {
              //   downloadProgressRatio: received / total,
              // });
              // this.setState({
              //   My_videos_array: allData,
              // });
            })
            .then((res) => {
              let allData = this.state.My_videos_array;

              allData[index] = Object.assign(allData[index], {
                downloadProgress: false,
              });
              this.setState({
                My_videos_array: allData,
              });

              RNFetchBlob.ios.previewDocument('file://' + res.path());
            });

          return;
        } else {
          config(configOption)
            .fetch('GET', file_url)
            .progress((received, total) => {
              // let allData = this.state.My_videos_array;
              // allData[index] = Object.assign(allData[index], {
              //   downloadProgressRatio: received / total,
              // });
              // this.setState({
              //   My_videos_array: allData,
              // });
            })
            .then((res) => {
              RNFetchBlob.android.actionViewIntent('file://' + res.path());
              let allData = this.state.My_videos_array;

              allData[index] = Object.assign(allData[index], {
                downloadProgress: false,
              });
              this.setState({
                My_videos_array: allData,
              });
            })
            .catch((errorMessage, statusCode) => {
              let allData = this.state.My_videos_array;

              allData[index] = Object.assign(allData[index], {
                downloadProgress: false,
              });
              this.setState({
                My_videos_array: allData,
              });
              console.log('error with downloading file ', errorMessage);
            });
        }
      } else {
        console.log('Permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }
  renderMyVideoDetails = ({ item, index }) => {
    return (
      <>
        <Animatable.View
          animation="fadeInUp"
          key={index}
          delay={index * 100}
          useNativeDriver
          style={{
            width: '90%',
            margin: '5%',
            flexDirection: 'row',
            backgroundColor: '#f7f4f4',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,

            elevation: 5,
            borderRadius: 8,
            marginBottom: 10,
            overflow: 'hidden',
          }}>
          <View style={{ minHeight: 150, width: '40%' }}>
            <Image
              source={images.Vid}
              style={{
                flex: 1,
                width: null,
                height: null,
              }}
            />
          </View>
          <View
            style={{
              flex: 1,
              // padding: 10,
              paddingHorizontal: 10,
              justifyContent: 'space-around',
            }}>
            <Text
              numberOfLines={2}
              style={{ fontFamily: FONTS.fontFamily, fontSize: 20 }}>
              {item.video_title}
            </Text>
            {/* {item.attach_pdf || item.have_question || item.q_a ? (
            <TouchableOpacity
              disabled={item.downloadProgress}
              onPress={() => {
                this._optionMenuControl(index, 'open');
              }}
              style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#fff',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,

                elevation: 5,
                borderRadius: 4,
                padding: 4,
                marginBottom: 10
              }}>
              <Text
                numberOfLines={2}
                style={{ fontFamily: FONTS.fontFamily, fontSize: 15 }}>
                ملحقات الفيديو
              </Text>
              <Menu
                visible={item.visableOptionMenu}
                onDismiss={() => {
                  this._optionMenuControl(index, 'close');
                }}
                anchor={
                  <TouchableOpacity
                    disabled={item.downloadProgress}
                    onPress={() => {
                      this._optionMenuControl(index, 'open');
                    }}>
                    {item.downloadProgress ? (
                      <>
                        <ActivityIndicator color={COLORS.secondary} />
                      </>
                    ) : (
                      <Entypo
                        name="dots-three-horizontal"
                        size={20}
                        // style={{marginRight: 8}}
                        color={'#000'}
                      />
                    )}
                  </TouchableOpacity>
                }>
                {item.attach_pdf ? <Menu.Item
                  onPress={() => {
                    this._optionMenuControl(index, 'close');
                    this.props.navigation.navigate('Viewer', {
                      sum_name: item.video_title,
                      sum_link: item.attach_pdf,
                    });
                  }}
                  icon="file-pdf-box"
                  title="عرض"
                /> : null}
                <Divider />
                {item.q_a ? <Menu.Item
                  onPress={() => {
                    this._optionMenuControl(index, 'close');
                    // console.log(item)
                    this.props.navigation.navigate('VideoQAPage', {
                      q_a: item?.q_a
                    });
                  }}
                  icon="file-question"
                  title="س+ج"
                /> : null}
                <Divider />
                {item.have_question ?
                  <Menu.Item
                    onPress={() => {
                      this._optionMenuControl(index, 'close');
                      // this._downloadPdf(item, index);
                      if (!item.solved) {
                        this.props.navigation.navigate('FullPageExam', {
                          video_id: item.video_id,
                          video_name: item.video_title,
                          refrish: this.getAllMyVediosFor,
                          type: "main"
                        });
                      } else {
                        this.props.navigation.navigate('Seloved_Student_Exam', {
                          video_id: item.video_id,
                          video_name: item.video_title
                        });
                      }
                    }}
                    icon="file-question-outline"
                    title="الاختبار"
                  />
                  : null}
              </Menu>

            </TouchableOpacity>
          ) : null} */}

            <Button
              loading={item.enterToViewLoading}
              color={COLORS.third}
              mode="contained"
              labelStyle={{ fontFamily: FONTS.fontFamily }}
              onPress={() => this.insert_one_view(item, index)}>
              مشاهدة
            </Button>
          </View>
        </Animatable.View>
        {item.attach_pdf ?
          <Animatable.View
            animation="fadeInUp"
            key={index + 1}
            delay={index * 100}
            useNativeDriver
            style={{
              width: '90%',
              margin: '5%',
              flexDirection: 'row',
              backgroundColor: '#f7f4f4',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,

              elevation: 5,
              borderRadius: 8,
              marginBottom: 10,
              overflow: 'hidden',
            }}>
            <View style={{ minHeight: 150, width: '40%' }}>
              <Image
                source={images.summary}
                style={{
                  flex: 1,
                  width: null,
                  height: null,
                }}
              />
            </View>
            <View
              style={{
                flex: 1,
                // padding: 10,
                paddingHorizontal: 10,
                justifyContent: 'space-around',
              }}>
              <Text
                numberOfLines={2}
                style={{ fontFamily: FONTS.fontFamily, fontSize: 20 }}>
                {"الملخص"}
              </Text>


              <Button
                loading={item.enterToViewLoading}
                color={COLORS.third}
                mode="contained"
                labelStyle={{ fontFamily: FONTS.fontFamily }}
                onPress={() => {
                  this.props.navigation.navigate('Viewer', {
                    sum_name: item.video_title,
                    sum_link: item.attach_pdf,
                  });
                }}>
                الملخص
              </Button>
            </View>
          </Animatable.View>
          : null}
        {item.q_a ?
          <Animatable.View
            animation="fadeInUp"
            key={index + 1}
            delay={index * 100}
            useNativeDriver
            style={{
              width: '90%',
              margin: '5%',
              flexDirection: 'row',
              backgroundColor: '#f7f4f4',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,

              elevation: 5,
              borderRadius: 8,
              marginBottom: 10,
              overflow: 'hidden',
            }}>
            <View style={{ minHeight: 150, width: '40%' }}>
              <Image
                source={images.QA}
                style={{
                  flex: 1,
                  width: null,
                  height: null,
                }}
              />
            </View>
            <View
              style={{
                flex: 1,
                // padding: 10,
                paddingHorizontal: 10,
                justifyContent: 'space-around',
              }}>
              <Text
                numberOfLines={2}
                style={{ fontFamily: FONTS.fontFamily, fontSize: 20 }}>
                {"سؤال وجواب"}
              </Text>


              <Button
                loading={item.enterToViewLoading}
                color={COLORS.third}
                mode="contained"
                labelStyle={{ fontFamily: FONTS.fontFamily }}
                onPress={() => {
                  this.props.navigation.navigate('VideoQAPage', {
                    q_a: item?.q_a
                  });
                }}>
                س+ج
              </Button>
            </View>
          </Animatable.View>
          : null}
        {item.have_question ?
          <Animatable.View
            animation="fadeInUp"
            key={index + 2}
            delay={index * 100}
            useNativeDriver
            style={{
              width: '90%',
              margin: '5%',
              flexDirection: 'row',
              backgroundColor: '#f7f4f4',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,

              elevation: 5,
              borderRadius: 8,
              marginBottom: 10,
              overflow: 'hidden',
            }}>
            <View style={{ minHeight: 150, width: '40%' }}>
              <Image
                source={images.Exam}
                style={{
                  flex: 1,
                  width: null,
                  height: null,
                }}
              />
            </View>
            <View
              style={{
                flex: 1,
                // padding: 10,
                paddingHorizontal: 10,
                justifyContent: 'space-around',
              }}>
              <Text
                numberOfLines={2}
                style={{ fontFamily: FONTS.fontFamily, fontSize: 20 }}>
                {"الاختبار"}
              </Text>


              <Button
                loading={item.enterToViewLoading}
                color={COLORS.third}
                mode="contained"
                labelStyle={{ fontFamily: FONTS.fontFamily }}
                onPress={() => {
                  if (!item.solved) {
                    this.props.navigation.navigate('FullPageExam', {
                      video_id: item.video_id,
                      video_name: item.video_title,
                      refrish: this.getAllMyVediosFor,
                      type: "main"
                    });
                  } else {
                    this.props.navigation.navigate('Seloved_Student_Exam', {
                      video_id: item.video_id,
                      video_name: item.video_title
                    });
                  }
                }}>
                الاختبار
              </Button>
            </View>
          </Animatable.View>
          :
          null}
        <Animatable.View
          animation="fadeInUp"
          key={index + 2}
          delay={index * 100}
          useNativeDriver
          style={{
            width: '90%',
            margin: '5%',
            flexDirection: 'row',
            backgroundColor: '#f7f4f4',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,

            elevation: 5,
            borderRadius: 8,
            marginBottom: 10,
            overflow: 'hidden',
          }}>
          <View style={{ minHeight: 150, width: '40%' }}>
            <Image
              source={images.Exam}
              style={{
                flex: 1,
                width: null,
                height: null,
              }}
            />
          </View>
          <View
            style={{
              flex: 1,
              // padding: 10,
              paddingHorizontal: 10,
              justifyContent: 'space-around',
            }}>
            <Text
              numberOfLines={2}
              style={{ fontFamily: FONTS.fontFamily, fontSize: 20 }}>
              {"الاستفسارات"}
            </Text>


            <Button
              loading={item.enterToViewLoading}
              color={COLORS.third}
              mode="contained"
              labelStyle={{ fontFamily: FONTS.fontFamily }}
              onPress={() => {
                this.props.navigation.navigate('VideoComment', {
                  type: "video",
                  video_id: item.video_id
                });
              }}>
              الاستفسارات
            </Button>
          </View>
        </Animatable.View>
      </>

    );
  };

  render() {
    return (
      <Provider>
        <Portal>
          <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <StatusBar backgroundColor={COLORS.primary} translucent={false} />

            <View
              style={{
                width: '100%',
                height: height * 0.1,
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
                    this.props.navigation.goBack();
                  }}>
                  <FontAwesome5
                    name="arrow-right"
                    style={{ fontSize: 24, color: '#fff', marginLeft: 10 }}
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
                  {this.state?.lec_data?.lec_title}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}></View>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.isPageLoading}
                  onRefresh={this.componentDidMount.bind(this)}
                  colors={[COLORS.primary, COLORS.primary]}
                />
              }>
              <View style={{ flex: 1 }}>
                {this.state.isPageLoading ? null : this.state.thereIsVideos ? (
                  <>
                    <FlatList
                      data={this.state.My_videos_array}
                      keyExtractor={(item) => item.video_id}
                      contentContainerStyle={{ paddingTop: 7 }}
                      renderItem={this.renderMyVideoDetails}
                    // inverted
                    />
                  </>
                ) : (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '90%',
                      margin: '5%',
                    }}>
                    <Image
                      source={images.emptyData}
                      style={{ width: 200, height: 250 }}
                    />
                    <Text style={{ fontFamily: FONTS.fontFamily, fontSize: 20 }}>
                      لا توجد فيديوهات حتى الأن
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </Portal>
      </Provider>
    );
  }
}














