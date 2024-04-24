import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { AppRequired, COLORS, FONTS, SIZES, lottie } from '../../constants';
import { StatusBar } from 'react-native';
import LottieView from 'lottie-react-native';
const VideoQAPage = ({ navigation, route }) => {

    console.log(navigation.getParam("q_a"))

    const VideoQA = ({ question, answer, index }) => {
        return (
            <View style={styles.container2}>
                <Text style={styles.question}>{(index + 1) + ") " + question}</Text>
                <Text style={styles.answer}>{answer}</Text>
            </View>
        );
    };


    return (
        <SafeAreaView style={styles.container}>
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
                        س+ج
                    </Text>
                </View>
                <View style={{ flex: 1 }} />
            </View>
            <ScrollView contentContainerStyle={styles.scrollView}>

                {navigation.getParam("q_a")?.length > 0 ? navigation.getParam("q_a")?.map((item, index) => {
                    return (
                        <VideoQA
                            question={item?.question}
                            answer={item?.answer}
                            index={index}
                        />
                    )
                }) :
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '90%',
                            margin: '5%',
                            marginTop: '5%',
                        }}>
                        <LottieView
                            source={lottie.noData}
                            autoPlay
                            loop
                            style={{ height: SIZES.width * 0.5, width: '100%' }}
                            resizeMode="contain"
                        />
                    </View>
                }

                {/* <VideoQA
                    question="How do you handle navigation in React Native?"
                    answer="Navigation in React Native can be handled using libraries like React Navigation or React Native Navigation."
                /> */}

                {/* Add more VideoQA components as needed */}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flexGrow: 1,
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
    container2: {
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        marginVertical: 10,
        elevation: 3,
    },
    question: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: "#293077"
    },
    answer: {
        fontSize: 16,
    },
});

export default VideoQAPage;
