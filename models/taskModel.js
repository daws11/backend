const db = require("../config/db");

const Task = {
  findByProjectId: (projectId, callback) => {
    const query = "SELECT * FROM tasks WHERE project_id = ?";
    db.query(query, [projectId], callback);
  },

  create: (task, callback) => {
    const { text, start_date, duration, progress, project_id } = task;
    const query =
      "INSERT INTO tasks (text, start_date, duration, progress, project_id) VALUES (?, ?, ?, ?, ?)";
    db.query(
      query,
      [text, start_date, duration, progress, project_id],
      callback
    );
  },

  updateById: (id, task, callback) => {
    const { text, start_date, end_date, duration, progress } = task;
    const query =
      "UPDATE tasks SET text = ?, start_date = ?, end_date = ?, duration = ?, progress = ? WHERE id = ?";
    db.query(
      query,
      [text, start_date, end_date, duration, progress, id],
      callback
    );
  },

  deleteById: (id, callback) => {
    const query = "DELETE FROM tasks WHERE id = ?";
    db.query(query, [id], callback);
  },
};

module.exports = Task;