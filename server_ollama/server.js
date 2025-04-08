const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000; // Порт для Node.js сервера

// Middleware для обработки JSON и CORS
app.use(express.json());
app.use(cors());

// Прокси-маршрут для взаимодействия с Ollama
app.post('/api/generate', async (req, res) => {
  try {
    const { model, prompt, stream } = req.body;

    // Ограничиваем контекст до 500 символов
    // const limitedPrompt = prompt.slice(0, 500);

    // Добавляем инструкцию для ответа на русском языке
    const finalPrompt = `${prompt}`;

    // Отправляем запрос к локальному серверу Ollama
    const response = await axios.post('http://localhost:11434/api/generate', {
      model,
      prompt: finalPrompt,
      stream,
    });

    // Возвращаем ответ от Ollama клиенту
    res.json(response.data);
  } catch (error) {
    console.error('Ошибка при запросе к Ollama:', error.message);
    res.status(500).json({ error: 'Ошибка при запросе к Ollama' });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Node.js сервер запущен на порту ${PORT}`);
});