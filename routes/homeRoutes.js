const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

router.get('/project-names', homeController.getProjectNames);
router.get('/projects/:id/tasks', homeController.getTasksByProjectId);


module.exports = router;