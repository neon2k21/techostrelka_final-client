import { useNavigation } from "@react-navigation/core";
import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, Image, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Keyboard, ActivityIndicator } from "react-native";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";
import { ip_address } from "../../config";
import axios from 'axios';

export default function SignupScreen() {
    const navigation = useNavigation();
    const [name, setName] = useState(''); // Поле "Имя"
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [filters, setFilters] = useState([]); // Состояние для фильтров
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [loading, setLoading] = useState(true); // Состояние загрузки

    // Получение всех фильтров с сервера
    const getAllFilters = async () => {
        try {
            const response = await fetch(ip_address + '/api/getAllTopic');
            const data = await response.json(); // Получаем данные из API

            // Создаём новый массив с изменёнными объектами
            const updatedArray = data.map(item => 
            item.name === "научные изобретения"
                ? { ...item, name: "изобретения" } // Обновляем только свойство name
                : item // Оставляем объект без изменений
            );

            setFilters(updatedArray); // Обновляем состояние
            setFilters(updatedArray);
        } catch (error) {
            console.error('Error fetching filters:', error);
            Alert.alert('Ошибка', 'Не удалось загрузить интересы');
        } finally {
            setLoading(false); // Завершаем загрузку
        }
    };

    // Вызов getAllFilters при монтировании компонента
    useEffect(() => {
        getAllFilters();
    }, []);

    // Обработчик нажатия на кнопку фильтра
    const handleFilterPress = (filterName) => {
        if (selectedFilters.includes(filterName)) {
            setSelectedFilters(prev => prev.filter(name => name !== filterName));
        } else {
            setSelectedFilters(prev => [...prev, filterName]);
        }
    };

    // Отправка данных на сервер
    const sendData = async () => {
        if (!name || !login || !password || !confirmPassword) {
            Alert.alert('Ошибка', 'Заполните все поля');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Ошибка', 'Пароли не совпадают');
            return;
        }

        // Здесь можно добавить отправку данных на сервер
        console.log("Данные для регистрации:", { name, login, password });
        console.log("selectedFilters = " + selectedFilters[0])
        try {
            topic1id = null;
            topic2id = null;
            topic3id = null;
            topic4id = null;
            if(selectedFilters.includes("исcкуcтво")){
                topic1id = filters.find(filter => filter.name == "исcкуcтво").id;
            }
            if(selectedFilters.includes("история")){
                topic2id = filters.find(filter => filter.name == "история").id;
            }
            if(selectedFilters.includes("изобретения")){
                topic3id = filters.find(filter => filter.name == "изобретения").id;
            }
            if(selectedFilters.includes("традиции")){
                topic4id = filters.find(filter => filter.name == "традиции").id;
            }
            console.log(topic1id)
            console.log(topic2id)
            console.log(topic3id)
            console.log(topic4id)
            
            const response = await axios.post(ip_address + '/api/createUser',                  
                {
                    name:name,
                    login:login,
                    password:password,
                    topic1_id:topic1id,
                    topic2_id:topic2id,
                    topic3_id:topic3id,
                    topic4_id:topic4id
                }
            );
            console.log(response);
            global.name = name
            global.topic1_id = topic1id;
            global.topic2_id = topic2id;
            global.topic3_id = topic3id;
            global.topic4_id = topic4id;
            global.points = 0;
            // Переход на главный экран после успешной регистрации
            navigation.navigate('Главный экран');
        } catch (error) {
            console.error('Error fetching filters:', error);
            Alert.alert('Ошибка', 'Не удалось создать аккаунт пользователя');
        } finally {
            setLoading(false); // Завершаем загрузку
        }

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
                        resizeMode="contain"
                    />

                    {/* Надпись "Регистрация" по левому краю */}
                    <Text style={styles.title}>Регистрация</Text>

                   

                    {/* Поле для ввода логина */}
                    <TextInput
                        style={[styles.input, styles.sep]}
                        onChangeText={setLogin}
                        value={login}
                        placeholder="Логин"
                    />

                    {/* Поле для ввода пароля */}
                    <TextInput
                        style={[styles.input, styles.sep]}
                        secureTextEntry={true}
                        onChangeText={setPassword}
                        value={password}
                        placeholder="Пароль"
                    />

                    {/* Поле для подтверждения пароля */}
                    <TextInput
                        style={[styles.input, styles.sep]}
                        secureTextEntry={true}
                        onChangeText={setConfirmPassword}
                        value={confirmPassword}
                        placeholder="Подтвердите пароль"
                    />
                     {/* Поле для ввода имени */}
                     <TextInput
                        style={[styles.input, styles.sep1]}
                        onChangeText={setName}
                        value={name}
                        placeholder="Имя"
                    />
                    <Text style={styles.h2}>выберите интересующие разделы</Text>
                    {/* Кнопки фильтров */}
                    {loading ? (
                        <ActivityIndicator size="large" color="#FF4F12" style={styles.loader} />
                    ) : (
                        <View style={styles.filtersContainer}>
                            {filters.map((filter, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => handleFilterPress(filter.name)} // Используем topic_name из данных
                                    style={[
                                        styles.filterButton,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.filterButtonText,
                                            selectedFilters.includes(filter.name) && styles.selectedFilterButtonText,
                                        ]}
                                    >
                                        {filter.name} {/* Отображаем название фильтра */}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* Кнопка "Зарегистрироваться" на всю ширину */}
                    <TouchableOpacity
                        style={styles.registerButton}
                        onPress={sendData}
                    >
                        <Text style={styles.registerButtonText}>зарегистрироваться!</Text>
                    </TouchableOpacity>

                    {/* Ссылка "Есть аккаунт? Войти" */}
                    <View style={styles.loginLinkContainer}>
                        <Text style={styles.loginLinkText}>есть аккаунт? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Авторизация')}>
                            <Text style={styles.loginLink}>войти</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Картинка mascot внизу экрана */}
                    <Image
                        source={require('../../assets/mascot.png')} // Укажите путь к вашей картинке mascot
                        style={styles.mascot}
                        resizeMode="contain"
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
        padding: widthPercentageToDP(5),
        justifyContent: 'flex-start', // Меняем на flex-start, чтобы элементы шли сверху вниз
        alignItems: 'center', // Центрируем элементы по горизонтали
    },
    logo: {
        width: widthPercentageToDP(70),
        height: widthPercentageToDP(70),
        alignSelf: 'center',
        marginTop: heightPercentageToDP(2),
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: heightPercentageToDP(2),
        alignSelf: 'flex-start',
        fontFamily:'Bold'
    },
    sep:{
        marginTop:heightPercentageToDP(0.5)
    },
    sep1:{
        marginTop:heightPercentageToDP(1)
    },
    input: {
        padding: heightPercentageToDP(1),
        fontSize: 16,
        backgroundColor: '#f8f8f8',
        fontFamily:'Medium',
        borderRadius:5,
        color:'#90969F',
        width: widthPercentageToDP(90), // Фиксированная ширина для всех полей
    },
    filtersContainer: {
        flexDirection: 'row',
        width: widthPercentageToDP(90), // Ширина контейнера фильтров
        marginBottom: heightPercentageToDP(-1.5),
        marginTop:heightPercentageToDP(0.5)
    },
    filterButton: {
        paddingVertical: heightPercentageToDP(0.5),
        paddingHorizontal: widthPercentageToDP(1.5),
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#F3F3F4',
        marginBottom: heightPercentageToDP(2),
        marginRight:widthPercentageToDP(1)
    },
    filterButtonText: {
        fontSize: 13,
        color: '#333',
        textAlign: 'center',
        fontFamily:'Medium'
    },
    selectedFilterButtonText: {
        color: '#FF4F12',
    },
    registerButton: {
        backgroundColor: '#FF4F12', // Оранжевый цвет
        padding: heightPercentageToDP(1.7),
        borderRadius: 8,
        marginTop: heightPercentageToDP(2),
        fontFamily:'Bold',
        width: widthPercentageToDP(90), // Фиксированная ширина кнопки
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        fontFamily:'Bold'
    },
    loginLinkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: heightPercentageToDP(0.7),
    },
    loginLinkText: {
        fontSize: 13,
        color: '#90969F', // Черный цвет текста,
        fontFamily:'Medium'
    },
    loginLink: {
        fontSize: 13,
        marginLeft: widthPercentageToDP(1),
        fontFamily:'Bold',
        color: '#7700FF', // Синий цвет для ссылки
    },
    mascot: {
        width: widthPercentageToDP(30), // Фиксированная ширина
        height: widthPercentageToDP(30), // Фиксированная высота
        alignSelf: 'center',
        marginTop: heightPercentageToDP(12), // Отступ сверху
        marginBottom: heightPercentageToDP(5), // Отступ снизу
    },
    loader: {
        marginTop: heightPercentageToDP(5),
    },
    h2:{
        width:widthPercentageToDP(90),
        fontFamily:'Bold',
        color: '#90969F', // Черный цвет текста,
        fontSize: 12,
        marginTop:heightPercentageToDP(1)
    },
});