import { useNavigation } from "@react-navigation/core";
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, Image, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Keyboard } from "react-native";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";
import { ip_address } from "../../config";

export default function LoginScreen() {
    const navigation = useNavigation();
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    const sendData = async () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "login": login.toLowerCase(),
            "password": password.toLowerCase()
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(ip_address + '/api/getUser', requestOptions)
            .then(response => response.json())
            .then(async result => {
                if (result !== "Данные не совпадают! Проверьте и повторите попытку") {
                    global.id = result[0].id;
                    global.name = result[0].name;
                    global.percent_by_topic = result[0].grade;
                    global.topic1_id = result[0].topic1_id;
                    global.topic2_id = result[0].topic2_id;
                    global.topic3_id = result[0].topic3_id;
                    global.topic4_id = result[0].topic4_id;
                    global.points = result.points;
                    navigation.navigate('Главный экран');
                } else {
                    Alert.alert('Авторизация', result, [
                        {
                            text: 'ОК'
                        }
                    ]);
                }
            })
            .catch(error => console.log('LOGIN error', error));
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.maincontainer}>
                    {/* Картика сверху */}
                    <Image
                        source={require('../../assets/rostelekomxkultkod.png')} // Укажите путь к вашей картинке
                        style={styles.logo}
                        resizeMode="contain" // Изображение будет полностью влезать
                    />

                    {/* Надпись "вход" по левому краю */}
                    <Text style={styles.title}>Вход</Text>

                    {/* Поле для ввода логина */}
                    <TextInput
                        style={styles.input}
                        onChangeText={setLogin}
                        value={login}
                        placeholder="Логин"
                    />

                    {/* Расстояние между полями ввода */}
                    <View style={styles.inputSpacing} />

                    {/* Поле для ввода пароля */}
                    <TextInput
                        style={styles.input}
                        secureTextEntry={true}
                        onChangeText={setPassword}
                        value={password}
                        placeholder="Введите пароль"
                    />

                    {/* Кнопка "Войти" на всю ширину (фиолетовая) */}
                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={sendData}
                    >
                        <Text style={styles.loginButtonText}>Войти</Text>
                    </TouchableOpacity>

                    {/* Надпись "Нет аккаунта? Зарегистрироваться" */}
                    <View style={styles.registerContainer}>
                        <Text style={styles.noAccountText}>нет аккаунта?</Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Регистрация')}
                        >
                            <Text style={styles.registerLinkText}>зарегистрироваться</Text>
                        </TouchableOpacity>
                    </View>
                <Image
                        source={require('../../assets/mascot.png')} // Укажите путь к вашей картинке
                        style={styles.mascot}
                        resizeMode="contain" // Изображение будет полностью влезать
                    />
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    maincontainer: {
        flex: 1,
        backgroundColor: '#fff',
        padding: widthPercentageToDP(7),
        justifyContent: 'center', // Центрируем содержимое по вертикали
        paddingBottom: heightPercentageToDP(25),
    },
    logo: {
        width: widthPercentageToDP(70), // Увеличил ширину для лучшего отображения
        height: widthPercentageToDP(70), // Высота равна ширине для сохранения пропорций
        alignSelf: 'center',
        marginBottom: heightPercentageToDP(5),
    },
    mascot: {
        width: widthPercentageToDP(32), // Увеличил ширину для лучшего отображения
        height: widthPercentageToDP(32), // Высота равна ширине для сохранения пропорций
        alignSelf: 'center',
        position: 'absolute',
        top: heightPercentageToDP(88),
        left: widthPercentageToDP(80),
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: heightPercentageToDP(2.7),
        alignSelf: 'flex-start', // Выравнивание по левому краю
        fontFamily:'Bold'
    },
    input: {
        padding: heightPercentageToDP(1),
        fontSize: 16,
        backgroundColor: '#f8f8f8',
        fontFamily:'Medium',
        borderRadius:5,
        color:'#90969F'
    },
    inputSpacing: {
        height: heightPercentageToDP(0.5), // Расстояние между полями ввода
    },
    loginButton: {
        backgroundColor: '#7700FF', // Фиолетовый цвет
        padding: heightPercentageToDP(1.7),
        borderRadius: 8,
        marginTop: heightPercentageToDP(2),
        fontFamily:'Bold'
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        fontFamily:'Bold'
    },
    registerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: heightPercentageToDP(0.7),
    },
    noAccountText: {
        fontSize: 13,
        color: '#90969F', // Черный цвет текста,
        fontFamily:'Medium'

    },
    registerLinkText: {
        fontSize: 13,
        color: '#EC4E58', // Оранжевый цвет текста
        marginLeft: widthPercentageToDP(1),
        fontFamily:'Bold'
    },
});