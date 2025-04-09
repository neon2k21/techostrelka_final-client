import AppNavigation from "./src/navigation";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from 'expo-font';



export default function App() {
  const [fontsLoaded] = useFonts({
    'Regular': require('./fonts/BasisGrotesquePro-Regular.ttf'),
    'Medium': require('./fonts/BasisGrotesquePro-Medium.ttf'),
    'Bold': require('./fonts/BasisGrotesquePro-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return null; // Пока шрифты загружаются, ничего не отображаем
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} className="w-full h-full">
    <AppNavigation/>
 </GestureHandlerRootView>
  );
}