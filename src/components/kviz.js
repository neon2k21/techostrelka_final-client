import { useState } from "react";
import { TouchableOpacity, View, Text, Image, StyleSheet, Modal } from 'react-native';

export default function Kviz({ postData }) {
    const [isModalVisible, setIsModalVisible] = useState(false); // Состояние для модального окна

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
            {/* Контейнер для текстового контента и стрелки */}
            <TouchableOpacity style={styles.contentContainer} onPress={openModal}>
                {/* Левая часть (название квиза и количество очков) */}
                <View style={styles.leftContent}>
                    {/* Название квиза */}
                    <Text style={styles.quizName}>{postData.course_name}</Text>

                    {/* Количество очков */}
                    <Text style={styles.pointsText}>
                        {postData.points} очков
                    </Text>
                </View>

                {/* Правая часть (стрелка вправо) */}
                <View style={styles.rightArrow}>
                    <Text style={styles.arrowText}>→</Text>
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
                            Разделов: {postData.sections_count}{' '}
                            {postData.sections_count % 2 === 0 ? '(четное)' : '(нечетное)'}
                        </Text>

                        {/* Описание курса */}
                        <Text style={styles.modalDescription}>{postData.description}</Text>

                        {/* Кнопка "Поехали!" */}
                        <TouchableOpacity style={styles.goButton}>
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
    contentContainer: {
        flexDirection: 'row', // Размещаем текстовый контент и стрелку в строку
        alignItems: 'center', // Выравниваем элементы по центру по вертикали
        justifyContent: 'space-between', // Распределяем элементы по ширине
    },
    leftContent: {
        flex: 1, // Занимает оставшееся пространство
    },
    quizName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    pointsText: {
        fontSize: 14,
        color: '#7700FF',
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
});