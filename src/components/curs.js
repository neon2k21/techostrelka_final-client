import { useEffect, useState } from "react";
import { TouchableOpacity, View, Text, Image, StyleSheet, Modal } from 'react-native';
import { useNavigation } from "@react-navigation/core"; // Импортируем хук для навигации
import { ip_address } from "../../config";

export default function Curs({ postData }) {
    const navigation = useNavigation(); // Инициализация навигации
    const [isModalVisible, setIsModalVisible] = useState(false); // Состояние для модального окна
    const [course, setCourse] = useState([]);

    const getCurrentCourse = async (id) => {
        try {
            const response = await fetch(ip_address + '/api/getCourse', {
                method: 'POST', // Используем метод POST
                headers: {
                    'Content-Type': 'application/json', // Указываем, что данные отправляются в формате JSON
                },
                body: JSON.stringify({ id }), // Передаем id в теле запроса
            });
            const data = await response.json();
            console.log(data);
            setCourse(data); // Сохраняем полученные данные в состояние
        } catch (error) {
            console.error('Error fetching course:', error);
        }
    };

    useEffect(() => {
        getCurrentCourse(postData.course_id);
    }, []);

    // Функция для открытия модального окна
    const openModal = () => {
        setIsModalVisible(true);
    };

    // Функция для закрытия модального окна
    const closeModal = () => {
        setIsModalVisible(false);
    };

    return (
        <View style={styles.card}>
            {/* Изображение курса */}
            <Image
                source={{ uri: `${postData.course_preview}` }} // Предполагается, что course_preview — это путь к изображению
                style={styles.image}
            />

            {/* Контейнер для текстового контента и кнопки */}
            <View style={styles.contentContainer}>
                {/* Текстовый контент */}
                <View style={styles.textContent}>
                    {/* Название курса */}
                    <Text style={styles.courseName}>{postData.course_name}</Text>

                    {/* Топик курса */}
                    <Text style={styles.topicName}>{postData.topic_name}</Text>
                </View>

                {/* Кнопка "Подробнее" */}
                <TouchableOpacity style={styles.detailsButton} onPress={openModal}>
                    <Text style={styles.detailsButtonText}>Подробнее</Text>
                </TouchableOpacity>
            </View>

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

                        {/* Изображение курса */}
                        <Image
                            source={{ uri: `${postData.course_preview}` }}
                            style={styles.modalImage}
                        />

                        {/* Название курса */}
                        <Text style={styles.modalCourseName}>{postData.course_name}</Text>

                        {/* Топик курса */}
                        <Text style={styles.modalTopicName}>{postData.topic_name}</Text>

                        {/* Количество разделов */}
                        <Text style={styles.modalSections}>
                            {course.page_count}{' '}
                            {course.page_count === 1
                                ? 'страница'
                                : course.page_count % 2 === 0
                                    ? 'страницы'
                                    : 'страниц'}
                        </Text>

                        {/* Описание курса */}
                        <Text style={styles.modalDescription}>{postData.description}</Text>

                        {/* Кнопка "Поехали!" */}
                        <TouchableOpacity
                            style={styles.goButton}
                            onPress={() => {
                                closeModal(); // Скрываем модальное окно
                                navigation.navigate('Курсы', { courseData: postData }); // Переходим на экран 'Курсы'
                            }}
                        >
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
        borderRadius: 10,
        padding: 15,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
    contentContainer: {
        flexDirection: 'row', // Размещаем текстовый контент и кнопку в строку
        alignItems: 'center', // Выравниваем элементы по центру по вертикали
    },
    textContent: {
        flex: 1, // Занимает оставшееся пространство
    },
    courseName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 3,
    },
    topicName: {
        fontSize: 12,
        color: '#7700FF',
    },
    detailsButton: {
        backgroundColor: '#FF4F12', // Оранжевый фон кнопки
        paddingVertical: 5,
        paddingHorizontal: 8,
        borderRadius: 5,
        marginLeft: 10, // Отступ слева между текстом и кнопкой
    },
    detailsButtonText: {
        fontSize: 12,
        color: '#fff',
        fontWeight: 'bold',
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
});