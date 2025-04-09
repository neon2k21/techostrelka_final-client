import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/core';
import { ip_address } from '../../config';
import { heightPercentageToDP } from 'react-native-responsive-screen';

export default function CourseScreen() {
    const route = useRoute();
    const navigation = useNavigation(); // Инициализация навигации
    const { courseData } = route.params; // Данные о курсе из предыдущего экрана
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const pageRefs = useRef([]); // Референсы для каждой страницы

    // Функция для получения данных страниц курса
    const fetchCoursePages = async (id) => {
        try {
            const response = await fetch(ip_address + '/api/getPage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    course_id: id,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Server response:', data); // Логируем данные для отладки

            // Проверяем, есть ли данные в ответе
            if (data.error) {
                console.error('Server error:', data.error);
                setLoading(false); // Завершаем загрузку, даже если есть ошибка
                return;
            }

            // Преобразуем строку blocks в массив
            const parsedPages = data.map(page => ({
                ...page,
                blocks: JSON.parse(page.blocks), // Парсим строку JSON в массив
            }));

            // Обновляем состояние страниц
            setPages(parsedPages || []); // Предполагается, что данные страниц находятся в поле `pages`
            setLoading(false); // Завершаем загрузку
        } catch (error) {
            console.error('Error fetching course pages:', error);
            setLoading(false); // Завершаем загрузку в случае ошибки
        }
    };

    useEffect(() => {
        fetchCoursePages(courseData.course_id);

        // Инициализация референсов для каждой страницы
        pageRefs.current = pages.map(() => React.createRef());
    }, [pages]);

    // Прокрутка к определенной странице
    const scrollToPage = (index) => {
        if (pageRefs.current[index]?.current) {
            pageRefs.current[index].current.scrollTo({ y: 0, animated: true });
        }
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#FF4F12" />
            </View>
        );
    }

    if (!pages || pages.length === 0) {
        return (
            <View style={styles.loaderContainer}>
                <Text style={styles.errorText}>Нет данных для отображения</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Верхний блок с названием курса и кнопкой "Выйти" */}
            <View style={styles.headerContainer}>
                {/* Название курса */}
                <Text style={styles.courseTitleHeader}>{courseData.course_name}</Text>

                {/* Кнопка "Выйти" */}
                <TouchableOpacity
                    style={styles.exitButton}
                    onPress={() => navigation.goBack()} // Возвращаемся на предыдущий экран
                >
                    <Text style={styles.exitButtonText}>Выйти</Text>
                </TouchableOpacity>
            </View>

            {/* Кнопки навигации */}
            <FlatList
                horizontal
                data={pages} // Передаем массив страниц
                keyExtractor={(item, index) => index.toString()} // Уникальный ключ для каждого элемента
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        style={styles.navButton}
                        onPress={() => scrollToPage(index)}
                    >
                        <Text style={styles.navButtonText}>{index + 1}</Text>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.navigationContainer}
                style={styles.scrollViewStyle} // Устанавливаем фиксированную высоту
            />

            {/* Основной контент */}
            <ScrollView contentContainerStyle={styles.contentContainer}>
                {/* Отображение страниц курса */}
                {pages.map((page, pageIndex) => (
                    <View key={pageIndex} ref={pageRefs.current[pageIndex]} style={styles.pageContainer}>
                        {/* Название страницы */}
                        <Text style={styles.pageTitle}>{page.name}</Text>

                        {/* Отображение блоков контента */}
                        {page.blocks.map((block, index) => {
                            switch (block.type) {
                                case 'text':
                                    return (
                                        <Text key={index} style={styles.textBlock}>
                                            {block.content}
                                        </Text>
                                    );
                                case 'image':
                                    return (
                                        <Image
                                            key={index}
                                            source={{ uri: block.content }}
                                            style={styles.imageBlock}
                                            resizeMode="contain"
                                        />
                                    );
                                case 'video':
                                    return (
                                        <View key={index} style={styles.videoBlock}>
                                            <Text style={styles.videoText}>Видео:</Text>
                                            <Text style={styles.videoLink}>{block.content}</Text>
                                        </View>
                                    );
                                default:
                                    return null;
                            }
                        })}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerContainer: {
        marginTop: heightPercentageToDP(4),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        backgroundColor: '#f9f9f9',
    },
    courseTitleHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    exitButton: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: '#FF4F12', // Оранжевый цвет
        borderRadius: 5,
    },
    exitButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
    },
    scrollViewStyle: {
        height:0, // Высота FlatList равна высоте кнопок
    },
    navigationContainer: {
        paddingHorizontal: 5,
        backgroundColor: '#f5f5f5',
    },
    navButton: {
        width: 40,
        height: 40,
        backgroundColor: '#7700FF', // Фиолетовый цвет
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginHorizontal: 5,
    },
    navButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff', // Белый текст
    },
    contentContainer: {
        flexGrow: 1,
        paddingTop: 0, // Убираем верхний отступ
        paddingBottom: 20, // Оставляем нижний отступ
        paddingHorizontal: 20, // Горизонтальные отступы остаются
        backgroundColor: '#fff',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    errorText: {
        fontSize: 16,
        color: '#FF4F12',
        textAlign: 'center',
    },
    pageContainer: {
        marginBottom: 350,
    },
    pageTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#7700FF',
        marginBottom: 10,
    },
    textBlock: {
        fontSize: 16,
        color: '#555',
        marginBottom: 10,
    },
    imageBlock: {
        width: '100%',
        height: 200,
        marginBottom: 10,
    },
    videoBlock: {
        marginBottom: 10,
    },
    videoText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FF4F12',
    },
    videoLink: {
        fontSize: 14,
        color: '#007AFF',
        textDecorationLine: 'underline',
    },
});