const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000", // 클라이언트의 주소를 입력합니다.
        methods: ["GET", "POST"]
    }
});

app.use(cors());

io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  socket.on('sendMessage', (message) => {
      console.log('Message received:', message);
      io.emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
      console.log(`A user disconnected: ${socket.id}`);
  });
});

const PORT = 10004;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
