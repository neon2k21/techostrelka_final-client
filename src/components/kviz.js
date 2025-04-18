import { useEffect, useState } from "react";
import { TouchableOpacity, View, Text, Image, StyleSheet, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Импортируем useNavigation
import { ip_address } from "../../config";

// Импортируем изображение валюты
import currencyIcon from '../../assets/point.png';
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";

export default function Kviz({ postData }) {
    const [isModalVisible, setIsModalVisible] = useState(false); // Состояние для модального окна
    const [kviz, setkviz] = useState([]);
    const navigation = useNavigation(); // Получаем доступ к навигации

    const getCurrentKviz = async (id) => {
        try {
            const response = await fetch(ip_address + '/api/getsplashkviz', {
                method: 'POST', // Используем метод POST
                headers: {
                    'Content-Type': 'application/json', // Указываем, что данные отправляются в формате JSON
                },
                body: JSON.stringify({ id }), // Передаем id в теле запроса
            });
            const data = await response.json();
            console.log(data);
            setkviz(data); // Сохраняем полученные данные в состояние
        } catch (error) {
            console.error('Error fetching kviz:', error);
        }
    };

    useEffect(() => {
        getCurrentKviz(postData.id);
    }, []);

    // Функция для открытия модального окна
    const openModal = () => {
        setIsModalVisible(true);
    };

    // Функция для закрытия модального окна
    const closeModal = () => {
        setIsModalVisible(false);
    };

    // Функция для перехода на экран QuezScreen
    const handleGoToQuiz = () => {
        closeModal(); // Закрываем модальное окно
        navigation.navigate("Квиз", { kvizData: postData }); // Переходим на экран QuezScreen
    };

    return (
        <View style={styles.card}>
            {/* Контейнер для текстового контента и стрелки */}
            <TouchableOpacity style={styles.contentContainer} onPress={openModal}>
                {/* Левая часть (название квиза и количество очков) */}
                <View style={styles.leftContent}>
                    {/* Название квиза */}
                    <Text style={styles.quizName}>{postData.name}</Text>

                    {/* Количество очков */}
                    <View style={styles.rewardContainer}>
                        <Text style={styles.pointsText}>
                            +{postData.reward}
                        </Text>
                        {/* Изображение валюты */}
                        <Image
                            source={currencyIcon}
                            style={styles.currencyIcon}
                        />
                    </View>
                </View>

                {/* Правая часть (стрелка вправо) */}
                <View style={styles.rightArrow}>
                    <Image style={styles.nextImage} source={require('../../assets/nextButton.png')}/>
                </View>
            </TouchableOpacity>

            {/* Модальное окно */}
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={closeModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {/* Закрытие модального окна */}
                        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                            <Text style={styles.closeButtonText}>×</Text>
                        </TouchableOpacity>

                        {/* Название курса */}
                        <Text style={styles.modalCourseName}>{postData.name}</Text>

                        {/* Топик курса */}
                        <View style={styles.modalRewardContainer}>
                            <Text style={styles.modalTopicName}>+ {postData.reward}</Text>
                            {/* Изображение валюты */}
                            <Image
                                source={currencyIcon}
                                style={styles.modalCurrencyIcon}
                            />
                        </View>

                        {/* Количество разделов */}
                        <Text style={styles.modalSections}>
                            {kviz.questions_count}{' '}
                            {kviz.questions_count % 2 === 0 ? 'Вопроса' : 'Вопросов'}
                        </Text>

                        {/* Кнопка "Поехали!" */}
                        <TouchableOpacity style={styles.goButton} onPress={handleGoToQuiz}>
                            <Text style={styles.goButtonText}>Поехали!</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 10,
        borderWidth:1,
        borderColor:'#F3F3F4',
        width:widthPercentageToDP(93),
        marginRight:widthPercentageToDP(2),
        paddingLeft:15
    },
    contentContainer: {
        flexDirection: 'row', // Размещаем текстовый контент и стрелку в строку
        alignItems: 'center', // Выравниваем элементы по центру по вертикали
    },
    leftContent: {
        flex: 1, // Занимает оставшееся пространство
    },
    quizName: {
        fontSize: 16,
        color: '#000',
        marginBottom: 1,
        fontFamily:'Medium'
    },
    pointsText: {
        fontSize: 12,
        color: '#90969F',
        fontFamily:'Medium'
    },
    rightArrow: {
        justifyContent: 'center', // Выравниваем стрелку по центру
        marginLeft: 10, // Отступ между текстом и стрелкой
    },
    arrowText: {
        fontSize: 20,
        color: '#FF4F12', // Оранжевый цвет стрелки
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Полупрозрачный фон
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: '90%',
        maxHeight: '90%',
    },
    closeButton: {
        alignSelf: 'flex-end',
        marginBottom: 10,
    },
    closeButtonText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    modalImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
    modalCourseName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    modalTopicName: {
        fontSize: 14,
        color: '#7700FF',
        marginBottom: 10,
    },
    modalSections: {
        fontSize: 14,
        color: '#555',
        marginBottom: 10,
    },
    modalDescription: {
        fontSize: 14,
        color: '#333',
        marginBottom: 20,
    },
    goButton: {
        backgroundColor: '#FF4F12', // Оранжевый фон кнопки
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    goButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
    rewardContainer: {
        flexDirection: 'row', // Размещаем текст и изображение в строку
        alignItems: 'center', // Выравниваем элементы по центру
    },
    currencyIcon: {
        width: 10, // Ширина изображения
        height: 10, // Высота изображения
        marginLeft: 2, // Отступ между текстом и изображением
        resizeMode: 'contain', // Сохраняем пропорции изображения,
        marginTop:heightPercentageToDP(-0.07)
    },
    modalRewardContainer: {
        flexDirection: 'row', // Размещаем текст и изображение в строку
        alignItems: 'center', // Выравниваем элементы по центру
    },
    modalCurrencyIcon: {
        width: 20, // Ширина изображения
        height: 20, // Высота изображения
        marginLeft: 5, // Отступ между текстом и изображением
        resizeMode: 'contain', // Сохраняем пропорции изображения
    },
    nextImage: {
        width: 30, // Ширина изображения
        height: 30, // Высота изображения
        resizeMode: 'contain', // Сохраняем пропорции изображения,
        marginLeft:widthPercentageToDP(1)
    },
});