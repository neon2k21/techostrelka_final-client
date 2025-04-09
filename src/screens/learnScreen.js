import { useCallback, useEffect, useState } from "react";
import { useNavigation, useFocusEffect } from '@react-navigation/core';
import { ip_address } from "../../config";
import { TouchableOpacity, View, Text, Image, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import Curs from "../components/curs"; // Импортируем компонент Curs
import Kviz from "../components/kviz"; // Импортируем компонент Kviz

export default function LearnScreen() {
    // Навигация
    const navigation = useNavigation();
    // Данные из базы данных
    const [posts, setPosts] = useState([]);
    const [actualPosts, setActualPosts] = useState([]);
    const [filters, setFilters] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [users, setUsers] = useState([]); // Массив пользователей
    const [kvizPosts, setKvizPosts] = useState([]); // Данные квизов

    /////////////////////// Получение из БД /////////////////////////
    // Получение активных курсов
    const getAllPosts = async () => {
        try {
            const response = await fetch(ip_address + '/api/getallcourse');
            const data = await response.json();
            setPosts(data);
            setActualPosts(data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    // Получение фильтров
    const getAllFilters = async () => {
        try {
            const response = await fetch(ip_address + '/api/getAlltopic');
            const data = await response.json();
            setFilters(data);
        } catch (error) {
            console.error('Error fetching filters:', error);
        }
    };

    const getAllUsers = async () => {
        try {
            const response = await fetch(ip_address + '/api/getalluserforlist');
            console.log(response)
            const data = await response.json();
            console.log(data)
            setUsers(data);
        } catch (error) {
            console.error('Error fetching filters:', error);
        }
    };

    // Получение данных квизов
    const getKvizPosts = async () => {
        try {
            const response = await fetch(ip_address + '/api/getAllKviz'); // Замените на ваш API-путь
            const data = await response.json();
            setKvizPosts(data);
        } catch (error) {
            console.error('Error fetching kviz posts:', error);
        }
    };

    // Вызываем функции получения информации из БД
    useFocusEffect(useCallback(() => {
        getAllPosts();
        getAllUsers();
        getAllFilters();
        getKvizPosts(); // Добавляем вызов функции для получения квизов
    }, []));

    /////////////////////// Функции /////////////////////////
    // Реакция на изменение selectedFilters
    useEffect(() => {
        const updateActualPosts = () => {
            if (selectedFilters.length === 0) {
                setActualPosts(posts);
            } else {
                setActualPosts(posts.filter(post =>
                    selectedFilters.includes(post.topic_name) // Используем поле topic_name
                ));
            }
        };
        updateActualPosts();
    }, [selectedFilters]);

    // Обработчик нажатия на кнопку фильтра
    const handleFilterPress = (filterName) => {
        if (selectedFilters.includes(filterName)) {
            setSelectedFilters(prev => prev.filter(name => name !== filterName));
        } else {
            setSelectedFilters(prev => [...prev, filterName]);
        }
    };

    // Отображаем фильтры
    const renderFilter = ({ item }) => (
        <TouchableOpacity
            onPress={() => handleFilterPress(item.name)}
            style={styles.filterButton}
        >
            <Text
                style={[
                    styles.filterButtonText,
                    selectedFilters.includes(item.name) && styles.selectedFilterButtonText,
                ]}
            >
                {item.name}
            </Text>
        </TouchableOpacity>
    );

    // Отображаем пользователя
    const renderUser = ({ item, index }) => (
        <View style={styles.userContainer}>
            {/* Левая часть (порядковый номер и имя) */}
            <View style={styles.userInfoLeft}>
                <Text
                    style={[
                        styles.userRank,
                        (index === 0 || index === 1) && styles.orangeText, // Оранжевый текст для первых двух номеров
                        index === users.length - 1 && styles.fullOrangeText, // Оранжевый текст для последнего пользователя
                    ]}
                >
                    {index + 1}.
                </Text>
                <Text
                    style={[
                        styles.userName,
                        (index === 0 || index === 1) && styles.orangeText, // Оранжевый текст для первых двух номеров
                        index === users.length - 1 && styles.fullOrangeText, // Оранжевый текст для последнего пользователя
                    ]}
                >
                    {item.name}
                </Text>
            </View>
            {/* Правая часть (очки и иконка) */}
            <View style={styles.userInfoRight}>
                <Text
                    style={[
                        styles.userPoints,
                        (index === 0 || index === 1) && styles.orangeText, // Оранжевый текст для первых двух номеров
                        index === users.length - 1 && styles.fullOrangeText, // Оранжевый текст для последнего пользователя
                    ]}
                >
                    {item.points} очков
                </Text>
                <Image
                    source={require('../../assets/point.png')} // Путь к изображению point
                    style={styles.pointImage}
                />
            </View>
        </View>
    );

    // Отображаем курс с использованием компонента Curs
    const renderPost = ({ item }) => (
        <Curs postData={item} />
    );

    // Отображаем квиз с использованием компонента Kviz
    const renderKviz = ({ item }) => (
        <Kviz postData={item} />
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {/* Верхняя панель (логотипы и фильтры) */}
            <View style={styles.topContainer}>
                {/* Заголовок */}
                <View style={styles.header}>
                    {/* Левая часть заголовка */}
                    <Text style={styles.headerText}>Обучение</Text>
                    {/* Правая часть заголовка (текст "100" и изображение) */}
                    <View style={styles.pointsContainer}>
                        <Text style={styles.pointsText}>100</Text>
                        <Image
                            source={require('../../assets/point.png')} // Путь к изображению point
                            style={styles.pointImage}
                        />
                    </View>
                </View>
                {/* Рейтинг пользователей */}
                <View style={styles.userListContainer}>
                    <Text style={styles.userListTitle}>Рейтинг пользователей</Text>
                    <FlatList
                        data={users}
                        renderItem={renderUser}
                        contentContainerStyle={styles.userListContent}
                    />
                </View>
                {/* Кнопки фильтров (горизонтальная прокрутка) */}
                
            </View>
            <View style={styles.kvizSection}>
                <Text style={styles.kvizTitle}>Квизы</Text>
                <FlatList
                    data={kvizPosts}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderKviz}
                    horizontal // Горизонтальная прокрутка
                    showsHorizontalScrollIndicator={false} // Скрываем индикатор прокрутки
                    contentContainerStyle={styles.kvizListContent}
                />
            </View>
            {/* Лента курсов*/}
            <View>
            <FlatList
                    data={filters}
                    keyExtractor={(item) => item.id.toString()} // Уникальный ключ для каждого фильтра
                    renderItem={renderFilter}
                    horizontal // Горизонтальная прокрутка
                    showsHorizontalScrollIndicator={false} // Скрываем индикатор прокрутки
                    contentContainerStyle={styles.filtersContainer}
                />
            <FlatList
                data={actualPosts}
                keyExtractor={(item) => item.course_id.toString()}
                renderItem={renderPost}
                contentContainerStyle={{
                    paddingHorizontal: 10,
                    paddingTop: 10,
                    paddingBottom: 60, // Отступ снизу для нижней панели
                }}
                showsHorizontalScrollIndicator={false} // Скрываем индикатор прокрутки
            />           
            </View>
           
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    topContainer: {
        backgroundColor: '#fff', // Фон верхней панели
        elevation: 3, // Тень для Android
        shadowColor: '#000', // Тень для iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        padding: 10,
    },
    header: {
        flexDirection: 'row', // Размещаем элементы в строку
        justifyContent: 'space-between', // Распределяем элементы по ширине
        alignItems: 'center', // Выравниваем элементы по центру по вертикали
        marginBottom: 10,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    pointsContainer: {
        flexDirection: 'row', // Размещаем текст и изображение в строку
        alignItems: 'center', // Выравниваем элементы по центру по вертикали
    },
    pointsText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF4F12', // Оранжевый цвет для числа
        marginRight: 5, // Отступ между текстом и изображением
    },
    pointImage: {
        width: 20, // Ширина изображения
        height: 20, // Высота изображения
        resizeMode: 'contain', // Сохраняем пропорции изображения
    },
    logo: {
        width: 100, // Ширина логотипа
        height: 40, // Высота логотипа
        resizeMode: 'contain', // Сохраняем пропорции изображения
    },
    filtersContainer: {
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    filterButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc', // Рамка не меняет цвет
        marginRight: 10, // Отступ между кнопками
    },
    filterButtonText: {
        fontSize: 14,
        color: '#333',
    },
    selectedFilterButtonText: {
        color: '#FF4F12', // Цвет текста для выбранного фильтра
        fontWeight: 'bold',
    },
    userListContainer: {
        backgroundColor: '#f9f9f9', // Светлый фон для списка пользователей
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        padding: 10,
    },
    userListTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    userContainer: {
        flexDirection: 'row', // Размещаем элементы в строку
        justifyContent: 'space-between', // Распределяем элементы по ширине
        alignItems: 'center', // Выравниваем элементы по центру по вертикали
        marginBottom: 10,
    },
    userInfoLeft: {
        flexDirection: 'row', // Размещаем элементы в строку
        alignItems: 'center', // Выравниваем элементы по центру по вертикали
    },
    userInfoRight: {
        flexDirection: 'row', // Размещаем элементы в строку
        alignItems: 'center', // Выравниваем элементы по центру по вертикали
    },
    userRank: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginRight: 10, // Отступ между порядковым номером и именем
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    userPoints: {
        fontSize: 14,
        color: '#333',
        marginRight: 5, // Отступ между очками и иконкой
    },
    orangeText: {
        color: '#FF4F12', // Оранжевый цвет текста
    },
    fullOrangeText: {
        color: '#FF4F12', // Полностью оранжевый текст
    },
    kvizSection: {
        marginTop: 20,
        paddingHorizontal: 10,
    },
    kvizTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    kvizListContent: {
        paddingVertical: 10,
    },
});