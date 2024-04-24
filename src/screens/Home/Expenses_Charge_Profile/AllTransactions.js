import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    FlatList,
    I18nManager,
    ToastAndroid,
    Modal,
    TouchableWithoutFeedback,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LottieView from 'lottie-react-native';
import NetInfo from '@react-native-community/netinfo';

// import { TextButton } from '../../components';
// import { UserContext } from '../Contexts/UserContext';
import { COLORS, AppRequired, FONTS, lottie, SIZES } from '../../../constants';
import axios from 'axios';
import { RFValue } from 'react-native-responsive-fontsize';
import { TextButton } from '../../../components';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
moment.locale("ar-sa")
const AllTransactions = ({ navigation }) => {
    const [pageLoading, setPageLoading] = React.useState(true);
    const [networkConnection, setNewtworkConnection] = React.useState(true);
    const [allData, setAllData] = React.useState([]);
    const [visableTransResModal, setVisableTransResModal] = React.useState(false);
    const [selectedTrans, setSelectedTrans] = React.useState({});
    const [renderedData, setRenderedData] = React.useState([]);
    const [selectedCategory, setSelectedCategory] = React.useState(1);
    const [categorys, setCategorys] = React.useState([
        {
            id: 1,
            label: "الكل",
        },
        {
            id: 2,
            label: ('شحن'),
            service_name: 'شحن',
        },
        {
            id: 3,
            label: ('مشتريات'),
            service_name: 'مشتريات',
        },
        {
            id: 4,
            label: ('كاش باك'),
            service_name: 'كاش باك',
        }
    ]);


    React.useEffect(() => {
        moment.locale("ar-sa")
        // moment(new Date()).locale('ar-eg').format("lll");
        const unsubscribe = NetInfo.addEventListener(state => {
            setNewtworkConnection(state.isInternetReachable);
        });
        req_getAllTransactions();
    }, []);
    async function req_getAllTransactions() {
        if (networkConnection) {
            // console.log(user_data);
            let StudentData = JSON.parse(await AsyncStorage.getItem('AllData'));
            let student_token = await AsyncStorage.getItem('fcmToken')
            let data_to_send = {
                init_record_no: 0,
                student_id: StudentData.student_id,
                student_token: student_token
            };
            console.log(data_to_send)

            axios
                .post(
                    AppRequired.Domain + 'home/select_all_transactions.php',
                    data_to_send,
                )
                .then(res => {
                    console.log(res.data);
                    if (Array.isArray(res.data)) {
                        setAllData(res.data);

                        handleChangeCategory(selectedCategory, res.data);
                    } else {
                        ToastAndroid.showWithGravityAndOffset(

                            'عفوا حدث خطا ما الرجاء المحاولة لاحقا'
                            ,
                            ToastAndroid.LONG,
                            ToastAndroid.BOTTOM,
                            25,
                            50,
                        );
                    }
                })
                .finally(() => {
                    setPageLoading(false);
                });
        } else {
            ToastAndroid.showWithGravityAndOffset(

                'الرجاء التأكد من اتصال الانترنت'
                ,
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
                25,
                50,
            );
        }
    }

    function renderHeader() {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: COLORS.secondary,
                    padding: SIZES.padding,
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,

                    elevation: 5,
                    paddingVertical: RFValue(20)
                }}>
                <TouchableOpacity
                    style={{
                        width: 40,
                    }}
                    onPress={() => navigation.goBack()}>
                    <FontAwesome5
                        name={'arrow-right'}
                        size={20}
                        color={"#fff"}
                    />
                </TouchableOpacity>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ ...FONTS.h2, fontWeight: "bold", color: "#fff" }}>كشف حسابي</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>
        );
    }
    function renderCategorys() {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    padding: SIZES.base,
                }}>
                {categorys.map((item, index) => {
                    return (
                        <TextButton
                            key={`Categorys-${index}`}
                            label={item.label}
                            labelStyle={{
                                color: item.id == selectedCategory ? COLORS.black : 'darkgray',
                                ...FONTS.body3,
                            }}
                            buttonContainerStyle={{
                                height: 40,
                                margin: 5,
                                paddingHorizontal: SIZES.base,
                                alignItems: 'center',
                                borderRadius: SIZES.base,
                                backgroundColor:
                                    item.id == selectedCategory
                                        ? "#fac800"
                                        : COLORS.lightGray,
                            }}
                            onPress={() => {
                                handleChangeCategory(item.id);
                                setSelectedCategory(item.id);
                            }}
                        />
                    );
                })}
            </View>
        );
    }

    function handleChangeCategory(selectedCategory, data) {
        if (data) {
            if (selectedCategory == 1) {
                setRenderedData(data);
            } else {
                let slectedCategoryIndex = categorys.find(
                    a => a.id == selectedCategory,
                );
                let selectedData = data.filter(
                    a =>
                        a.category ==
                        slectedCategoryIndex.service_name,
                );
                setRenderedData(selectedData);
            }
        } else {
            if (selectedCategory == 1) {
                setRenderedData(allData);
            } else {
                let slectedCategoryIndex = categorys.find(
                    a => a.id == selectedCategory,
                );
                let selectedData = allData.filter(
                    a =>
                        a.category ==
                        slectedCategoryIndex.service_name,
                );
                setRenderedData(selectedData);
            }
        }
    }

    function renderBody() {
        return (
            <View
                style={{
                    flex: 1,
                    padding: SIZES.base,
                }}>
                {networkConnection == false && renderedData.length == 0 ? (
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                        <Text
                            style={{
                                fontWeight: 'bold',
                                fontSize: 18,
                                fontFamily: FONTS.fontFamily,
                            }}>
                            {
                                'الرجاء التأكد من اتصالك بالانترنت'
                            }
                        </Text>
                    </View>
                ) : pageLoading == true && renderedData.length == 0 ? (
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                        <LottieView
                            source={lottie.wallet_load}
                            autoPlay
                            loop
                            style={{ height: 300, width: '100%' }}
                            resizeMode="contain"
                        />
                    </View>
                ) : (
                    <FlatList
                        data={renderedData}
                        keyExtractor={(_, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={() => {
                            return (
                                <View
                                    style={{
                                        flex: 1,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        paddingTop: '10%',
                                    }}>
                                    <LottieView
                                        source={lottie.noData}
                                        autoPlay
                                        loop
                                        style={{ height: 300, width: '100%' }}
                                        resizeMode="contain"
                                    />
                                    <Text
                                        style={{
                                            color: COLORS.darkgray,
                                            fontFamily: FONTS.fontFamily,
                                        }}>
                                        {'لا توجد تحويلات'}
                                    </Text>
                                </View>
                            );
                        }}
                        renderItem={({ item, index }) => {
                            return (
                                <>
                                    <TouchableOpacity
                                        // disabled={!item.note}
                                        onPress={() => {
                                            setVisableTransResModal(true);
                                            setSelectedTrans(item);
                                        }}
                                        style={{
                                            backgroundColor: "#FBFBFB",
                                            marginVertical: 15,
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: SIZES.base,
                                            paddingTop: SIZES.padding + 10,
                                            width: '100%',
                                            shadowColor: '#000',
                                            shadowOffset: {
                                                width: 0,
                                                height: 1,
                                            },
                                            shadowOpacity: 0.2,
                                            shadowRadius: 1.41,

                                            elevation: 2,
                                        }}>
                                        {/* Service name & history*/}
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                width: '100%',
                                                justifyContent: 'space-between',
                                            }}>
                                            <View>
                                                <Text
                                                    style={{
                                                        ...FONTS.h3,
                                                        fontWeight: 'bold',
                                                        marginTop: 10
                                                    }}>

                                                    {item.category}
                                                </Text>
                                                {/* <Text
                                                    style={{
                                                        color: '#ccc',
                                                        fontSize: 14,
                                                        fontFamily: FONTS.fontFamily,
                                                    }}>
                                                    {item.description}
                                                </Text> */}
                                            </View>
                                            {/* Service amount & status*/}
                                            <View
                                                style={{
                                                    alignItems: 'flex-end',
                                                    // justifyContent: 'flex-start',
                                                }}>
                                                {/* amount */}
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        backgroundColor:
                                                            item.transaction_status == "charging"
                                                                ? COLORS.transparentGreen
                                                                : COLORS.transparentRed,
                                                        borderRadius: 3,
                                                    }}>
                                                    <MaterialIcons
                                                        name={
                                                            item.transaction_status == "charging"
                                                                ? 'arrow-drop-up'
                                                                : 'arrow-drop-down'
                                                        }
                                                        color={
                                                            item.transaction_status == "charging"
                                                                ? COLORS.green
                                                                : COLORS.red
                                                        }
                                                        size={30}
                                                    />
                                                    <Text
                                                        style={{
                                                            color: "#078999",
                                                            fontWeight: 'bold',
                                                            fontSize: 16,
                                                            fontFamily: FONTS.fontFamily,
                                                            marginRight: 9,
                                                        }}>
                                                        {item.transaction_status == "charging"
                                                            ? '+' + item.price
                                                            : "-" + item.price}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                width: '100%',
                                                justifyContent: 'space-between',
                                            }}>
                                            {/* status */}

                                            <Text
                                                style={{
                                                    fontFamily: FONTS.fontFamily,
                                                }}>
                                                {

                                                    moment(item.transaction_date).format("lll")
                                                }
                                            </Text>
                                            {/* <Text
                                                style={{
                                                    color: item.transaction_status == "charging"
                                                        ? COLORS.green
                                                        : COLORS.red
                                                    ,
                                                    fontFamily: FONTS.fontFamily,
                                                }}>
                                                {item.transaction_status}
                                            </Text> */}
                                        </View>
                                        <View
                                            style={{
                                                position: 'absolute',
                                                top: -12,
                                                left: 6,
                                                padding: 10,
                                                paddingVertical: 2,
                                                backgroundColor: '#fac800',
                                                borderRadius: 3,
                                                shadowColor: '#000',
                                                shadowOffset: {
                                                    width: 0,
                                                    height: 1,
                                                },
                                                shadowOpacity: 0.2,
                                                shadowRadius: 1.41,

                                                // elevation: 2,
                                            }}>
                                            <Text
                                                style={{
                                                    fontFamily: FONTS.fontFamily,
                                                }}>
                                                {'#' + ((index + 1) + "." + item.transaction_id)}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </>
                            );
                        }}
                    />
                )}
            </View>
        );
    }
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: COLORS.white,
            }}>
            {/* header */}
            {renderHeader()}
            {/* category */}
            {renderCategorys()}

            {renderBody()}


            <Modal
                visible={visableTransResModal}
                onRequestClose={() => {
                    setVisableTransResModal(false);
                }}
                animationType="fade"
                transparent={true}>
                <View
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <TouchableWithoutFeedback
                        onPress={() => {
                            setVisableTransResModal(false);
                        }}
                        style={{ flex: 1, width: '100%' }}>
                        <View style={{ flex: 1, width: '100%' }} />
                    </TouchableWithoutFeedback>

                    <View
                        style={{
                            backgroundColor: COLORS.white,
                            width: '90%',
                            borderRadius: SIZES.base,
                            padding: SIZES.padding,
                        }}>
                        <LottieView
                            source={lottie.wallet}
                            autoPlay
                            loop
                            style={{ height: 100, width: '100%', alignSelf: 'center' }}
                            resizeMode="contain"
                        />

                        <Text
                            style={{
                                fontSize: 22,
                                fontFamily: 'Somar-Medium',
                            }}>
                            {selectedTrans.description}
                        </Text>
                    </View>
                    <TouchableWithoutFeedback
                        onPress={() => {
                            setVisableTransResModal(false);
                        }}
                        style={{ flex: 1, width: '100%' }}>
                        <View style={{ flex: 1, width: '100%' }} />
                    </TouchableWithoutFeedback>
                </View>
            </Modal>
        </View>
    )
}
export default AllTransactions;