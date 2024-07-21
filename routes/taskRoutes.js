const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// CRUD operations for tasks
router.get('/:projectId/tasks', taskController.getTasks);
router.post('/:projectId/tasks', taskController.createTask);
router.put('/:projectId/tasks/:taskId', taskController.updateTask);
router.delete('/:projectId/tasks/:taskId', taskController.deleteTask);

module.exports = router;
