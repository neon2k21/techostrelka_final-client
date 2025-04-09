import React, { useState, useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import axios from 'axios';
import { Octicons } from '@expo/vector-icons'; // Импортируем иконки
import { ip_address} from "../../config";

export default function ChatScreen({ navigation }) {
  const [inputText, setInputText] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'ai', text: 'Привет! Хочешь разобраться, что тебе больше всего интересно? Помогу!' }
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
    const id = 2; // Предполагается, что ID равен 2
    const url = `${ip_address}/api/getPercent`;
    
    var requestOptions = {
        method: 'GET',
        body: {id:global.id}
    };
    
    fetch(url, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            // Проверяем, что результат — массив и содержит хотя бы один элемент
            if (Array.isArray(result) && result.length > 0) {
                // Извлекаем строку JSON из поля percent_by_topic
                const percentString = result[0].percent_by_topic;
    
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
            } else {
                console.error("Invalid server response:", result);
            }
        })
        .catch(error => console.log('Backend to chatbot error', error));


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

      const response = await axios.post('http://192.168.99.74:3000/api/generate', {
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
    <SafeAreaView style={styles.container}>
      {/* Заголовок */}
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          {/* Аватар */}
          <Image
            source={require('../../assets/mascot.png')} // Убедитесь, что у вас есть изображение в assets
            style={styles.avatar}
          />
          {/* Имя и подпись */}
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>KULTKOD</Text>
            <Text style={styles.profileSubtitle}>чат с ИИ</Text>
          </View>
        </View>
        {/* Кнопка очистки контекста */}
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Очистить контекст</Text>
        </TouchableOpacity>
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
    </SafeAreaView>
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
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#7700FF', // Фиолетовый цвет фона заголовка
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25, // Круглая форма аватара
  },
  profileInfo: {
    marginLeft: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileSubtitle: {
    fontSize: 14,
    color: '#f0f0f0',
  },
  clearButton: {
    padding: 5,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
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
    backgroundColor: '#dcf8c6',
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