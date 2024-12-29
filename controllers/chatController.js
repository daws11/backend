const Chat = require('../models/chatModel');
const multer = require('multer');
const path = require('path');

// Konfigurasi multer untuk menyimpan file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

exports.getChatsByProjectId = (req, res) => {
  const { projectId } = req.params;
  if (!projectId) {
    return res.status(400).send('Project ID is required');
  }
  Chat.findByProjectId(projectId, (err, chats) => {
    if (err) {
      console.error('Failed to fetch chats:', err);
      return res.status(500).send('Server error');
    }
    res.status(200).json(chats);
  });
};

exports.createChat = (req, res) => {
  const { projectId, userId, message, userName } = req.body;
  const mediaUrl = req.file ? `/uploads/${req.file.filename}` : null;
  const mediaType = req.file ? req.file.mimetype.split('/')[0] : null;

  if (!projectId || !userId || (!message && !mediaUrl) || !userName) {
    return res.status(400).send('Project ID, User ID, User Name, and message or media are required');
  }

  const newMessage = {
    project_id: projectId,
    user_id: userId,
    message,
    media_url: mediaUrl,
    media_type: mediaType,
    created_at: new Date()
  };

  Chat.create(newMessage, (err, result) => {
    if (err) {
      console.error('Failed to create chat:', err);
      return res.status(500).send('Server error');
    }
    res.status(201).json(result);
  });
};

exports.upload = upload.single('media');