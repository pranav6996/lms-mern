const express = require('express');
const router = express.Router();
const { getConversations, createConversation, getMessages, sendMessage } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/conversations', getConversations);
router.post('/conversations', createConversation);
router.get('/messages/:conversationId', getMessages);
router.post('/messages', sendMessage);

module.exports = router;
