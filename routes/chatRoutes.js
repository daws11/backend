const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.get('/:projectId', chatController.getChatsByProjectId);
router.post('/', chatController.upload, chatController.createChat);

module.exports = router;