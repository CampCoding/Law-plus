import * as React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  BackHandler,
  Modal,
  ActivityIndicator,
  ToastAndroid,
  AppState,
  Platform,
  Alert,
} from 'react-native';
import { Container } from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
// import {WebView} from 'react-native-webview';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-community/async-storage';
import Video from 'react-native-af-video-player-updated';
import NetInfo from '@react-native-community/netinfo';
import AudioJackManager from 'react-native-audio-jack';

import { StatusBar } from 'react-native';
import Orientation from 'react-native-orientation';



import { AppRequired, COLORS, FONTS, SIZES } from '../../constants';

export default class MySingleVideoDetails extends React.Component {

  webviewRef;
  onShouldStartLoadWithRequest = (event) => {
    // Check if navigating forward
    if (event.navigationType === 'click' && event.url !== event.mainDocumentURL) {
      // Pause the video when navigating forward
      const script = 'if (document.querySelector("video")) { document.querySelector("video").pause(); }';
      this.webViewRef.current.injectJavaScript(script);
      return false; // Prevent WebView from navigating
    }
    return true; // Allow the navigation
  };
  constructor(props) {
    super(props);
    this.webviewRef = React.createRef();
    this.state = {
      previewVideoModal: false,
      videoDetails: this.props.navigation.getParam('vedio_details'),
      LogoutModal: false,
      isPortrait: true,
      videoUrl: '',
      which_player: this.props.navigation.getParam('vedio_details')
        .which_player,
      connection_Status: true,
      reload: false,
      finishLoadingWebview: false,
      finishLoad: false,
      isRefresh: false,
      canSeePage: true,
      appState: AppState.currentState,
      moveingIdUp: 0,
      moveingIdLeft: 0,
      student_id: '',
      student_name: '',
      enableJack: false,
      additionalViewHide: true,
      isWebViewPaused: false,
    };
  }

  async componentWillUnmount() {
    // console.log("hhh")

    Orientation.lockToPortrait();
    this.backHandler.remove();
    let refrish = this.props.navigation.getParam('refrish');
    refrish();

    // AppState.removeEventListener('change', this._handleAppStateChange);
  }



