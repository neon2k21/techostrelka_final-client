import { useState, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/core';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Импортируем иконки
import { ip_address } from "../../config";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";

export default function Post({ postData }) {
    const [like, setLike] = useState(999);
    const [isLiked, setIsLiked] = useState(false); // Состояние для отслеживания лайка
    const [isExpanded, setIsExpanded] = useState(false); // Состояние для раскрытия текста

    // Функция для изменения лайка
    const changeLike = async () => {
        try {
            const response = await fetch(`${ip_address}/api/changeLike`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    posts_id: postData.post_id,
                    user_id: global.id
                })
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            console.log('Результат:', data);

            // Обновление интерфейса
            if (data.message === 'Лайк добавлен') {
                setLike(prev => prev + 1);
                setIsLiked(true); // Устанавливаем состояние лайка
            } else if (data.message === 'Лайк удалён') {
                setLike(prev => prev - 1);
                setIsLiked(false); // Сбрасываем состояние лайка
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };

     // Функция для проверки лайка
     const checkLike = async () => {
        try {
            const response = await fetch(`${ip_address}/api/checkLike`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    posts_id: postData.post_id,
                    user_id: global.id
                })
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            setIsLiked(data.isLiked)

        } catch (error) {
            console.error('Ошибка:', error);
        }
    };

    // Функция для получения количества лайков
    const getPostLikes = async () => {
        try {
            const response = await fetch(`${ip_address}/api/getPostLikes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ posts_id: postData.post_id })
            });

            const result = await response.json();
            setLike(result.length);
        } catch (error) {
            console.error('getLikes error', error);
        }
    };

    // Получение лайков при фокусе на экране
    useFocusEffect(useCallback(() => {
        getPostLikes();
        checkLike();
    }, []));

    // Ограничение длины текста
    const MAX_TEXT_LENGTH = 100; // Максимальная длина текста до обрезки
    const truncatedText = postData.post_description.slice(0, MAX_TEXT_LENGTH) + "...";
    const fullText = postData.post_description;
    console.log(postData)

    return (
        <View style={styles.card}>
            {/* Отображение изображения */}
            {postData.post_image && (
                <Image
                    source={{ uri: `${ip_address}/${postData.post_image}` }}
                    style={styles.image}
                />
                )}
            {/* Описание поста */}
            <Text style={styles.description}>
                {isExpanded ? fullText : truncatedText}
                {postData.post_description.length > MAX_TEXT_LENGTH && !isExpanded && (
                    <Text style={styles.showMoreButton} onPress={() => setIsExpanded(true)}>
                        Показать еще
                    </Text>
                )}
                {isExpanded && (
                    <Text style={styles.showMoreButton} onPress={() => setIsExpanded(false)}>
                        Скрыть
                    </Text>
                )}
            </Text>
            {/* Нижняя панель с лайками, топиком и рекомендацией */}
            <View style={styles.footer}>
                {/* Лайки */}
                <TouchableOpacity onPress={changeLike} style={styles.likesContainer}>
                    <MaterialCommunityIcons
                        name="heart" // Используем иконку сердца
                        size={24}
                        color={isLiked ? '#FF4F12' : '#ccc'} // Оранжевый при лайке, серый при отсутствии лайка
                    />
                    <Text style={styles.likeCount}>{like}</Text>
                </TouchableOpacity>

                {/* Контейнер для топика и рекомендации */}
                <View style={styles.infoContainer}>
                    {/* Название топика */}
                    <View style={[styles.infoBadge, styles.topicBadge]}>
                        <Text style={styles.badgeText}>{postData.topic_name}</Text>
                    </View>

                    {/* Рекомендовано вам */}
                    <View style={[styles.infoBadge, styles.recommendBadge]}>
                        <Text style={styles.badgeText}>рекомендовано</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: '#F3F3F4',
        width:widthPercentageToDP(100),
        paddingBottom:7
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
        backgroundColor:'f3f3f3'
    },
    description: {
        fontSize: 15,
        color: '#333',
        marginTop: 5,
        fontFamily:'Regular'
    },
    showMoreButton: {
        color: '#007BFF',
        marginLeft: 5,
        fontFamily:'Medium',
    },
    footer: {
        flexDirection: 'row', // Размещаем элементы в строку
        alignItems: 'center', // Выравниваем по центру по вертикали
        marginTop: 10,
    },
    likesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    likeCount: {
        fontSize: 16,
        color: '#555',
        marginLeft: 5, // Добавляем отступ между иконкой и числом лайков
        marginEnd:10
    },
    infoContainer: {
        flexDirection: 'row', // Размещаем топик и рекомендацию в строку
        alignItems: 'center', // Выравниваем по центру по вертикали
    },
    infoBadge: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginLeft: 5, // Добавляем отступ между топиком и рекомендацией
    },
    topicBadge: {
        borderColor: '#FF4F12',
        backgroundColor: '#FF4F12',
    },
    recommendBadge: {
        borderColor: '#7700FF',
        backgroundColor: '#7700FF',
    },
    badgeText: {
        fontSize: 12,
        fontFamily:'Medium',
        color: '#FFF',
    },
});