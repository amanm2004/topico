 require('dotenv').config({ path: __dirname + '/.env' });
  const express = require('express');
  const http = require('http');
  const { Server } = require('socket.io');
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  const cors = require('cors');

  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: { origin: 'http://localhost:5173', methods: ['GET','POST'] }
  });

  app.use(cors());
  app.use(express.json());

  const port = process.env.PORT || 5000;
  let words = [];

  // ✅ Initialize Gemini
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // or gemini-pro

  async function generateTopic(words) {
    const prompt = `Two users gave these words: ${words.join(", ")}. Generate a fun, engaging topic they can discuss and have a light conversations,make it short.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }

  app.post('/submit-word', async (req, res) => {
    const { word } = req.body;
    words.push(word.trim());
    console.log("Words so far:", words);

    if (words.length >= 2) {
      try {
        const topic = await generateTopic(words);
        io.emit('topic', topic);
        words = [];
      } catch (err) {
        console.error("Error generating topic:", err);
      }
    }
    res.sendStatus(200);
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    socket.on('disconnect', () => console.log('User disconnected:', socket.id));
  });

  server.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
  });

 
