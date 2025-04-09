import { useRoute, useNavigation } from '@react-navigation/core';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/core';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from "react-native";
import { ip_address } from "../../config";
import Curs from "../components/cursComplete"; // Импортируем компонент Curs
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";
import Kviz from "../components/kviz"; // Импортируем компонент Kviz


export default function CompletedQuezesScreen() {
    const navigation = useNavigation();
    const [courses, setCourses] = useState([])
    // Функция для изменения лайка
        const getCompletedKvizByUser = async () => {
            try {
                const response = await fetch(`${ip_address}/api/getCompletedKvizByUser`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_id: global.id
                    })
                });
    
                if (!response.ok) throw new Error('Network response was not ok');
    
                const data = await response.json();
                console.log('Результат:', data.kvizzes);
                setCourses(data.kvizzes)
            } catch (error) {
                console.error('Ошибка:', error);
            }
        };

        useFocusEffect(useCallback(() => {
            getCompletedKvizByUser();
        }, []));
     const renderKviz = ({ item }) => (
            <Kviz postData={item} />
        );
    return(
        <View style={{ flex: 1, backgroundColor:'#fff'}}>
            <View style={styles.header}>
            <TouchableOpacity onPress={()=>{navigation.goBack()}}>
                <Text>🔙</Text>
            </TouchableOpacity>
            <Text>Пройденные квизы</Text>
            </View>
            <FlatList
                data={courses}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderKviz}
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