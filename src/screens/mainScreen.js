import { useCallback, useEffect, useState } from "react"
import { useNavigation, useFocusEffect } from '@react-navigation/core';
import { ip_address } from "../../config";
import { TouchableOpacity, View, Text, Image, StyleSheet, FlatList, ScrollView } from 'react-native';
import Post from "../components/post";

export default function MainScreen() {
    //навигация
    const navigation = useNavigation();

    //данные из базы данных
    const [posts, setPosts] = useState([])
    const [actualPosts, setActualPosts] = useState([])
    const [filters, setFilters] = useState([])
    const [selectFilters, setSelectFilters] = useState([])
    ///////////////////////получение из бд/////////////////////////
    //получение активных постов
    const getAllPosts = async () => {
    try {
    const response = await fetch(ip_address + '/api/getAllPosts');
    const data = await response.json();
    setPosts(data) 
    setActualPosts(data)
    } catch (error) {
    console.error('Error fetching stories:', error);
    }
    }
    //получение фильтров
    const getAllFilters = async () => {
    try {
    const response = await fetch(ip_address + '/api/getAllFilters');
    const data = await response.json();
    setFilters(data) 
    // setActualPosts(data)
    } catch (error) {
    console.error('Error fetching stories:', error);
    }

    }

    //вызываем функции получения информации из бд
    useFocusEffect(useCallback(()=>{
        getAllPosts()
        getAllFilters()
    },[]))

    /////////////////функции//////////////
    // Используем useEffect для реакции actualPosts на изменение selectFilters
    useEffect(() => {
    const updateActualPosts = () => {
    if (selectFilters.length === 0) {
        setActualPosts(posts);
    } else {
        setActualPosts(posts.filter(post => 
        selectFilters.includes(post.topic)
        ));
    }
    };

    updateActualPosts();
    }, [selectFilters]);

    //отображаем пост
    const renderPost = ({item}) => (
    <Post postData={item}/>
    );
    //отображаем фильтры
    const renderFilter = ({ item, index }) => (
    <TouchableOpacity 
    onPress={() => {
        const index = selectFilters.indexOf(item.name);
        if (index !== -1) {
        setSelectFilters(prev => prev.filter((_, i) => i !== index));
        } else {
        setSelectFilters(prev => [...prev, item.name]);
        }
    }}
    >
    <Text style={{
        color: selectFilters.includes(item.name) ? 'red' : 'black'
    }}>
        {item.name}
    </Text>
    </TouchableOpacity>
    );
    return(
        <ScrollView className="w-full h-full">
          {/* header */}
            <View style={{flexDirection:'row', marginTop:60}}>
                <Text>Ростелеком</Text>
                <Text>Культурный код</Text>
            </View>
          

        {/* Лента */}
        <FlatList
          data={filters}
          keyExtractor={(item, index) => {item.id.toString(), index.toString()}}
          renderItem={renderFilter}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
        <FlatList
          data={actualPosts}
          keyExtractor={(item, index) => {item.id.toString(), index.toString()}}
          renderItem={renderPost}
          vertical
          showsHorizontalScrollIndicator={false}
          style={styles.flatList}
        />
        </ScrollView>
    )
}const styles = StyleSheet.create({
    flatList: { paddingHorizontal: 10 },
  });