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

const AllTransactions2 = ({ navigation }) => {

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
            label: ('all'),
        },
        {
            id: 2,
            label: ('deposit'),
            service_name: 'Deposit',
        },
        {
            id: 3,
            label: ('transfers'),
            service_name: 'Transfers',
        },
        {
            id: 4,
            label: ('service_fee'),
            service_name: 'Service Fee',
        },
        {
            id: 5,
            label: ('withdraw_mywallet'),
            service_name: 'Withdraw',
        },
        {
            id: 6,
            label: ('cancellation_fine'),
            service_name: 'Cancellation Fine',
        },
        {
            id: 7,
            label: ('cancellation_compensation'),
            service_name: 'Cancellation Compensation',
        },
    ]);

    React.useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setNewtworkConnection(state.isInternetReachable);
        });
        req_getAllTransactions();
    }, []);

    async function req_getAllTransactions() {
        if (networkConnection) {
            // console.log(user_data);
            let user_data = JSON.parse(await AsyncStorage.getItem('AllData'));
            let data_to_send = {
                merchant_id: user_data.student_id,
            };

            axios
                .post(
                    AppRequired.Domain + 'select_wallet_transaction.php',
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
                        a.service_name.toLowerCase() ==
                        slectedCategoryIndex.service_name.toLowerCase(),
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
                        a.service_name.toLowerCase() ==
                        slectedCategoryIndex.service_name.toLowerCase(),
                );
                setRenderedData(selectedData);
            }
        }
    }

    function renderHeader() {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: COLORS.primary,
                    padding: SIZES.padding,
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,

                    elevation: 5,
                }}>
                <TouchableOpacity
                    style={{
                        width: 40,
                    }}
                    onPress={() => navigation.goBack()}>
                    <FontAwesome5
                        name={'arrow-right'}
                        size={20}
                        color={COLORS.black}
                    />
                </TouchableOpacity>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ ...FONTS.h3 }}>{('my_transactions')}</Text>
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
                                        ? COLORS.primary
                                        : COLORS.lightGray1,
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
                            source={lottie.carry_trolley}
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
                                        source={lottie.no_data}
                                        autoPlay
                                        loop
                                        style={{ height: 300, width: '100%' }}
                                        resizeMode="contain"
                                    />
                                    <Text
                                        style={{
                                            color: COLORS.darkGray,
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
                                        disabled={!item.note}
                                        onPress={() => {
                                            setVisableTransResModal(true);
                                            setSelectedTrans(item);
                                        }}
                                        style={{
                                            backgroundColor: COLORS.white2,
                                            marginVertical: 20,
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: SIZES.base,
                                            paddingTop: SIZES.base + 10,
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
                                                        // fontWeight: 'bold',
                                                    }}>
                                                    {I18nManager.isRTL
                                                        ? item.service_name_ar
                                                        : item.service_name}
                                                </Text>
                                                <Text
                                                    style={{
                                                        color: '#ccc',
                                                        fontSize: 14,
                                                        fontFamily: FONTS.fontFamily,
                                                    }}>
                                                    {item.service_history}
                                                </Text>
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
                                                            item.service_amount > 0
                                                                ? COLORS.transparentGreen
                                                                : COLORS.transparentRed,
                                                        borderRadius: 3,
                                                    }}>
                                                    <MaterialIcons
                                                        name={
                                                            item.service_amount > 0
                                                                ? 'arrow-drop-up'
                                                                : 'arrow-drop-down'
                                                        }
                                                        color={
                                                            item.service_amount > 0
                                                                ? COLORS.green
                                                                : COLORS.red
                                                        }
                                                        size={30}
                                                    />
                                                    <Text
                                                        style={{
                                                            color: COLORS.secondary,
                                                            fontWeight: 'bold',
                                                            fontSize: 16,
                                                            fontFamily: FONTS.fontFamily,
                                                            marginRight: 9,
                                                        }}>
                                                        {item.service_amount > 0
                                                            ? '+' + item.service_amount
                                                            : item.service_amount}
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
                                                {item.date.slice(0, -3)}
                                            </Text>
                                            <Text
                                                style={{
                                                    color:
                                                        item.service_amount < 0 ? COLORS.red : COLORS.green,
                                                    fontFamily: FONTS.fontFamily,
                                                }}>
                                                {item.service_name == 'Withdraw' && item.service_status}
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                position: 'absolute',
                                                top: -13,
                                                left: 6,
                                                padding: 3,
                                                paddingVertical: 5,
                                                backgroundColor: COLORS.primary,
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
                                                {'#' + item.job_id}
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
            {/* Dividor */}
            <View
                style={{
                    width: '100%',
                    height: 3,
                    backgroundColor: COLORS.lightGray1,
                }}
            />
            {/* body */}

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
                            {selectedTrans.note}
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
    );
};

export default AllTransactions2;