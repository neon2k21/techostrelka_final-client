import { useCallback, useEffect, useState } from "react";
import { useNavigation, useFocusEffect } from '@react-navigation/core';
import { ip_address } from "../../config";
import { TouchableOpacity, View, Text, Image, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import Curs from "../components/curs"; // Импортируем компонент Curs
import Kviz from "../components/kviz"; // Импортируем компонент Kviz
import { ScrollView } from "react-native-gesture-handler";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";

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
        <View style={[
            styles.userContainer,
            index === users.length - 1 && styles.topBorder]}>
            {/* Левая часть (порядковый номер и имя) */}
            <View style={styles.userInfoLeft}>
                <Text
                    style={[
                        styles.userRank,
                        (index === 0) && styles.orangeText, // Оранжевый текст для первых двух номеров
                        (index === 1) && styles.darkOrangeText, // Оранжевый текст для первых двух номеров
                        (index === 2) && styles.violetText, // Оранжевый текст для первых двух номеров
                        index === users.length - 1 && styles.orangeText, // Оранжевый текст для последнего пользователя
                    ]}
                >
                    {index + 1}
                </Text>
                <Text
                    style={[
                        styles.userName,
                        index === users.length - 1 && styles.orangeText, // Оранжевый текст для последнего пользователя
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
                        index === users.length - 1 && styles.orangeText, // Оранжевый текст для последнего пользователя
                    ]}
                >
                    {item.points}
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
console.log(kvizPosts.length)
    return (
        <View style={{ flex: 1, backgroundColor:'#F8F8F8'}}>
            <ScrollView>
            {/* Верхняя панель (логотипы и фильтры) */}
            <View style={styles.topContainer}>
                {/* Заголовок */}
                <View style={styles.header}>
                    {/* Левая часть заголовка */}
                    <Text style={styles.headerText}>Обучение</Text>
                    {/* Правая часть заголовка (текст "100" и изображение) */}
                    <View style={styles.pointsContainer}>
                        <Text style={styles.headerText}>{global.points}</Text>                        <Image
                            source={require('../../assets/point.png')} // Путь к изображению point
                            style={styles.pointImage}
                        />
                    </View>
                </View>
                {/* Рейтинг пользователей */}
                    <FlatList
                        data={users}
                        renderItem={renderUser}
                        contentContainerStyle={styles.userListContainer}
                    />
                {/* Кнопки фильтров (горизонтальная прокрутка) */}
                
            </View>
            <Text style={styles.period}>До конца сезона: 1 месяц</Text>
            <View style={styles.learnContainer}>
            {kvizPosts.length > 0 && (
             <View style={styles.kvizSection}>
                    <Text style={styles.h2}>квизы</Text>
                    <FlatList
                    data={kvizPosts}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderKviz}
                    horizontal // Горизонтальная прокрутка
                    showsHorizontalScrollIndicator={false} // Скрываем индикатор прокрутки
                    contentContainerStyle={styles.kvizListContent}
                    />
                </View>
                )}
            <Text style={[styles.h2, {marginTop:15}]}>курсы</Text>
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
            </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    topContainer: {
        padding: 10,
        marginTop:heightPercentageToDP(6),
    },
    header: {
        flexDirection: 'row', // Размещаем элементы в строку
        justifyContent: 'space-between', // Распределяем элементы по ширине
        alignItems: 'center', // Выравниваем элементы по центру по вертикали
        marginBottom: 10,
    },
    headerText: {
        fontSize: 20,
        color: '#000',
        fontFamily:'Bold'
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
        resizeMode: 'contain', // Сохраняем пропорции изображения,
        marginLeft:widthPercentageToDP(1)
    },
    logo: {
        width: 100, // Ширина логотипа
        height: 40, // Высота логотипа
        resizeMode: 'contain', // Сохраняем пропорции изображения
    },
    filtersContainer: {
        flexDirection: 'row',
        width: widthPercentageToDP(90), // Ширина контейнера фильтров
        marginBottom: heightPercentageToDP(-2),
        marginTop:heightPercentageToDP(1),
        marginLeft:15
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
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
        fontFamily:'Medium'
    },
    selectedFilterButtonText: {
        color: '#FF4F12',
    },
    userListContainer: {
        backgroundColor: '#fff', // Светлый фон для списка пользователей
        borderRadius:5,
        width:widthPercentageToDP(93),
        alignSelf:'center'
    },
    kvizListContent:{
        marginLeft:15,
        marginTop:3
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
        alignItems: 'center', // Выравниваем элементы по центру по вертикали,
        padding:9
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
        fontFamily:'Bold',
        color: '#333',
        marginRight: 10, // Отступ между порядковым номером и именем
    },
    userName: {
        fontSize: 16,
        color: '#000',
        fontFamily:'Medium'
    },
    userPoints: {
        fontSize: 16,
        color: '#000',
        marginRight: 1, // Отступ между очками и иконкой
        fontFamily:'Medium'
    },
    orangeText: {
        color: '#FF4F12', // Оранжевый цвет текста
    },
    darkOrangeText: {
        color: '#D33706', // Полностью оранжевый текст
    },
    violetText: {
        color: '#7700FF', // Полностью оранжевый текст
    },
    kvizSection: {
        marginTop:15
    },
    kvizTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    topBorder:{
        borderTopWidth:1,
        borderTopColor:'#F3F3F4'
    },
    period:{
        marginLeft:widthPercentageToDP(4),
        fontFamily:'Regular',
        fontSize:12,
        color:'#90969F',
        marginTop:heightPercentageToDP(-0.3)
    },
    learnContainer:{
        width:'100%',
        height:'100%',
        backgroundColor:'#fff',
        marginTop:heightPercentageToDP(1)
    },
    h2:{
        width:widthPercentageToDP(90),
        fontFamily:'Bold',
        color: '#90969F', // Черный цвет текста,
        fontSize: 12,
        marginLeft:15
    },
});