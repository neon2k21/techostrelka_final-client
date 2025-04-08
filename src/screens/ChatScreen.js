import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ScrollView } from 'react-native';

export default function ChatScreen({ navigation }) {
  const [inputText, setInputText] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleSend = () => {
    if (!inputText.trim()) {
      alert('Введите сообщение!');
      return;
    }

    setChatHistory((prev) => [...prev, { sender: 'user', text: inputText }]);
    setInputText('');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.chatContainer}>
        {chatHistory.map((message, index) => (
          <View key={index} style={styles.messageContainer}>
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
        />
        <Button title="Отправить" onPress={handleSend} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  chatContainer: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
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
});