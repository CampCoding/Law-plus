import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Linking, StatusBar, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { AppRequired, COLORS, FONTS, SIZES } from '../../constants';
import Axios from 'axios';

const ContactUsScreen = ({ navigation }) => {
    // const contactDetails = {
    //     phoneNumber: '+1234567890',
    //     emailAddress: 'example@example.com',
    //     address: '123 Main Street, City, Country',
    //     whatsappNumber: '+1234567890',
    //     facebookPage: 'https://www.facebook.com/examplepage',
    //     telegramUsername: 'exampletelegram',
    // };
    // useEffect(() => {
    //     console.log(navigation.getParam("contact"))
    // }, [])

    // const openPhoneNumber = () => {
    //     Linking.openURL(`tel:${contactDetails.phoneNumber}`);
    // };

    // const openEmail = () => {
    //     Linking.openURL(`mailto:${contactDetails.emailAddress}`);
    // };

    // const openWhatsapp = () => {
    //     Linking.openURL(`whatsapp://send?phone=${contactDetails.whatsappNumber}`);
    // };

    // const openFacebook = () => {
    //     Linking.openURL(contactDetails.facebookPage);
    // };

    // const openTelegram = () => {
    //     Linking.openURL(`https://t.me/${contactDetails.telegramUsername}`);
    // };

    const [data, setData] = useState([])
    useEffect(() => {
        info()
    }, [])

    const info = async () => {


        Axios
            .get(AppRequired.Domain + `home/${navigation.getParam("type") == "charge" ? "charge_way" : "charge_problems"}.php`)
            .then((res) => {
                if (res.status == 200) {
                    console.log(res.data)
                    if ((res.data).length > 0)
                        setData(res.data)

                }
            });
    };


    const Card = ({ data }) => {
        const handlePress = (url) => {
            Linking.openURL(url);
        };

        return (
            <View style={styles.card}>
                <Text style={styles.title}>{data?.title}</Text>
                <Text style={styles.text}>{data.text}</Text>
                <Text style={styles.subtitle}>طرق التواصل :</Text>
                {data?.phone ?
                    <>
                        <TouchableOpacity onPress={() => handlePress(`tel:${data.phone}`)}>
                            <Text style={[styles.text, { textDecorationLine: "underline" }]}><Text style={{
                                fontWeight: "bold",
                            }}>رقم الهاتف : </Text>{data.phone}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handlePress(`whatsapp://send?phone=${data.phone}`)}>
                            <Text style={[styles.text, { textDecorationLine: "underline" }]}><Text style={{
                                fontWeight: "bold",
                            }}> الواتساب : </Text>{data.phone}</Text>
                        </TouchableOpacity>
                    </> : null
                }
                {data?.telegram ?
                    <TouchableOpacity onPress={() => handlePress(`https://telegram.me/${data.telegram}`)}>
                        <Text style={[styles.text, { textDecorationLine: "underline" }]}><Text style={{
                            fontWeight: "bold",
                        }}> التليجرام : </Text>{data.telegram}</Text>
                    </TouchableOpacity>
                    :
                    null
                }
                {data?.facebook ?
                    <TouchableOpacity onPress={() => handlePress(data.facebook)}>
                        <Text style={[styles.text, { textDecorationLine: "underline" }]}><Text style={{
                            fontWeight: "bold",
                        }}> الفيسبوك : </Text> {data.facebook}</Text>
                    </TouchableOpacity>
                    : null}
            </View>
        );
    };
    const styles = StyleSheet.create({
        card: {
            backgroundColor: '#fff',
            borderRadius: 10,
            padding: 20,
            margin: 10,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
        title: {
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 10,
            color: COLORS.searchBar
        },
        subtitle: {
            fontSize: 16,
            fontWeight: 'bold',
            marginVertical: 10,
            color: COLORS.searchBar
        },
        text: {
            fontSize: 16,
            marginBottom: 5,
        },
    });
    return (
        <View style={{ flex: 1 }}>
            <StatusBar
                backgroundColor={COLORS.primary}
                barStyle="light-content"
            />
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
                        تواصل معنا
                    </Text>
                </View>
                <View style={{ flex: 1 }} />
            </View>
            <ScrollView>
                {data?.map((item, index) => {
                    return (
                        <Card data={item} />
                    )
                })}

            </ScrollView>
        </View>
    );
};

export default ContactUsScreen;
