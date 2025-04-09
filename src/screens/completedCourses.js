import { useRoute, useNavigation } from '@react-navigation/core';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/core';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from "react-native";
import { ip_address } from "../../config";
import Curs from "../components/cursComplete"; // Импортируем компонент Curs
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";


export default function CompletedCoursesScreen() {
    const navigation = useNavigation();
    const [courses, setCourses] = useState([])
    // Функция для изменения лайка
        const getCompletedCursebyUser = async () => {
            try {
                const response = await fetch(`${ip_address}/api/getCompletedCursebyUser`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_id: global.id
                    })
                });
    
                if (!response.ok) throw new Error('Network response was not ok');
    
                const data = await response.json();
                console.log('Результат:', data.courses);
                setCourses(data.courses)
            } catch (error) {
                console.error('Ошибка:', error);
            }
        };

        useFocusEffect(useCallback(() => {
            getCompletedCursebyUser();
        }, []));
    const renderPost = ({ item }) => (
            <Curs postData={item} />
        );
    return(
        <View style={{ flex: 1, backgroundColor:'#fff'}}>
            <View style={styles.header}>
            <TouchableOpacity onPress={()=>{navigation.goBack()}}>
                <Text>🔙</Text>
            </TouchableOpacity>
            <Text>Пройденные курсы</Text>
            </View>
            <FlatList
                data={courses}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderPost}
                contentContainerStyle={{
                    paddingHorizontal: 10,
                    paddingTop: 10,
                    paddingBottom: 60, // Отступ снизу для нижней панели
                }}
                showsHorizontalScrollIndicator={false} // Скрываем индикатор прокрутки
            />  
        </View>
    )
}
const styles = StyleSheet.create({
        header: {
            flexDirection: 'row', // Размещаем элементы в строку
            alignItems: 'center', // Выравниваем элементы по центру по вертикали
            marginTop:heightPercentageToDP(6),
            padding: 10,
        },
})