import React, { useState, useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import axios from 'axios';
import { Octicons } from '@expo/vector-icons'; // Импортируем иконки
import { ip_address} from "../../config";
import { ollama2_adress} from "../../config";
import { heightPercentageToDP } from 'react-native-responsive-screen';


export default function ChatScreen({ navigation }) {
  const [inputText, setInputText] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'ai', text: 'Привет! Я здесь, чтобы помочь тебе найти фильмы, которые тебе понравятся. Расскажи, какие жанры тебя интересуют?' },
    { sender: 'user', text: 'Привет! Мне нравятся фантастика и приключения.' },
    { sender: 'ai', text: 'Отлично! А есть ли конкретные актёры или режиссёры, которых ты особенно любишь?' },
    { sender: 'user', text: 'Да, мне нравятся фильмы с Леонардо Ди Каприо.' },
    { sender: 'ai', text: 'Понял! А как насчёт продолжительности фильма? Тебе больше нравятся короткие фильмы (меньше 2 часов) или длинные эпические истории?' },
    { sender: 'user', text: 'Думаю, длинные фильмы — это здорово!' },
    { sender: 'ai', text: 'Замечательно! Ещё один вопрос: ты предпочитаешь старые классические фильмы или современные новинки?' },
    { sender: 'user', text: 'Скорее современные новинки.' },
    { sender: 'ai', text: 'Спасибо за ответы! Теперь я знаю, что тебе нравятся современные фильмы в жанре фантастики и приключений с Леонардо Ди Каприо, а также длинные эпические истории. Сейчас подберу подходящие рекомендации!' },
  ]);
  const [context, setContext] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [interests, setInterests] = useState({ science: 0, history: 0, culture: 0, traditions: 0 });
  const scrollViewRef = useRef(null);

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  const analyzeInterests = (text) => {
    const keywords = {
      science: ['наука', 'технологии', 'изобретения', 'будущее', 'исследование'],
      history: ['история', 'древний', 'артефакты', 'прошлое', 'события'],
      culture: ['культура', 'искусство', 'музей', 'картины', 'творчество'],
      traditions: ['традиции', 'обычаи', 'праздники', 'ритуалы', 'культурные'],
    };

    const scores = { science: 0, history: 0, culture: 0, traditions: 0 };

    for (const category in keywords) {
      keywords[category].forEach((keyword) => {
        if (text.toLowerCase().includes(keyword)) {
          scores[category] += 1;
        }
      });
    }

    return scores;
  };

  const updateInterests = (newScores) => {
    setInterests((prev) => ({
      science: prev.science + newScores.science,
      history: prev.history + newScores.history,
      culture: prev.culture + newScores.culture,
      traditions: prev.traditions + newScores.traditions,
    }));
  };

  const calculatePercentages = () => {
    const total = interests.science + interests.history + interests.culture + interests.traditions;
    if (total === 0) return { science: 0, history: 0, culture: 0, traditions: 0 };
    console.log("История - "+interests.history+"%, Наука - "+interests.science+"%, Культура - "+interests.culture+"%, Традиции - "+interests.traditions+"%.")


    const percentagesBackend = { "исскуство": 0, "научные изобретения": 0, "традиции": 0, "история": 0 };

    // Формируем URL с параметром id
    const url = `${ip_address}/api/getPercent`;
    
    var requestOptions = {
        method: 'GET',
        body: {id:global.id}
    };
    const response = axios.post(`${ip_address}/api/getPercent`, {
      id: global.id, // Передаем ID квиза
    }).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      console.log("back response - "+response.json())
      return response.json();
    }).then(result => {
        // Проверяем, что результат — массив и содержит хотя бы один элемент
        const percentString = result.percent_by_topic;

        // Преобразуем строку JSON в объект JavaScript
        const parsedPercentages = JSON.parse(percentString);

        // Обновляем значения в percentagesBackend
        percentagesBackend.исскуство = parsedPercentages.исскуство;
        percentagesBackend['научные изобретения'] = parsedPercentages['научные изобретения'];
        percentagesBackend.традиции = parsedPercentages.традиции;
        percentagesBackend.история = parsedPercentages.история;

        // Логируем обновленные значения
        console.log(
            `"${percentagesBackend.исскуство},${percentagesBackend['научные изобретения']},${percentagesBackend.традиции},${percentagesBackend.история}"`
        );
    }).catch(error => console.log('Backend to chatbot error', error));


    return {
      science: ((interests.science / total) * 100).toFixed(1),
      history: ((interests.history / total) * 100).toFixed(1),
      culture: ((interests.culture / total) * 100).toFixed(1),
      traditions: ((interests.traditions / total) * 100).toFixed(1),
    };
  };

  const handleSend = async () => {
    if (!inputText.trim()) {
      alert('Введите сообщение!');
      return;
    }

    setIsLoading(true);

    const userMessage = { sender: 'user', text: inputText };
    setChatHistory((prev) => [...prev, userMessage]);

    const MAX_CONTEXT_LENGTH = 5; // Ограничение контекста
    const updatedContext = chatHistory
      .slice(-MAX_CONTEXT_LENGTH)
      .map((msg) => `${msg.sender === 'user' ? 'Пользователь' : 'AI'}: ${msg.text}`)
      .join('\n');

    setContext(updatedContext);
    setInputText('');

    // Анализируем интересы пользователя
    const userScores = analyzeInterests(inputText);
    updateInterests(userScores);

    scrollToBottom();

    try {
      const prompt = `
Контекст: ${updatedContext}

Инструкции:
1. Ответ должен быть ТОЛЬКО на русском языке.
2. Ответ должен быть кратким и понятным.
3. Не используйте английские слова или фразы.

Ответ:`;

      const response = await axios.post(`${ollama2_adress}/api/generate`, {
        model: 'llama2',
        prompt: prompt,
        max_tokens: 50, // Ограничение длины ответа
        temperature: 0.5, // Уменьшение случайности
        top_p: 0.8, // Ограничение выборки токенов
        stream: false,
      });

      console.log('Полный ответ от сервера:', response.data);
      let aiResponse = response.data.response || 'Нет ответа от нейросети';

      // Проверка языка ответа
      const isRussianText = (text) => {
        const russianRegex = /[а-яА-ЯёЁ]/;
        return russianRegex.test(text);
      };

      if (!isRussianText(aiResponse)) {
        aiResponse = 'Извините, я могу отвечать только на русском языке.';
      }

      setTimeout(() => {
        const aiMessage = { sender: 'ai', text: aiResponse };
        setChatHistory((prev) => [...prev, aiMessage]);
        setContext(`${updatedContext}\nAI: ${aiResponse}`);

        // Анализируем интересы AI
        const aiScores = analyzeInterests(aiResponse);
        updateInterests(aiScores);

        scrollToBottom();
      }, 1000);
    } catch (error) {
      console.error('Ошибка при запросе к нейросети:', error.message);
      alert('Не удалось получить ответ от нейросети.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setChatHistory([]);
    setContext('');
    setInterests({ science: 0, history: 0, culture: 0, traditions: 0 });
  };

  const percentages = calculatePercentages();
  global.percentages = percentages;
  console.log("История - "+percentages.history+"%, Наука - "+percentages.science+"%, Культура - "+percentages.culture+"%, Традиции - "+percentages.traditions+"%.")

  return (
    <View style={styles.container}>
      {/* Заголовок */}
      <View style={styles.headerContainer}>
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          {/* Аватар */}
          <Image
            source={require('../../assets/avaKult.png')} // Убедитесь, что у вас есть изображение в assets
            style={styles.avatar}
          />
          {/* Имя и подпись */}
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>KULTKOD</Text>
            <Text style={styles.profileSubtitle}>чат с ии</Text>
          </View>
        </View>
        {/* Кнопка очистки контекста */}
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>очистить</Text>
          <Text style={[styles.clearButtonText, {marginTop:-5}]}>контекст</Text>
        </TouchableOpacity>
      </View>
      </View>

      {/* Лента чата */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatContainer}
      >
        {chatHistory.map((message, index) => (
          <View
            key={index}
            style={[
              styles.messageContainer,
              message.sender === 'user' ? styles.userMessage : styles.aiMessage,
            ]}
          >
            <Text>{message.text}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Поле ввода и иконка отправки */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Введите сообщение..."
          value={inputText}
          onChangeText={setInputText}
          editable={!isLoading}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSend}
          disabled={isLoading}
        >
          <Octicons
            name="paper-airplane"
            size={24}
            color="#FF4F12"
          />
        </TouchableOpacity>
      </View>

      {/* Индикатор загрузки */}
      {isLoading && (
        <Text style={styles.loadingText}>Загрузка...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#7700FF', // Фиолетовый цвет фона заголовка,
    marginTop:heightPercentageToDP(5.5)

  },
  headerContainer:{
    height:heightPercentageToDP(12),
    backgroundColor: '#7700FF', // Фиолетовый цвет фона заголовка,\
    borderBottomEndRadius:5,
    borderBottomStartRadius:5,

  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 25, // Круглая форма аватара
  },
  profileInfo: {
    marginLeft: 10,
  },
  profileName: {
    fontSize: 18,
    color: '#fff',
    fontFamily:'Bold'
  },
  profileSubtitle: {
    fontSize: 12,
    color: '#fff',
    fontFamily:'Regular',
    marginTop:-5
  },
  clearButton: {
    padding: 5,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 12,
    fontFamily:'Bold'
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Светлый фон для поля ввода
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    height: 40,
  },
  sendButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFCAB7',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e9ecef',
  },
  loadingText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 5,
  },
});