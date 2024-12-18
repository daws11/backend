const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const linkController = require("../controllers/linkController");

// Task Routes
router.get("/:projectId/tasks", taskController.getTasks); // Get all tasks for a project
router.post("/:projectId/tasks", taskController.createTask); // Create a new task
router.put("/:projectId/tasks/:taskId", taskController.updateTask); // Update a task by ID
router.delete("/:projectId/tasks/:taskId", taskController.deleteTask); // Delete a task by ID

// Link Routes
router.get("/:projectId/links", linkController.getLinks); // Get all links for a project
router.post("/:projectId/links", linkController.createLink); // Create a new link
router.delete("/:projectId/links/:linkId", linkController.deleteLink); // Delete a link by ID

module.exports = router;
