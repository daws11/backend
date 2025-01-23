require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const createConnection = require('./config/db');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const homeRoutes = require('./routes/homeRoutes'); // Import home routes

const path = require('path');
const Chat = require('./models/chatModel');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ['https://lensync.netlify.app', 'http://localhost:3000'], // Allow specific origins
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
  }
});
const PORT = process.env.PORT || 3973;

// Configure CORS
const corsOptions = {
  origin: ['https://lensync.netlify.app', 'http://localhost:3000'], // Allow specific origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', taskRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/home', homeRoutes); // Use home routes

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send(`Server is running on port ${PORT}`);
});

// Check database connection endpoint
app.get('/check-db-connection', async (req, res) => {
  try {
    const connection = await createConnection();
    const [rows] = await connection.query('SELECT 1');
    res.status(200).send('Database connection successful');
  } catch (err) {
    console.error('Database connection failed:', err);
    res.status(500).send('Database connection failed');
  }
});

// Initialize database connection
let connection;
(async () => {
  try {
    connection = await createConnection();
    console.log('Database connection established');
    // Start server after DB connection is established
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
})();

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinProject', (projectId) => {
    socket.join(projectId);
    console.log(`Client joined project: ${projectId}`);
  });

  socket.on('sendMessage', async (message) => {
    const { projectId, userId, text } = message;
    const newMessage = {
      project_id: projectId,
      user_id: userId,
      message: text,
      created_at: new Date()
    };
    try {
      await connection.query(
        'INSERT INTO chats SET ?',
        [newMessage]
      );
      io.to(projectId).emit('receiveMessage', newMessage);
    } catch (err) {
      console.error('Failed to save message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});