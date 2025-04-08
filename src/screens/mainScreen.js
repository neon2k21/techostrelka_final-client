import { useCallback, useEffect, useState } from "react";
import { useNavigation, useFocusEffect } from '@react-navigation/core';
import { ip_address } from "../../config";
import { TouchableOpacity, View, Text, Image, StyleSheet, FlatList, ScrollView } from 'react-native';
import Post from "../components/post";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MainScreen() {
    // Навигация
    const navigation = useNavigation();

    // Данные из базы данных
    const [posts, setPosts] = useState([]);
    const [actualPosts, setActualPosts] = useState([]);
    const [filters, setFilters] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState([]);

    /////////////////////// Получение из БД /////////////////////////
    // Получение активных постов
    const getAllPosts = async () => {
        try {
            const response = await fetch(ip_address + '/api/getAllPost');
            const data = await response.json();
            console.log(data);
            setPosts(data);
            setActualPosts(data);
        } catch (error) {
            console.error('Error fetching stories:', error);
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

    // Вызываем функции получения информации из БД
    useFocusEffect(useCallback(() => {
        getAllPosts();
        getAllFilters();
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

    // Отображаем пост
    const renderPost = ({ item }) => (
        <Post postData={item} />
    );

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

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {/* Верхняя панель (логотипы и фильтры) */}
            <View style={styles.topContainer}>
                {/* Логотипы */}
                <View style={styles.header}>
                    {/* Логотип Ростелеком */}
                    <Image
                        source={require('../../assets/logo.png')} // Путь к логотипу Ростелеком
                        style={styles.logo}
                    />
                    {/* Логотип Культурный код */}
                    <Image
                        source={require('../../assets/cultcod.png')} // Путь к логотипу Культурный код
                        style={styles.logo}
                    />
                </View>

                {/* Кнопки фильтров (горизонтальная прокрутка) */}
                <FlatList
                    data={filters}
                    keyExtractor={(item) => item.id.toString()} // Уникальный ключ для каждого фильтра
                    renderItem={renderFilter}
                    horizontal // Горизонтальная прокрутка
                    showsHorizontalScrollIndicator={false} // Скрываем индикатор прокрутки
                    contentContainerStyle={styles.filtersContainer}
                />
            </View>

            {/* Лента постов */}
            <FlatList
                data={actualPosts}
                keyExtractor={(item) => item.post_id.toString()}
                renderItem={renderPost}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 10,
                    paddingTop: 10,
                    paddingBottom: 60, // Отступ снизу для нижней панели
                }}
                style={{ flex: 1 }} // FlatList занимает оставшееся пространство
            />
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
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
        color: 'orange', // Цвет текста для выбранного фильтра
        fontWeight: 'bold',
    },
});