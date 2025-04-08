import React, { useState, useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TextInput, Button, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';

export default function ChatScreen({ navigation }) {
  const [inputText, setInputText] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'ai', text: 'Привет! Хочешь разобраться, что тебе больше всего интересно? Помогу!' },
    { sender: 'user', text: 'Привет! Да, хочу разобраться.' },
    { sender: 'ai', text: 'Давай попробуем выяснить. Представь, что ты идешь по огромному музею. Какой зал ты хотел бы посетить первым: с картинами великих художников, с экспозицией древних артефактов, с моделями научных изобретений или с рассказами о культурных обычаях разных народов?' },
    { sender: 'user', text: 'Наверное, сначала я бы заглянул в зал с древними артефактами.' },
    { sender: 'ai', text: 'Отлично! Это может говорить о твоем интересе к истории. А если бы тебе предложили провести вечер за чтением книги, какую бы ты выбрал: биографию ученого, сборник народных сказаний, альбом с репродукциями известных картин или исследование о том, как появились определенные традиции?' },
    { sender: 'user', text: 'Наверное, сборник народных сказаний.' },
    { sender: 'ai', text: 'Значит, тебя также привлекает тема традиций! Теперь представь, что тебе нужно сделать проект. Темы такие: проанализировать влияние искусства на общество, рассказать о важнейших научных открытиях, разобрать эволюцию праздников или исследовать причины исторических событий. Что бы ты выбрал?' },
    { sender: 'user', text: 'Возможно, проанализировать влияние искусства.' },
    { sender: 'ai', text: 'Вот мы и нашли еще одну категорию — искусство! А что насчет научных изобретений? Тебя увлекают технологии будущего или это не твое?' },
    { sender: 'user', text: 'Ну, технологии будущего звучат интересно, но все-таки мне ближе что-то другое.' },
    { sender: 'ai', text: 'Понял! В таком случае, основные категории твоих интересов — это история, традиции и искусство. Научные изобретения пока не в приоритете, и это нормально. Каждый человек уникален! :)' },
    { sender: 'user', text: 'Спасибо! Теперь стало намного понятнее.' },
    { sender: 'ai', text: 'Рад был помочь! Если захочешь углубиться в любую из этих тем, обращайся. Удачи в новых открытиях! :)' },
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
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClear}
        >
          <Text style={styles.clearButtonText}>X</Text>
        </TouchableOpacity>
      </View>

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

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Введите сообщение..."
          value={inputText}
          onChangeText={setInputText}
          editable={!isLoading}
        />
        <Button title="Отправить" onPress={handleSend} disabled={isLoading} />
      </View>

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
    justifyContent: 'flex-end',
    marginBottom: 10,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  clearButton: {
    width: 30,
    height: 30,
    backgroundColor: '#ff4d4d',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
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