// server.js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

// Создаем Express приложение
const app = express();

// Создаем HTTP сервер, используя Express app как обработчик запросов
const server = http.createServer(app);

// Создаем WebSocket сервер, привязанный к HTTP серверу
const wss = new WebSocket.Server({ server });

// Обслуживаем статические файлы из папки 'public' (если есть)
// app.use(express.static('public'));

// Обработчик подключения нового WebSocket клиента
wss.on('connection', (ws) => {
    console.log('Новый клиент подключился');

    // Отправляем приветственное сообщение клиенту
    ws.send(JSON.stringify({ type: 'welcome', message: 'Добро пожаловать в KChat!' }));

    // Обработчик входящих сообщений от клиента
    ws.on('message', (message) => {
        console.log('Получено сообщение:', message.toString());
        
        try {
            const data = JSON.parse(message.toString());
            
            // Эхо-сообщение всем клиентам (или обработка логики чата)
            // Для примера просто рассылаем всем
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        type: 'message',
                        content: data.content,
                        sender: data.sender || 'Аноним',
                        timestamp: new Date().toISOString()
                    }));
                }
            });
        } catch (err) {
            console.error('Ошибка обработки сообщения:', err);
        }
    });

    // Обработчик закрытия соединения
    ws.on('close', () => {
        console.log('Клиент отключился');
    });
});

// Получаем порт из переменной окружения Render или используем 8080 по умолчанию
const PORT = process.env.PORT || 8080;

// ВАЖНО: Привязываемся к '0.0.0.0', чтобы Render мог получить доступ к серверу
server.listen(PORT, '0.0.0.0', () => {
    console.log(`KChat сервер запущен на порту ${PORT}`);
});
