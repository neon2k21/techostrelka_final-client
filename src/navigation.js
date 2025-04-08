import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from './screens/loginScreen';
import MainScreen from './screens/mainScreen';
import LearnScreen from './screens/learnScreen';
import ProfileScreen from './screens/profileScreen';
import ChatScreen from './screens/ChatScreen';
import SignupScreen from './screens/singupScreen';
import QuezScreen from './screens/quezScreen';
import CourseScreen from './screens/courseScreen';





const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()



   function Login_StackNavigator(){

  
    return(
    <Stack.Navigator>
      <Stack.Screen name = "Авторизация" options={{headerShown: false}} component={LoginScreen}/>
      <Stack.Screen name = "Регистрация" options={{headerShown: false}} component={SignupScreen}/>
      <Stack.Screen name = "Главный экран" options={{headerShown: false}} component={Bottom_stacknavigator}/> 
    </Stack.Navigator>
  )
  
  
}

function LearnScreen_StackNavigator(){
  return(
  <Stack.Navigator>
    <Stack.Screen name = "Учеба" options={{headerShown: false}} component={LearnScreen}/>
    <Stack.Screen name = "Курсы" options={{headerShown: false}} component={CourseScreen}/>
    <Stack.Screen name = "Квиз" options={{headerShown: false}} component={QuezScreen}/> 
  </Stack.Navigator>
)
}

function ProfileScreen_StackNavigator(){
  return(
  <Stack.Navigator>
    <Stack.Screen name = "Личка" options={{headerShown: false}} component={ProfileScreen}/>
  </Stack.Navigator>
)
}
function ChatScreen_StackNavigator(){
    return(
    <Stack.Navigator>
      <Stack.Screen name = "Нейронка" options={{headerShown: false}} component={ChatScreen}/>
    </Stack.Navigator>
  )
  }

function MainScreen_StackNavigator(){
  return(
    <Stack.Navigator>
      <Stack.Screen name = "Главная странца" options={{headerShown: false}} component={MainScreen}/>
    </Stack.Navigator>
  )
}

function Bottom_stacknavigator(){

   return(
     
     <Tab.Navigator>
         <Tab.Screen name="Главная" options={{headerShown: false}} component={MainScreen_StackNavigator}/>
         <Tab.Screen name="Обучение" options={{headerShown: false}} component={LearnScreen_StackNavigator}/>
         <Tab.Screen name="Чат" options={{headerShown: false}} component={ChatScreen_StackNavigator}/>
         <Tab.Screen name="Профиль" options={{headerShown: false}} component={ProfileScreen_StackNavigator}/>
 
   </Tab.Navigator>
   )

   
 }

export default function AppNavigation(){
    return(
       
        <NavigationContainer>
           <Bottom_stacknavigator/>
        </NavigationContainer>
       
    )
}