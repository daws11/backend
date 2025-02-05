const db = require("../config/db");

// Get all tasks for a project
exports.getTasks = (req, res) => {
  const { projectId } = req.params;

  const query = `
    SELECT 
      tasks.id, 
      tasks.text, 
      DATE_FORMAT(tasks.start_date, '%Y-%m-%d %H:%i:%s') AS start_date,
      DATE_FORMAT(tasks.end_date, '%Y-%m-%d %H:%i:%s') AS end_date,
      tasks.duration,
      tasks.parent_id AS parent,
      tasks.progress,
      tasks.assigned_to,
      tasks.priority,
      users.name AS assigned_to_name
    FROM tasks
    LEFT JOIN users ON tasks.assigned_to = users.id
    WHERE tasks.project_id = ?
  `;

  db.query(query, [projectId], (err, tasks) => {
    if (err) {
      console.error("Failed to fetch tasks:", err);
      return res.status(500).send("Server error");
    }
    res.status(200).json({ data: tasks });
  });
};

// Create a new task
exports.createTask = (req, res) => {
  const { projectId } = req.params;

  const taskData = {
    text: req.body.text || "New task",
    start_date: req.body.start_date ? new Date(req.body.start_date) : null,
    end_date: req.body.end_date ? new Date(req.body.end_date) : null,
    duration: parseInt(req.body.duration, 10) || 1,
    progress: parseFloat(req.body.progress) || 0.0,
    project_id: projectId,
    parent_id: req.body.parent_id || null,
    assigned_to: req.body.assigned_to || null, // Ensure this field is included
    priority: req.body.priority || "2" // Default to Normal priority
  };

  if (!taskData.text || !taskData.start_date || !taskData.duration) {
    return res.status(400).json({ error: "Invalid task data" });
  }

  const query = `
    INSERT INTO tasks (text, start_date, end_date, duration, progress, project_id, parent_id, assigned_to, priority)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    taskData.text,
    taskData.start_date,
    taskData.end_date,
    taskData.duration,
    taskData.progress,
    taskData.project_id,
    taskData.parent_id,
    taskData.assigned_to, // Ensure this value is included
    taskData.priority
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Failed to create task:", err);
      return res.status(500).json({ error: "Failed to create task" });
    }

    res.status(201).json({
      id: result.insertId,
      ...taskData,
      start_date: taskData.start_date.toISOString().slice(0, 19).replace("T", " "),
      end_date: taskData.end_date
        ? taskData.end_date.toISOString().slice(0, 19).replace("T", " ")
        : null,
    });
  });
};

// Update a task by ID
exports.updateTask = (req, res) => {
  const { taskId } = req.params;

  const taskData = {
    text: req.body.text,
    start_date: req.body.start_date ? new Date(req.body.start_date) : null,
    end_date: req.body.end_date ? new Date(req.body.end_date) : null,
    duration: parseInt(req.body.duration, 10) || 1,
    progress: parseFloat(req.body.progress) || 0.0,
    assigned_to: req.body.assigned_to || null, // Ensure this field is included
    priority: req.body.priority
  };

  if (!taskData.text || !taskData.start_date || !taskData.duration) {
    return res.status(400).json({ error: "Invalid task data" });
  }

  const query = `
    UPDATE tasks 
    SET text = ?, start_date = ?, end_date = ?, duration = ?, progress = ?, assigned_to = ?, priority = ?
    WHERE id = ?
  `;
  const values = [
    taskData.text,
    taskData.start_date,
    taskData.end_date,
    taskData.duration,
    taskData.progress,
    taskData.assigned_to, // Ensure this value is included
    taskData.priority,
    taskId,
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Failed to update task:", err);
      return res.status(500).json({ error: "Failed to update task" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json({
      id: taskId,
      ...taskData,
      start_date: taskData.start_date.toISOString().slice(0, 19).replace("T", " "),
      end_date: taskData.end_date
        ? taskData.end_date.toISOString().slice(0, 19).replace("T", " ")
        : null,
    });
  });
};

// Delete a task by ID
exports.deleteTask = (req, res) => {
  const { taskId } = req.params;

  const query = "DELETE FROM tasks WHERE id = ?";
  db.query(query, [taskId], (err, result) => {
    if (err) {
      console.error("Failed to delete task:", err);
      return res.status(500).json({ error: "Failed to delete task" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json({ message: `Task with id ${taskId} deleted.` });
  });
};