  async componentDidMount() {

    Orientation.lockToLandscape();
    const data = JSON.parse(await AsyncStorage.getItem('AllData'));
    this.setState({
      student_id: data.student_id,
      student_name: data.student_name,
    });

    if (this.props.navigation.getParam('vedio_details').jack == '1') {
      AudioJackManager.isPluggedIn().then((isPluggedIn) => {
        if (isPluggedIn == true) {
          this.setState({
            enableJack: true,
          });
        } else {
          this.setState({
            enableJack: false,
          });
        }
      });
      const audioJackListener = AudioJackManager.addListener(
        ({ isPluggedIn }) => {
          if (isPluggedIn == true) {
            this.setState({
              enableJack: true,
            });
          } else {
            this.setState({
              enableJack: false,
            });
          }
        },
      );
    } else {
      this.setState({
        enableJack: true,
      });
    }



    // AppState.addEventListener('change', this._handleAppStateChange);
    // Dimensions.addEventListener('change', (event) => {
    //   const {width, height} = event.window;
    //   console.log(width);
    // });

    // console.log(this.props.navigation.getParam('vedio_details'));
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      // console.log(state.isInternetReachable);
      if (state.isInternetReachable) {
        if (this.state.finishLoad) {
          this.setState({
            finishLoadingWebview: true,
            isRefresh: true,
          });
        }
      }

      this.setState({
        connection_Status: state.isInternetReachable,
        canSeePage: state.isInternetReachable,
      });
    });
    if (
      this.state.which_player == 'player_1' &&
      this.state.videoDetails.video_link.includes('update_app.mp4')
    ) {
      this.get_url();
    }

    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );

    setInterval(() => {
      // if (SIZES.width > SIZES.height) {
      let translateY = Math.floor(
        Math.random() * (SIZES.height - 40 - 0 + 1) + 0,
      );

      let translatex = Math.floor(
        Math.random() * (SIZES.width - 160 - 0 + 1) + 0,
      );
      this.setState({
        moveingIdUp: translatex,
        moveingIdLeft: translateY,
      });
      // } else {
      //   let translateY = Math.floor(
      //     Math.random() * (SIZES.height - 40 - 0 + 1) + 0,
      //   );

      //   let translatex = Math.floor(
      //     Math.random() * (SIZES.width - 160 - 0 + 1) + 0,
      //   );
      //   this.setState({
      //     moveingIdUp: translateY,
      //     moveingIdLeft: translatex,
      //   });
      // }
    }, 5000);
  }



  // _handleAppStateChange = (nextAppState) => {
  //   if (this.state.appState.match(/inactive|background/)) {
  //     // console.log('App has come to the foreground!');
  //   }
  //   this.setState({appState: nextAppState});
  // };
  onBeforeContentLoaded = () => {
    if (this.webviewRef && this.webviewRef.current) {
      const injectedJS = `
        setInterval(function() {
          var video = document.querySelector("video");
          if (video && !video.paused) {
            window.ReactNativeWebView.postMessage('videoPlaying');
          }
        }, 1000);
      `;
      this.webviewRef.injectJavaScript(injectedJS);
    }
  };

  onWebViewMessage = (event) => {
    const data = event.nativeEvent.data;

    if (data === 'videoPlaying') {
      if (this.webviewRef && this.webviewRef.current) {
        const injectedJS = 'document.querySelector("video").pause();';
        this.webviewRef.injectJavaScript(injectedJS);
      }
    }
  };

  onPause = () => {
    if (this.webviewRef) {
      const injectedJS = 'document.querySelector("video").pause();';
      this.webviewRef.injectJavaScript(injectedJS);
    }
  };

  reload() {
    if (
      this.state.which_player == 'player_1' &&
      this.state.videoDetails.video_link.includes('update_app.mp4')
    ) {
      this.get_url();
    }
    if (this.state.connection_Status) {
    } else {
      setTimeout(() => {
        this.setState({
          reload: false,
        });
      }, 700);
    }
  }
  get_url() {
    const VIMEO_ID = this.state.videoDetails.video_player_id;
    fetch(`https://player.vimeo.com/video/${VIMEO_ID}/config`)
      .then((res) => res.json())
      .then((res) =>
        this.setState({
          videoUrl:
            res.request.files.hls.cdns[res.request.files.hls.default_cdn].url,
        }),
      );
  }

  backAction = () => {
    this.setState({ LogoutModal: true });

    return true;
  };

  // _orientationDidChange = (orientation) => {
  //   alert(orientation);
  //   if (orientation === 'LANDSCAPE') {
  //     // do something with landscape layout
  //   } else {
  //     // do something with portrait layout
  //   }
  // };

  // getdata() {
  //   let session_data = this.props.navigation.getParam('session_data');
  //   let session_titel = this.props.navigation.getParam('titel_of_session');

  //   // alert(JSON.stringify(session_titel))
  //   this.setState({titel_vedios: session_titel, data: session_data});
  // }

  render() {
    // if(
    //   this.props.navigation.getParam('vedio_details').which_player=="player_2"
    // )
    // video_pass

    let encTab = [
      '1',
      'l',
      '4',
      'e',
      'm',
      '5',
      'f',
      'k',
      'q',
      '8',
      'd',
      'h',
      '3',
      'n',
      '9',
      '7',
      'j',
      'a',
      'o',
      'c',
      '6',
      'p',
      'b',
      'g',
      'i',
      '2',
    ];
    // const videoPassword = this.props.navigation.getParam('vedio_details')
    //   .video_pass;
    let description = this.props.navigation.getParam('teacherData')
      .subject_description;

    let paIndex = description.indexOf('tincidunt');
    let indexSpace = description.indexOf(' ', paIndex);
    let endSpace = description.indexOf(' ', indexSpace + 1);
    let finalWord = description.substring(indexSpace + 1, endSpace);
    // alert(finalWord);

    let encLet = '';
    for (let i = 0; i < finalWord.length; i++) {
      // let letter =String.fromCharCode(i).toLowerCase()
      // console.log(description.charCodeAt(i) - );
      encLet += encTab[finalWord.charCodeAt(i) - 97];
      // let currentLet = description.charCodeAt(i);
      // finalWord.replace(/letter/g);
    }
    // console.log(encLet);
    const jscode = `
    if (document.getElementsByClassName('js-password') == null) {
        // field not existing, deal with the error
      } else {
        document.getElementsByClassName('js-password')[0].value = '${encLet}';
        document.querySelector("input[type='submit']").click();
      };
  `;

    const { navigation } = this.props;

    return (
      <>
        <Container style={{ backgroundColor: '#fff' }}>
          <StatusBar backgroundColor="#000" />

          {!this.state.videoDetails.video_link.includes('update_app.mp4') ? (
            this.state.canSeePage ? (
              this.state.enableJack ? (
                <Video
                  url={this.state.videoDetails.video_link}
                  lockRatio={16 / 9}
                  rotateToFullScreen={true}
                  lockPortraitOnFsExit={true}
                  // hideFull
                  scrollBounce={true}
                // lockPortraitOnFsExit={true}
                />
              ) : (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: FONTS.fontFamily,
                      fontSize: 20,
                      paddingTop: '10%',
                    }}>
                    الرجاء التأكد من تركيب سماعات الاذن
                  </Text>
                </View>
              )
            ) : (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: FONTS.fontFamily,
                    fontSize: 20,
                    paddingTop: '10%',
                  }}>
                  الرجاء التأكد من اتصالك بالانترنت
                </Text>
              </View>
            )
          ) : this.state.which_player == 'player_1' ? (
            this.state.canSeePage ? (
              this.state.enableJack ? (
                <Video
                  url={this.state.videoUrl}
                  lockRatio={16 / 9}
                  rotateToFullScreen={true}
                  lockPortraitOnFsExit={true}
                  // hideFull
                  scrollBounce={true}
                // lockPortraitOnFsExit={true}
                />
              ) : (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: FONTS.fontFamily,
                      fontSize: 20,
                      paddingTop: '10%',
                    }}>
                    الرجاء التأكد من تركيب سماعات الاذن
                  </Text>
                </View>
              )
            ) : (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: FONTS.fontFamily,
                    fontSize: 20,
                    paddingTop: '10%',
                  }}>
                  الرجاء التأكد من اتصالك بالانترنت
                </Text>
              </View>
            )
          ) : (
            <>
              {this.state.canSeePage ? (
                this.state.enableJack ? (
                  <>
                    <View
                      style={{
                        position: 'absolute',
                        top: this.state.moveingIdUp,
                        left: this.state.moveingIdLeft,
                        // width: 160,
                        // height: 40,
                        paddingHorizontal: 10,
                        // paddingVertical: 2,

                        backgroundColor: 'rgba(0,0,0,0.3)',
                        borderRadius: 8,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{ color: '#fff', fontFamily: FONTS.fontFamily }}>
                        {this.state.student_name} : {this.state.student_id}
                      </Text>
                    </View>
                    <WebView
                      ref={(ref) => (this.webviewRef = ref)}
                      onNavigationStateChange={(navState) => {
                        // Alert.alert(JSON.stringify(navState))
                        if (navState.canGoForward && isWebViewPaused) {
                          // Resume the video (if needed)
                          // You may add additional conditions to determine when to resume the video
                          // For example, check if the user is navigating to a specific page
                          const script = 'document.querySelector("video").play();';
                          this.webViewRef.injectJavaScript(script);
                          // setWebViewPaused(false);
                        }
                      }}
                      // onNavigationStateChange={this.handleNavigationStateChange}
                      // onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
                      style={{
                        width: '100%',
                        height: '100%',
                        // top: "-36%",
                        // backgroundColor:"red"
                      }}

                      onLoad={() => {
                        let inject2 = `
    function hideGrandparentElementByText(text) {
        let allElements = document.querySelectorAll('*');
      
        allElements.forEach(element => {
          if (element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE && element.textContent.includes(text)) {
            let grandparent = element.parentNode.parentNode;
            grandparent.style.display = 'none';
          }
        });
               let element = document.querySelector("#player > div.vp-player-ui-overlays > div.ControlBar_module_controlBarWrapper__ea0d6863 > div.vp-controls.ControlBar_module_controls__ea0d6863 > div > button.Button_module_button__6c261677.shared_module_focusable__63d26f6d.Button_module_customColor__6c261677.Button_module_xs__6c261677.Button_module_icon__6c261677.Tooltip_module_tooltipContainer__21ae5b80.exclude-global-button-styles.ControlBarButton_module_controlBarButton__88a67ab4.shared_module_focusable__63d26f6d.fullscreen.FullscreenButton_module_fullscreen__e0e92a4f")
      if(element){
      element.style.display = "none"}
      }
      
      setInterval(() => {
        hideGrandparentElementByText('Debug');
      },100)`
                        this.webviewRef.injectJavaScript(inject2)
                        console.log(this.webviewRef)
                        this.setState({
                          finishLoad: true,
                        });
                        if (this.state.connection_Status) {

                          this.setState({
                            finishLoadingWebview: true,
                            canSeePage: true,
                          });
                        } else {
                          ToastAndroid.showWithGravityAndOffset(
                            'الرجاء التأكد من اتصال الانترنت',
                            ToastAndroid.LONG,
                            ToastAndroid.BOTTOM,
                            25,
                            50,
                          );
                        }
                      }}
                      source={{
                        uri: `https://player.vimeo.com/video/${this.state.videoDetails.video_player_id}`,
                      }}
                      onTouchStart={() => {
                        this.setState({ additionalViewHide: true })
                        setTimeout(() => { this.setState({ additionalViewHide: false }) }, 10000);
                      }}
                      injectedJavaScript={jscode}
                      javaScriptEnabled={true}
                      injectedJavaScriptBeforeContentLoaded={'true'}
                      onMessage={this.onWebViewMessage}




                    />

                    <TouchableOpacity
                      onPress={() => {
                        // console.log(this.state.videoDetails)
                        this.onPause()
                        this.backHandler.remove();
                        Orientation.lockToPortrait()
                        this.props.navigation.navigate('VideoComment', {
                          type: "video",
                          video_id: this.state.videoDetails.video_id
                        });
                      }}
                      style={{
                        // position:"absolute"
                        paddingHorizontal: 25,
                        backgroundColor: COLORS.third,
                        paddingVertical: 12, borderRadius: 25,
                        marginRight: 5,
                        // width: "15%",
                        // flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        position: "absolute",
                        top: 5,
                        left: 5

                      }}>
                      <Text
                        style={{
                          color: "#ffffff"
                        }}
                      >
                        Comments
                      </Text>

                    </TouchableOpacity>

                    {/* {this.state.additionalViewHide &&
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          position: "absolute",
                          top: 5,
                          left: 5
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {

                            this.onPause()
                            this.backHandler.remove();
                            Orientation.lockToPortrait()
                            this.props.navigation.navigate('Viewer', {
                              sum_name: this.state.videoDetails.video_title,
                              sum_link: this.state.videoDetails.attach_pdf,
                              type: "video"
                            });
                          }}
                          style={{
                            // position:"absolute"
                            paddingHorizontal: 25,
                            backgroundColor: COLORS.third,
                            paddingVertical: 12, borderRadius: 25,
                            marginRight: 5

                          }}>
                          <Text
                            style={{
                              color: "#ffffff"
                            }}
                          >Sheet</Text>

                        </TouchableOpacity>
                        {this.state.videoDetails.have_question ?
                          <TouchableOpacity
                            onPress={() => {
                              this.onPause()
                              this.backHandler.remove();
                              Orientation.lockToPortrait()
                              if (!this.state.videoDetails.solved) {
                                this.props.navigation.navigate('FullPageExam', {
                                  video_id: this.state.videoDetails.video_id,
                                  video_name: this.state.videoDetails.video_title,
                                  type: "video"
                                });
                              } else {
                                this.props.navigation.navigate('Seloved_Student_Exam', {
                                  video_id: this.state.videoDetails.video_id,
                                  video_name: this.state.videoDetails.video_title,
                                  type: "video"
                                });
                              }
                            }}
                            style={{
                              // position:"absolute"
                              paddingHorizontal: 25,
                              backgroundColor: COLORS.third,
                              paddingVertical: 12, borderRadius: 25,
                              marginRight: 5

                            }}>
                            <Text
                              style={{
                                color: "#ffffff"
                              }}
                            >Quizes</Text>

                          </TouchableOpacity>
                          : null}

                        <TouchableOpacity
                          onPress={() => {
                            // console.log(this.state.videoDetails)
                            this.onPause()
                            this.backHandler.remove();
                            Orientation.lockToPortrait()
                            this.props.navigation.navigate('VideoComment', {
                              type: "video",
                              video_id: this.state.videoDetails.video_id
                            });
                          }}
                          style={{
                            // position:"absolute"
                            paddingHorizontal: 25,
                            backgroundColor: COLORS.third,
                            paddingVertical: 12, borderRadius: 25,
                            marginRight: 5

                          }}>
                          <Text
                            style={{
                              color: "#ffffff"
                            }}
                          >
                            Comments
                          </Text>

                        </TouchableOpacity>

                      </View>
                    } */}

                    {/* <View
                      style={{
                        position: 'absolute',
                        width: "95%",
                        // height:60,
                        paddingVertical: 10,
                        backgroundColor: COLORS.lightGray,
                        alignSelf: "center",
                        bottom: "53%",
                        alignItems: "center",
                        borderRadius: 20,
                        flexDirection: "row",
                        justifyContent: "space-around"
                      }}>
                      <TouchableOpacity
                      onPress={()=>{
                        this.props.navigation.navigate('Viewer', {
                          sum_name: this.state.videoDetails.video_title,
                          sum_link: this.state.videoDetails.attach_pdf,
                        });
                      }}
                       style={{
                        alignItems:"center"
                      }}>
                        <View style={{
                          width: 60,
                          height: 60,
                          borderRadius: 30,
                          // backgroundColor: COLORS.gray,
                          alignItems: "center",
                          justifyContent: "center"
                        }}>
                          <AntDesign name='pdffile1' size={25} />

                        </View>
                        <Text
                          style={{
                            ...FONTS.body3,
                            // marginTop: 5
                          }}
                        >
                       Summaries
                        </Text>
                      </TouchableOpacity>
                      {this.state.videoDetails.have_question?
                      <TouchableOpacity
                      onPress={()=>{
                        if (!this.state.videoDetails.solved) {
                          this.props.navigation.navigate('FullPageExam', {
                            video_id: this.state.videoDetails.video_id,
                            video_name: this.state.videoDetails.video_title
                          });
                        } else {
                          this.props.navigation.navigate('Seloved_Student_Exam', {
                            video_id: this.state.videoDetails.video_id,
                            video_name: this.state.videoDetails.video_title
                          });
                        }
                      }} style={{
                        alignItems:"center"
                      }}>
                        <View style={{
                          width: 60,
                          height: 60,
                          borderRadius: 30,
                          // backgroundColor: COLORS.gray,
                          alignItems: "center",
                          justifyContent: "center"
                        }}>
                          <AntDesign name='questioncircleo' size={25} />

                        </View>
                        <Text
                          style={{
                            ...FONTS.body3,
                            // marginTop: 10
                          }}
                        >
                          Quizes
                        </Text>
                      </TouchableOpacity>
                      :null}
                      <TouchableOpacity
                      onPress={()=>{
                        this.props.navigation.navigate('VideoComment');
                      }} style={{
                        alignItems:"center"
                      }}>
                        <View style={{
                          width: 60,
                          height: 60,
                          borderRadius: 30,
                          // backgroundColor: COLORS.gray,
                          alignItems: "center",
                          justifyContent: "center"
                        }}>
                          <Fontisto name='comment' size={25} />

                        </View>
                        <Text
                          style={{
                            ...FONTS.body3,
                            // marginTop: 10
                          }}
                        >
                          Comments
                        </Text>
                      </TouchableOpacity>

                    </View> */}

                  </>
                ) : (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontFamily: FONTS.fontFamily,
                        fontSize: 20,
                        paddingTop: '10%',
                      }}>
                      الرجاء التأكد من تركيب سماعات الاذن
                    </Text>
                  </View>
                )
              ) : (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: FONTS.fontFamily,
                      fontSize: 20,
                      paddingTop: '10%',
                    }}>
                    الرجاء التأكد من اتصالك بالانترنت
                  </Text>
                </View>
              )}
              {this.state.enableJack ? (
                this.state.canSeePage == false ? null : !this.state
                  .finishLoadingWebview ? (
                  <View
                    style={{
                      flex: 1,
                      position: 'absolute',
                      position: 'absolute',
                      width: '100%',
                      height: 300,
                      backgroundColor: '#fff',
                      left: 0,
                      right: 0,
                      top: 0,
                      // bottom: 0,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <ActivityIndicator size={50} color="#000" />
                  </View>
                ) : null
              ) : (
                <></>
              )}
            </>
          )}

          {/* {this.state.which_player == 'player_1' ? (
            <ScrollView>
              <View style={{width: '90%'}}>
                <Text
                  style={{
                    fontSize: 22,
                    fontFamily: FONTS.fontFamily,
                  }}>
                  {this.state.videoDetails.video_title}
                </Text>
              </View>

              <View style={{width: '90%', margin: '5%', marginTop: -10}}>
                <Text
                  style={{
                    textAlign: 'justify',
                    fontFamily: FONTS.fontFamily,
                  }}>
                  {this.state.videoDetails.video_description}
                </Text>
              </View>
            </ScrollView>
          ) : this.state.which_player == 'player_2' ? (
            <ScrollView>
              <View style={{width: '90%', margin: '5%'}}>
                <Text
                  style={{
                    fontSize: 22,
                    fontFamily: FONTS.fontFamily,
                  }}>
                  {this.state.videoDetails.video_title}
                </Text>
              </View>

              <View style={{width: '90%', margin: '5%', marginTop: -10}}>
                <Text
                  style={{
                    textAlign: 'justify',
                    fontFamily: FONTS.fontFamily,
                  }}>
                  {this.state.videoDetails.video_description}
                </Text>
              </View>
            </ScrollView>
          ) : null} */}
          <View
            style={{
              position: 'absolute',
              top: this.state.moveingIdUp,
              left: this.state.moveingIdLeft,
              // width: 160,
              // height: 40,
              paddingHorizontal: 10,
              // paddingVertical: 2,

              backgroundColor: 'rgba(0,0,0,0.3)',
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{ color: '#fff', fontFamily: FONTS.fontFamily }}>
              {this.state.student_name} : {this.state.student_id}
            </Text>
          </View>

          <Modal
            visible={this.state.LogoutModal}
            onRequestClose={() => {
              this.setState({ LogoutModal: false });
            }}
            transparent={true}>
            <View
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <View
                style={{
                  width: '90%',
                  padding: 10,
                  backgroundColor: '#fff',
                  elevation: 22,
                  borderRadius: 15,
                }}>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 10,
                  }}>
                  <Text
                    style={{
                      fontFamily: FONTS.fontFamily,
                      color: COLORS.primary,
                      fontSize: 22,
                    }}>
                    {AppRequired.appName}
                  </Text>
                </View>
                <View
                  style={{
                    alignSelf: 'center',
                    width: '90%',
                    borderWidth: 1.5,
                    borderColor: '#ddd',
                  }}
                />

                <View style={{ paddingHorizontal: 20, paddingVertical: 12 }}>
                  <Text
                    style={{
                      fontFamily: FONTS.fontFamily,
                      color: COLORS.primary,
                      fontSize: 17,
                      textAlign: 'center',
                    }}>
                    هل تريد الخروج من الفيديو ؟
                  </Text>
                </View>

                <View
                  style={{
                    alignSelf: 'center',
                    width: '90%',
                    borderWidth: 1.5,
                    borderColor: '#ddd',
                  }}
                />

                <View
                  style={{
                    marginTop: 7,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  }}>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRightWidth: 1,
                      borderRightColor: '#ddd',
                    }}
                    onPress={() => {
                      this.setState({ LogoutModal: false });
                      this.props.navigation.goBack();
                    }}>
                    <Text
                      style={{
                        fontFamily: FONTS.fontFamily,
                        color: COLORS.primary,
                        fontSize: 20,
                      }}>
                      نعم
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderLeftWidth: 1,
                      borderLeftColor: '#ddd',
                    }}
                    onPress={() => {
                      this.setState({ LogoutModal: false });
                    }}>
                    <Text
                      style={{
                        fontFamily: FONTS.fontFamily,
                        color: COLORS.primary,
                        fontSize: 20,
                      }}>
                      إلغاء
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </Container>
      </>
    );
  }
}
