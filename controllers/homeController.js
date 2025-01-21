const Project = require('../models/projectModel');

exports.getProjectNames = (req, res) => {
  Project.getProjectNames((err, projectNames) => {
    if (err) {
      console.error('Failed to fetch project names:', err);
      return res.status(500).send('Server error');
    }
    res.status(200).json(projectNames);
  });
};

exports.getTasksByProjectId = (req, res) => {
  const { id } = req.params;
  Project.getTasksByProjectId(id, (err, tasks) => {
    if (err) {
      console.error('Failed to fetch tasks:', err);
      return res.status(500).send('Server error');
    }
    res.status(200).json(tasks);
  });
};

exports.getMainTasksWithSubtasks = (req, res) => {
  const { id } = req.params;
  Project.getMainTasksWithSubtasks(id, (err, tasks) => {
    if (err) {
      console.error('Failed to fetch main tasks with subtasks:', err);
      return res.status(500).send('Server error');
    }
    res.status(200).json(tasks);
  });
};