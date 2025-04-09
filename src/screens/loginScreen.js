import { useNavigation } from "@react-navigation/core"
import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, Alert,Image, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Keyboard } from "react-native"
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";
import { ip_address} from "../../config";

export default function LoginScreen(){

    const {navigate} = useNavigation()
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    const sendData = async () =>{
        console.log("Allo2")
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        
        var raw = JSON.stringify({
          "login": login.toLowerCase(),
          "password": password.toLowerCase()
          // "login": "m",
          // "password": "m"
        });
        
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };
        
        fetch(ip_address+'/api/getUser', requestOptions)
          .then(response => response.json())
          .then(async result => {
            global.id = result[0].id
            global.name = result[0].name
            global.percent_by_topic = result[0].grade
            global.topic1_id = result[0].topic1_id
            global.topic2_id = result[0].topic2_id
            global.topic3_id = result[0].topic3_id
            global.topic4_id = result[0].topic4_id
            global.points = result.points
            if(result!="Данные не совпадают! Проверьте и повторите попытку") {
                navigate('Главный экран')
            }
            else {
                 Alert.alert('Авторизация',
                    result ,[
                    {
                      text: 'ОК'
                    }
                   ])  
            }
          
        })
          .catch(error => console.log('LOGIN error', error));
    } 

    return(
      <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex:1}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.maincontainer}>

            <Text style={{marginTop:heightPercentageToDP(20)}}>вход</Text>
              <Text>
                Логин
              </Text>

              <TextInput

              onChangeText={setLogin}
              value={login}
              />

              <Text>
                Пароль
              </Text>

              <TextInput
              secureTextEntry={true}
              onChangeText={setPassword}
              value={password}/>

              <TouchableOpacity  onPress={()=>{
                console.log("Allo")
                sendData()
                }}>
                <Text >
                  Вход
                </Text>
              </TouchableOpacity>
              
            </View>
        </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )

}

const styles = StyleSheet.create({
    maincontainer:
      {
  width:'100%'    ,
  height:'100%',
  backgroundColor:'#F9F1E5'
  },
})