const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware.verifyToken, authMiddleware.isAdmin, userController.getAllUsers);
router.put('/:id/status', authMiddleware.verifyToken, authMiddleware.isAdmin, userController.updateUserStatus);
router.get('/executions', userController.getUserExecutions);
router.get('/:id', userController.getUserById);
module.exports = router;
