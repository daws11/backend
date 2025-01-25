const Project = require('../models/projectModel');

exports.getProjectNames = async (req, res) => {
  try {
    const projectNames = await Project.getProjectNames();
    res.status(200).json(projectNames);
  } catch (err) {
    console.error('Failed to fetch project names:', err);
    res.status(500).send('Server error');
  }
};

exports.getTasksByProjectId = async (req, res) => {
  const { id } = req.params;
  try {
    const tasks = await Project.getTasksByProjectId(id);
    res.status(200).json(tasks);
  } catch (err) {
    console.error('Failed to fetch tasks:', err);
    res.status(500).send('Server error');
  }
};

exports.getMainTasksWithSubtasks = async (req, res) => {
  const { id } = req.params;
  try {
    const tasks = await Project.getMainTasksWithSubtasks(id);
    res.status(200).json(tasks);
  } catch (err) {
    console.error('Failed to fetch main tasks with subtasks:', err);
    res.status(500).send('Server error');
  }
};