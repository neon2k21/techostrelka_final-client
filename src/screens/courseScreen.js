import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/core';
import { ip_address } from '../../config';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { WebView } from 'react-native-webview';

export default function CourseScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { courseData } = route.params;
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPageIndex, setCurrentPageIndex] = useState(0); // Текущая страница

    // Функция для получения данных страниц курса
    const fetchCoursePages = async (id) => {
        try {
            const response = await fetch(ip_address + '/api/addCourseToProcess', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id:global.id, course_id:courseData.course_id }),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        }catch(error){
            console.log(`Ошибка завершения курса: `+error)
        }
    
        try {
            const response = await fetch(ip_address + '/api/getPage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ course_id: id }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Server response:', data);

            if (data.error) {
                console.error('Server error:', data.error);
                setLoading(false);
                return;
            }

            const parsedPages = data.map(page => ({
                ...page,
                blocks: JSON.parse(page.blocks),
            }));

            // Добавляем дополнительную страницу с текстом и кнопкой
            const completionPage = {
                name: 'Завершение курса',
                blocks: [
                    {
                        type: 'text',
                        content: `\nСпасибо за прохождение курса "${courseData.course_name}"!\nЧтобы завершить курс, нажмите кнопку ниже.\n`,
                    },
                ],
            };

            setPages([...parsedPages, completionPage]); // Добавляем страницу завершения
            setLoading(false);
        } catch (error) {
            console.error('Error fetching course pages:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoursePages(courseData.course_id);
    }, []);

    // // Прокрутка к следующей странице
    // const scrollToNextPage = () => {
    //     if (currentPageIndex < pages.length - 1) {
    //         setCurrentPageIndex(currentPageIndex + 1);
    //     }
    // };

    // // Прокрутка к предыдущей странице
    // const scrollToPreviousPage = () => {
    //     if (currentPageIndex > 0) {
    //         setCurrentPageIndex(currentPageIndex - 1);
    //     }
    // };

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

    const completeCourse = async () => {
        try {
            const response = await fetch(ip_address + '/api/completecourse', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id:global.id, course_id:courseData.course_id }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        }catch(error){
            console.log(`Ошибка завершения курса: `+error)
        }
        alert('Курс успешно завершен!');
        navigation.goBack(); // Возвращаемся на предыдущий экран
    };

    return (
        <View style={styles.container}>
            {/* Верхний блок с названием курса и кнопкой "Выйти" */}
            <View style={styles.headerContainer}>
                <Text style={styles.courseTitleHeader}>{courseData.course_name}</Text>
                <TouchableOpacity
                    style={styles.exitButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.exitButtonText}>выйти</Text>
                </TouchableOpacity>
            </View>

            {/* Индикатор страниц */}
            <View style={styles.pageIndicatorContainer}>
                {pages.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.pageIndicatorDot,
                            currentPageIndex === index && styles.activePageIndicatorDot,
                        ]}
                    />
                ))}
            </View>

            {/* Основной контент */}
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(event) => {
                    const newIndex = Math.round(
                        event.nativeEvent.contentOffset.x / widthPercentageToDP(100)
                    );
                    setCurrentPageIndex(newIndex);
                }}
            >
                {pages.map((page, pageIndex) => (
                    <ScrollView
                        key={pageIndex}
                        style={styles.pageContainer}
                        contentContainerStyle={styles.pageContentContainer}
                    >
                        <Text style={styles.pageTitle}>{page.name}</Text>
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
                                            source={{ uri: ip_address +`/`+ block.content }}
                                            style={styles.imageBlock}
                                            resizeMode="contain"
                                        />
                                    );
                                case 'video':
                                    const videoUrl = ip_address +`/`+ block.content;

                                    if (!videoUrl || !videoUrl.startsWith('http') || !block.content) {
                                        return (
                                            <View key={index} style={styles.videoBlock}>
                                                <Text style={styles.errorText}>
                                                    Недействительная ссылка на видео
                                                </Text>
                                            </View>
                                        );
                                    }

                                    const htmlContent = `
                                        <!DOCTYPE html>
                                        <html>
                                        <head>
                                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                            <style>
                                                body, html {
                                                    margin: 0;
                                                    padding: 0;
                                                    width: 100%;
                                                    height: 100%;
                                                    overflow: hidden;
                                                }
                                                video {
                                                    width: 100%;
                                                    height: 100%;
                                                    object-fit: contain;
                                                }
                                            </style>
                                        </head>
                                        <body>
                                            <video controls autoplay>
                                                <source src="${videoUrl}" type="video/mp4">
                                                Ваш браузер не поддерживает видео.
                                            </video>
                                        </body>
                                        </html>
                                    `;

                                    return (
                                        <View key={index} style={styles.videoBlock}>
                                            <Text style={styles.videoText}>Видео:</Text>
                                            <WebView
                                                style={styles.webView}
                                                originWhitelist={['*']}
                                                source={{ html: htmlContent }}
                                                allowsFullscreenVideo={true}
                                                javaScriptEnabled={true}
                                                scalesPageToFit={true}
                                            />
                                        </View>
                                    );
                                default:
                                    return null;
                            }
                        })}
                        {/* Кнопка завершения курса на последней странице */}
                        {pageIndex === pages.length - 1 && (
                            <TouchableOpacity
                                style={styles.completeButton}
                                onPress={completeCourse}
                            >
                                <Text style={styles.completeButtonText}>Завершить курс</Text>
                            </TouchableOpacity>
                        )}
                    </ScrollView>
                    
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
        marginTop: heightPercentageToDP(5),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        marginBottom:-10
    },
    courseTitleHeader: {
        fontSize: 20,
        paddingRight: 5,
        color: '#000',
        fontFamily:'Bold'
    },
    exitButton: {
        paddingVertical: 5,
        paddingHorizontal: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
    },
    exitButtonText: {
        fontSize: 15,
        color: '#7700FF',
        fontFamily:'Bold'
    },
    pageIndicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    pageIndicatorDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ccc',
        marginHorizontal: 5,
    },
    activePageIndicatorDot: {
        backgroundColor: '#FF4F12',
    },
    navigationButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    navButton: {
        padding: 10,
        backgroundColor: '#7700FF',
        borderRadius: 5,
    },
    disabledNavButton: {
        backgroundColor: '#ccc',
    },
    navButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    pageContainer: {
        width: widthPercentageToDP(100),
        padding: 20,
        backgroundColor: '#fff',
        paddingTop:0
    },
    pageContentContainer: {
        paddingBottom: 20, // Добавляем отступ внизу для удобства прокрутки
    },
    pageTitle: {
        fontSize: 16,
        color: '#000',
        marginBottom: 10,
        fontFamily:'Bold'
    },
    textBlock: {
        fontSize: 13,
        color: '#000',
        marginBottom: 10,
        fontFamily:'Regular'
    },
    imageBlock: {
        width: widthPercentageToDP(90),
        height: heightPercentageToDP(28),
        marginBottom: 10,
        borderRadius:5
    },
    videoBlock: {
        marginBottom: 10,
    },
    videoText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FF4F12',
    },
    webView: {
        flex: 1,
        width: '100%',
        height: 200,
        marginTop: 10,
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
});