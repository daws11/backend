const Task = require("../models/taskModel");
const { format } = require("date-fns");

exports.getTasks = (req, res) => {
  const { projectId } = req.params;
  Task.findByProjectId(projectId, (err, tasks) => {
    if (err) {
      console.error("Failed to fetch tasks:", err);
      return res.status(500).send("Server error");
    }
    const formattedTasks = tasks.map((task) => ({
      ...task,
      start_date: new Date(task.start_date)
        .toISOString()
        .slice(0, 19)
        .replace("T", " "),
    }));
    res.status(200).json({ data: formattedTasks, links: [] });
  });
};

exports.createTask = (req, res) => {
  const { projectId } = req.params;
  const taskData = {
    ...req.body,
    project_id: projectId,
    start_date: new Date(req.body.start_date),
    end_date: req.body.end_date ? new Date(req.body.end_date) : undefined,
    duration: parseInt(req.body.duration, 10),
  };

  console.log("Received task data:", taskData);

  if (!taskData.text || !taskData.start_date || !taskData.duration) {
    console.error("Invalid task data:", taskData);
    return res.status(400).json({ error: "Invalid task data" });
  }

  Task.create(taskData, (err, result) => {
    if (err) {
      console.error("Failed to create task:", err);
      return res.status(500).json({ error: "Server error" });
    }
    console.log("Task created successfully:", result);
    const newTaskId = result.insertId || Date.now();
    res.status(201).json({
      id: newTaskId,
      text: taskData.text,
      start_date: format(taskData.start_date, "yyyy-MM-dd HH:mm:ss"),
      end_date: taskData.end_date
        ? format(taskData.end_date, "yyyy-MM-dd HH:mm:ss")
        : undefined,
      duration: taskData.duration,
    });
  });
};

exports.updateTask = (req, res) => {
  const { taskId } = req.params;
  const taskData = req.body;

  console.log("Updating task data:", taskId, taskData);

  if (!taskData.text || !taskData.start_date || !taskData.duration) {
    console.error("Invalid task data:", taskData);
    return res.status(400).send("Invalid task data");
  }

  Task.updateById(taskId, taskData, (err, task) => {
    if (err) {
      console.error("Failed to update task:", err);
      return res.status(500).send("Server error");
    }
    res.status(200).json(task);
  });
};

exports.deleteTask = (req, res) => {
  const { taskId } = req.params;

  console.log("Deleting task:", taskId);

  Task.deleteById(taskId, (err) => {
    if (err) {
      console.error("Failed to delete task:", err);
      return res.status(500).send("Server error");
    }
    res.status(200).send(`Task with id ${taskId} deleted.`);
  });
};