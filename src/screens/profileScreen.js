import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Используем иконки из Expo
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const user = {
    name: "Максим Шепелев",
    points: 100,
    interests: ["искусство", "история", "традиции", "изобретения"],
    viewedCourses: [
      {
        title: "История Технострелки",
        category: "история",
      },
    ],
    completedQuizzes: [],
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Заголовок */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.name}>{global.name}</Text>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="pencil" size={20} color="#6A5ACD" />
          </TouchableOpacity>
        </View>
        <View style={styles.pointsContainer}>
          <Text style={styles.points}>{global.points}</Text>
          <Ionicons name="ios-arrow-up" size={20} color="#0" />
        </View>
      </View>

      {/* Выбранные интересы */}
      <View style={styles.interestsContainer}>
        <Text style={styles.sectionTitle}>выбранные интересы:</Text>
        <View style={styles.tagsContainer}>
          {user.interests.map((interest, index) => (
            <Text key={index} style={styles.tag}>
              {interest}
            </Text>
          ))}
        </View>
      </View>

      <View style={{backgroundColor: '#fff', flex: 1}}>
            {/* Просмотренные курсы */}
        <View style={styles.section}>
            <View style={styles.card}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Просмотренные курсы</Text>
                    <Ionicons name="ios-arrow-forward" size={20} color="#0" />
                </View>
            </View>
        </View>

        {/* Пройденные квизы */}
        <View style={styles.section}>
            <View style={styles.card}>    
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Пройденные квизы</Text>
                    <Ionicons name="ios-arrow-forward" size={20} color="#0" />
                </View>
            </View>
        </View>

        {/* Вам может понравиться */}
        <View style={styles.section}>
            <View style={styles.card}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>вам может понравится</Text>
                    <Ionicons name="ios-arrow-forward" size={20} color="#0" />
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

  // Интересы
  interestsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
    color: '#90969F',
  },
  tagsContainer: {
    flexDirection: "row",
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

  // Секции
  section: {
    marginBottom: 20,
    borderColor: '#F3F3F4',
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