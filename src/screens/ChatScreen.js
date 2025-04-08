import React, { useState, useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import axios from 'axios';
import { Octicons } from '@expo/vector-icons'; // Импортируем иконки

export default function ChatScreen({ navigation }) {
  const [inputText, setInputText] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'ai', text: 'Привет! Хочешь разобраться, что тебе больше всего интересно? Помогу!' },
    { sender: 'user', text: 'Привет! Да, хочу разобраться.' },
    { sender: 'ai', text: 'Давай попробуем выяснить...' },
  ]);
  const [context, setContext] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef(null);

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  const handleSend = async () => {
    if (!inputText.trim()) {
      alert('Введите сообщение!');
      return;
    }

    setIsLoading(true);

    const userMessage = { sender: 'user', text: inputText };
    setChatHistory((prev) => [...prev, userMessage]);
    const updatedContext = `${context}\nПользователь: ${inputText}`;
    setContext(updatedContext);
    setInputText('');
    scrollToBottom();

    try {
      const prompt = `ТОЛЬКО на русском языке. Контекст:\n${updatedContext}`;
      const response = await axios.post('http://192.168.99.74:3000/api/generate', {
        model: 'llama2',
        prompt: prompt,
        stream: false,
      });

      console.log('Полный ответ от сервера:', response.data);
      const aiResponse = response.data.response || 'Нет ответа от нейросети';

      setTimeout(() => {
        const aiMessage = { sender: 'ai', text: aiResponse };
        setChatHistory((prev) => [...prev, aiMessage]);
        setContext(`${updatedContext}\nAI: ${aiResponse}`);
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
  };

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