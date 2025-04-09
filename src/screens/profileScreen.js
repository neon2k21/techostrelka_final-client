import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome"; // Импортируем FontAwesomeimport { SafeAreaView } from "react-native-safe-area-context";
import { ip_address } from "../../config";
import { SafeAreaView } from "react-native-safe-area-context";


export default function ProfileScreen() {
  const [filters, setFilters] = useState([]); // Массив фильтров (интересов)

  // Функция для получения фильтров из API
  const getAllFilters = async () => {
    try {
      const response = await fetch(ip_address + '/api/getAllTopic');
      const data = await response.json(); // Получаем данные из API

      // Создаём новый массив с изменёнными объектами
      const updatedArray = data.map((item) =>
        item.name === "научные изобретения"
          ? { ...item, name: "изобретения" } // Обновляем только свойство name
          : item // Оставляем объект без изменений
      );

      setFilters(updatedArray); // Обновляем состояние
    } catch (error) {
      console.error('Error fetching filters:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить интересы');
    }
  };

  useEffect(() => {
    getAllFilters(); // Загружаем фильтры при монтировании компонента
  }, []);

  // Функция для получения массива интересов из глобальных переменных
  const getInterests = () => {
    const interests = [];

    // Проверяем каждую глобальную переменную и подставляем name из filters
    if (global.topic1_id !== null) {
      const topic1 = filters.find((filter) => filter.id === global.topic1_id);
      if (topic1) interests.push(topic1.name);
    }
    if (global.topic2_id !== null) {
      const topic2 = filters.find((filter) => filter.id === global.topic2_id);
      if (topic2) interests.push(topic2.name);
    }
    if (global.topic3_id !== null) {
      const topic3 = filters.find((filter) => filter.id === global.topic3_id);
      if (topic3) interests.push(topic3.name);
    }
    if (global.topic4_id !== null) {
      const topic4 = filters.find((filter) => filter.id === global.topic4_id);
      if (topic4) interests.push(topic4.name);
    }

    return interests;
  };

  const user = {
    name: "Максим Шепелев",
    points: 100,
    viewedCourses: [
      {
        title: "История Технострелки",
        category: "история",
      },
    ],
    completedQuizzes: [],
  };

  // Получаем массив интересов
  const interests = getInterests();

  return (
    <SafeAreaView style={styles.container}>
      {/* Заголовок */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.name}>{global.name}</Text>
          <TouchableOpacity style={styles.editButton}>
          <FontAwesome name="pencil-square-o" size={20} color="#6A5ACD" /> {/* Значок карандаша */}
          </TouchableOpacity>
        </View>
        <View style={styles.pointsContainer}>
          <Text style={styles.points}>{global.points}</Text>
          <Image
            source={require("../../assets/point.png")} // Путь к изображению валюты
            style={styles.currencyImage}
          />
        </View>
      </View>

      {/* Выбранные интересы */}
      <View style={styles.interestsContainer}>
        <Text style={styles.sectionTitle}>выбранные интересы:</Text>
        <View style={styles.tagsContainer}>
          {interests.map((interest, index) => (
            <Text key={index} style={styles.tag}>
              {interest}
            </Text>
          ))}
        </View>
      </View>

      <View style={{ backgroundColor: "#fff", flex: 1 }}>
        {/* Просмотренные курсы */}
        <View style={styles.section}>
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Просмотренные курсы</Text>
              <Icon name="arrow-forward" size={20} color="#FF4F12" /> {/* Стрелка вправо */}
            </View>
          </View>
        </View>

        {/* Пройденные квизы */}
        <View style={styles.section}>
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Пройденные квизы</Text>
              <Icon name="arrow-forward" size={20} color="#FF4F12" /> {/* Стрелка вправо */}
            </View>
          </View>
        </View>

        {/* Вам может понравиться */}
        <View style={styles.section}>
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>вам может понравится</Text>
              <Icon name="arrow-forward" size={20} color="#FF4F12" /> {/* Стрелка вправо */}
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    padding: 20,
  },

  // Заголовок
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  editButton: {
    marginLeft: 10,
  },
  pointsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  points: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 5,
  },
  currencyImage: {
    width: 20, // Размер изображения валюты
    height: 20,
    resizeMode: "contain", // Сохраняем пропорции изображения
  },
  interestsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#90969F",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap", // Добавляем перенос строк для тегов
  },
  tag: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginRight: 5,
    marginBottom: 5,
    fontSize: 12,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 20,
    borderColor: "#F3F3F4",
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 5,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  courseCategory: {
    fontSize: 14,
    color: "#FF9800",
  },
  moreButton: {
    position: "absolute",
    right: 10,
    top: 10,
    backgroundColor: "#FF9800",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  moreButtonText: {
    color: "white",
    fontSize: 14,
  },
});