import { useState, useCallback } from "react"
import { useNavigation, useFocusEffect } from '@react-navigation/core';
import { TouchableOpacity, View, Text, Image, StyleSheet, FlatList } from 'react-native';
import { ip_address } from "../../config";


export default function Post({postData}){

    const [like, setLike]=useState(0)
    const [recommend, setRecommend]=useState(false)
////////////эти функции для изменения лайка по нажатию (чекается id юзера в табличке с лайками)
/////////////и получение лайков по id поста
    const changeLike = async () => {
            try {
              const response = await fetch(`${ip_address}/api/changeLike`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  post_id: postData.id,
                  user_id: global.id
                })
              });
          
              if (!response.ok) throw new Error('Network response was not ok');
              
              const data = await response.json();
              console.log('Результат:', data);
              
              // Обновление интерфейса
              if (data.message === 'Лайк добавлен') {
                 setLike(prev => prev + 1);
            } else if (data.message === 'Лайк удалён') {
                setLike(prev => prev - 1);
            }
          
            } catch (error) {
              console.error('Ошибка:', error);
            }
          }
    const getPostLikes = async () =>{
            console.log("Считываем лайк")
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            
            var raw = JSON.stringify({
                "post_id":postData.id
            });
            
            var requestOptions = {
              method: 'POST',
              headers: myHeaders,
              body: raw,
              redirect: 'follow'
            };
            
            fetch(ip_address+'/api/getPostLikes', requestOptions)
              .then(response => response.json())
              .then(async result => {
                setLike(result.length)
        })
              .catch(error => console.log('getLikes error', error));
        } 

        useFocusEffect(useCallback(()=>{
            getPostLikes()
        },[]))

    return(
        <View>
            <Image 
                source={{ uri: ip_address + postData.image }}
                style={[styles.image]}
            />
            <Text>{postData.content}</Text>
            <View>
                <TouchableOpacity onPress={()=>{
                    changeLike()
                }}>
                    <Image source={require('../../assets/favicon.png')}/>
                    <Text>{like}</Text>
                </TouchableOpacity>
                
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    image: { width: 80, height: 80, borderRadius: 40 },
  });