import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Modal,
} from "react-native";
import axios from "axios"; // Импортируем axios
import { ip_address } from "../../config";

export default function QuezScreen({ route, navigation }) {
  const { kvizData } = route.params; // Данные квиза, переданные через параметры
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Индекс текущего вопроса
  const [score, setScore] = useState(0); // Счет пользователя
  const [quizEnded, setQuizEnded] = useState(false); // Флаг окончания квиза
  const [questions, setQuestions] = useState([]); // Массив вопросов
  const [loading, setLoading] = useState(true); // Флаг загрузки
  const [isModalVisible, setIsModalVisible] = useState(false); // Состояние для модального окна (ошибка загрузки)
  const [isSaveScoreErrorModalVisible, setIsSaveScoreErrorModalVisible] =
    useState(false); // Состояние для модального окна (ошибка сохранения баллов)

  // Функция для получения вопросов с сервера
  const fetchQuestions = async () => {
    try {
      const response = await axios.post(`${ip_address}/api/getPageKviz`, {
        id: kvizData.id, // Передаем ID квиза
      });
      const data = response.data;

      if (data && data[0] && data[0].questions) {
        // Преобразуем строку JSON в массив объектов
        const parsedQuestions = JSON.parse(data[0].questions);
        setQuestions(parsedQuestions); // Сохраняем вопросы
      } else {
        throw new Error("Invalid data format");
      }

      setLoading(false); // Загрузка завершена
    } catch (error) {
      console.error("Error fetching questions:", error);

      // Проверяем, является ли ошибка сообщением о завершении квиза
      if (
        error.response &&
        error.response.data &&
        error.response.data.message === "Пользователь уже завершил этот квиз"
      ) {
        setIsModalVisible(true); // Показываем модальное окно
      } else {
        Alert.alert("Ошибка", "Не удалось загрузить вопросы.");
      }

      setLoading(false); // Загрузка завершена с ошибкой
    }
  };

  // Загружаем вопросы при монтировании компонента
  useEffect(() => {
    fetchQuestions();
  }, []);

  // Функция для обработки ответа
  const handleAnswerPress = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1); // Увеличиваем счет, если ответ правильный
    }

    // Переход к следующему вопросу
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizEnded(true); // Заканчиваем квиз
    }
  };

  // Функция для записи очков в базу данных
  const saveScoreToDatabase = async () => {
    try {
      const response = await axios.post(`${ip_address}/api/completekviz`, {
        user_id: global.id, // ID 
        kviz_id: kvizData.id,
      });
      console.log(response.data);
    } catch (error) {
      Alert.alert('Произошла ошибка', 'Вы уже прошли этот квиз!');
      setIsSaveScoreErrorModalVisible(true); // Показываем модальное окно
    }
  };

  // Автоматическая отправка баллов при успешном прохождении
  useEffect(() => {
    if (quizEnded && score === questions.length) {
      saveScoreToDatabase(); // Автоматически отправляем баллы на сервер
    }
  }, [quizEnded]);

  // Рендеринг экрана
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Загрузка вопросов...</Text>
      </View>
    );
  }

  if (quizEnded) {
    const isSuccessful = score === questions.length; // Проверка на успешное прохождение

    return (
      <View style={styles.container}>
        {/* Картинка */}
        <Image
          source={
            isSuccessful
              ? require("../../assets/right.png")
              : require("../../assets/cancel.png")
          }
          style={styles.resultImage}
        />

        {/* Текст с результатами */}
        <Text style={styles.resultText}>
          {isSuccessful
            ? `Вы набрали ${score} / ${questions.length} балла!`
            : `Вы набрали ${score} / ${questions.length} балла`}
        </Text>

        {/* Надпись */}
        <Text style={styles.resultStatus}>
          {isSuccessful ? "Тест завершен!" : "Этого недостаточно."}
        </Text>

        {/* Кнопка выхода */}
        <TouchableOpacity
          style={[styles.exitButton, styles.bottomButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.exitButtonText}>Выйти</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <View style={styles.container}>
      {/* Модальное окно для ошибки загрузки */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Сообщение</Text>
            <Text style={styles.modalMessage}>
              Вы уже завершили этот квиз.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setIsModalVisible(false);
                navigation.goBack(); // Возвращаемся назад после закрытия модального окна
              }}
            >
              <Text style={styles.modalButtonText}>ОК</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Модальное окно для ошибки сохранения баллов */}
      <Modal
        visible={isSaveScoreErrorModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsSaveScoreErrorModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ошибка</Text>
            <Text style={styles.modalMessage}>
              Не удалось сохранить баллы. Попробуйте позже.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setIsSaveScoreErrorModalVisible(false);
                navigation.goBack(); // Возвращаемся назад после закрытия модального окна
              }}
            >
              <Text style={styles.modalButtonText}>ОК</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Верхняя панель с названием квиза и кнопкой выхода */}
      <View style={styles.headerContainer}>
        {/* Название квиза */}
        <Text style={styles.quizTitle}>{kvizData.name}</Text>

        {/* Кнопка выхода */}
        <TouchableOpacity
          style={styles.exitButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.exitButtonText}>Выйти</Text>
        </TouchableOpacity>
      </View>

      {/* Текущий вопрос */}
      <Text style={styles.questionText}>{currentQuestion.text}</Text>

      {/* Варианты ответов */}
      <View style={styles.answersContainer}>
        {currentQuestion && currentQuestion.options ? (
          <View style={styles.answerGrid}>
            {currentQuestion.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.answerButton,
                  option.isCorrect && styles.correctAnswerButton,
                ]}
                onPress={() => handleAnswerPress(option.isCorrect)}
              >
                <Text style={styles.answerText}>{option.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Text style={styles.loadingText}>Загрузка вариантов ответов...</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center", // Центрируем содержимое по центру
  },
  headerContainer: {
    marginTop: 40,
    flexDirection: "row", // Размещаем элементы в строку
    justifyContent: "space-between", // Распределяем элементы по ширине
    alignItems: "center", // Выравниваем элементы по центру по вертикали
    marginBottom: 0, // Отступ снизу
  },
  quizTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left", // Текст выровнен по левому краю
    color: "#333",
    flex: 1, // Занимает доступное пространство
  },
  exitButton: {
    marginLeft: 10, // Отступ между кнопкой и текстом
  },
  exitButtonText: {
    fontSize: 16,
    color: "#FF4F12",
    fontWeight: "bold",
  },
  questionText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20, // Добавлен отступ сверху
    marginBottom: 20,
    color: "#333",
  },
  answersContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center", // Центрируем контейнер с кнопками
  },
  answerGrid: {
    flexDirection: "row", // Размещаем кнопки в строку
    flexWrap: "wrap", // Переносим кнопки на новую строку, если не помещаются
    width: "100%", // Занимаем всю доступную ширину
    justifyContent: "space-between", // Распределяем кнопки равномерно
  },
  answerButton: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
    width: "48%", // Каждая кнопка занимает ~48% ширины контейнера
  },
  correctAnswerButton: {
    backgroundColor: "#d4edda", // Цвет фона для правильного ответа
    borderColor: "#155724",
    borderWidth: 1,
  },
  answerText: {
    fontSize: 16,
    color: "#333",
  },
  resultImage: {
    width: 200, // Ширина картинки
    height: 200, // Высота картинки
    resizeMode: "contain", // Сохраняем пропорции изображения
    marginBottom: 20, // Отступ снизу
  },
  resultText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  resultStatus: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  bottomButton: {
    position: "absolute",
    bottom: 20, // Расположение кнопки внизу экрана
    alignSelf: "center", // Центрируем кнопку по горизонтали
    width: "80%", // Кнопка занимает 80% ширины экрана
    padding: 15,
    backgroundColor: "#FF4F12",
    borderRadius: 5,
    alignItems: "center",
  },
  exitButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
    color: "#333",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Полупрозрачный фон
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  modalMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  modalButton: {
    backgroundColor: "#FF4F12",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
  },
  modalButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});