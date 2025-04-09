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
            const data = await response.json();
            setFilters(data);
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
            topic1id = 0;
            topic2id = 0;
            topic3id = 0;
            topic4id = 0;
            if(selectedFilters.includes("исскуство")){
                topic1id = filters.find(filter => filter.name == "исскуство").id;
            }
            if(selectedFilters.includes("история")){
                topic2id = filters.find(filter => filter.name == "история").id;
            }
            if(selectedFilters.includes("научные изобретения")){
                topic3id = filters.find(filter => filter.name == "научные изобретения").id;
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

                    {/* Поле для ввода имени */}
                    <TextInput
                        style={styles.input}
                        onChangeText={setName}
                        value={name}
                        placeholder="Введите имя"
                    />

                    {/* Поле для ввода логина */}
                    <TextInput
                        style={styles.input}
                        onChangeText={setLogin}
                        value={login}
                        placeholder="Введите логин"
                    />

                    {/* Поле для ввода пароля */}
                    <TextInput
                        style={styles.input}
                        secureTextEntry={true}
                        onChangeText={setPassword}
                        value={password}
                        placeholder="Введите пароль"
                    />

                    {/* Поле для подтверждения пароля */}
                    <TextInput
                        style={styles.input}
                        secureTextEntry={true}
                        onChangeText={setConfirmPassword}
                        value={confirmPassword}
                        placeholder="Подтвердите пароль"
                    />

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
                                        selectedFilters.includes(filter.name) && styles.selectedFilterButton,
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
                        <Text style={styles.registerButtonText}>Зарегистрироваться</Text>
                    </TouchableOpacity>

                    {/* Ссылка "Есть аккаунт? Войти" */}
                    <View style={styles.loginLinkContainer}>
                        <Text style={styles.loginLinkText}>Есть аккаунт? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Авторизация')}>
                            <Text style={styles.loginLink}>Войти</Text>
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
        marginTop: heightPercentageToDP(5),
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: heightPercentageToDP(3),
        alignSelf: 'flex-start',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingVertical: heightPercentageToDP(0.5), // Уменьшен отступ по вертикали
        paddingHorizontal: widthPercentageToDP(2), // Уменьшен отступ по горизонтали
        fontSize: 12, // Уменьшен размер текста
        backgroundColor: '#fff',
        marginBottom: heightPercentageToDP(1.5), // Уменьшен отступ между полями
        height: heightPercentageToDP(4), // Уменьшена фиксированная высота
        width: widthPercentageToDP(90), // Фиксированная ширина для всех полей
    },
    filtersContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: widthPercentageToDP(90), // Ширина контейнера фильтров
        marginBottom: heightPercentageToDP(-2.5),
    },
    filterButton: {
        paddingVertical: heightPercentageToDP(1),
        paddingHorizontal: widthPercentageToDP(3),
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: heightPercentageToDP(2),
    },
    selectedFilterButton: {
        borderColor: '#FF4F12',
        backgroundColor: '#FFECE3',
    },
    filterButtonText: {
        fontSize: 12,
        color: '#333',
        textAlign: 'center',
    },
    selectedFilterButtonText: {
        color: '#FF4F12',
        fontWeight: 'bold',
    },
    registerButton: {
        backgroundColor: '#FF4F12', // Оранжевый цвет
        padding: heightPercentageToDP(2),
        borderRadius: 8,
        marginTop: heightPercentageToDP(3),
        width: widthPercentageToDP(90), // Фиксированная ширина кнопки
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    loginLinkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: heightPercentageToDP(2),
    },
    loginLinkText: {
        fontSize: 14,
        color: '#000',
    },
    loginLink: {
        fontSize: 14,
        color: '#7700FF', // Синий цвет для ссылки
    },
    mascot: {
        width: widthPercentageToDP(20), // Фиксированная ширина
        height: widthPercentageToDP(20), // Фиксированная высота
        alignSelf: 'center',
        marginTop: heightPercentageToDP(3), // Отступ сверху
        marginBottom: heightPercentageToDP(5), // Отступ снизу
    },
    loader: {
        marginTop: heightPercentageToDP(5),
    },
});