const db = require('../config/db'); // Adjust this path as necessary

const Project = {
  create: (data, callback) => {
    const {
      name,
      jobOwner,
      startDate,
      endDate,
      projectWarrantyDuration,
      contractValue,
      sourceOfFunds,
      lineOfBusiness,
      projectLeader,
      hasProjectWarranty
    } = data;

    const query = `
      INSERT INTO projects (
        name, job_owner, start_date, end_date,
        project_warranty_duration, contract_value, source_of_funds,
        line_of_business, project_leader, has_project_warranty
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      name,
      jobOwner,
      startDate,
      endDate,
      projectWarrantyDuration,
      contractValue,
      sourceOfFunds,
      lineOfBusiness,
      projectLeader,
      hasProjectWarranty
    ];

    db.query(query, values, callback);
  },

  findAll: (callback) => {
    const query = 'SELECT * FROM projects';
    db.query(query, callback);
  },

  findById: (id, callback) => {
    const query = `
      SELECT p.*, u.name AS project_leader_name
      FROM projects p
      LEFT JOIN users u ON p.project_leader = u.id
      WHERE p.id = ?
    `;
    db.query(query, [id], callback);
  },

  deleteById: (id, callback) => {
    const query = 'DELETE FROM projects WHERE id = ?';
    db.query(query, [id], callback);
  },

  updateById: (id, data, callback) => {
    const {
      name,
      jobOwner,
      startDate,
      endDate,
      projectWarrantyDuration,
      contractValue,
      sourceOfFunds,
      lineOfBusiness,
      projectLeader,
      hasProjectWarranty
    } = data;

    const query = `
      UPDATE projects SET
        name = ?, job_owner = ?, start_date = ?, end_date = ?,
        project_warranty_duration = ?, contract_value = ?, source_of_funds = ?,
        line_of_business = ?, project_leader = ?, has_project_warranty = ?
      WHERE id = ?
    `;

    const values = [
      name,
      jobOwner,
      startDate,
      endDate,
      projectWarrantyDuration,
      contractValue,
      sourceOfFunds,
      lineOfBusiness,
      projectLeader,
      hasProjectWarranty,
      id
    ];

    db.query(query, values, callback);
  },

  addTeamMembers: (projectId, userIds, callback) => {
    const query = `
      INSERT INTO project_team_members (project_id, user_id)
      VALUES ${userIds.map(() => '(?, ?)').join(', ')}
    `;

    const values = userIds.flatMap((userId) => [projectId, userId]);
    db.query(query, values, callback);
  },

  getTeamMembersByProject: (projectId, callback) => {
    const query = `
      SELECT u.id, u.name, u.email
      FROM project_team_members ptm
      JOIN users u ON ptm.user_id = u.id
      WHERE ptm.project_id = ?
    `;
    db.query(query, [projectId], callback);
  },

  getProjectNames: (callback) => {
    const query = 'SELECT id, name FROM projects';
    db.query(query, callback);
  },
  
  getTasksByProjectId: (projectId, callback) => {
    const query = `
      SELECT t.*, u.name AS assigned_to_name
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE t.project_id = ?
      ORDER BY COALESCE(t.parent_id, t.id), t.parent_id IS NOT NULL, t.id
    `;
    db.query(query, [projectId], callback);
  },

  getMainTasksWithSubtasks: (projectId, callback) => {
    const query = `
      SELECT t1.id, t1.text AS name, t1.progress, t2.id AS subtask_id, t2.text AS subtask_name, t2.progress AS subtask_progress
      FROM tasks t1
      LEFT JOIN tasks t2 ON t1.id = t2.parent_id
      WHERE t1.project_id = ? AND t1.parent_id IS NULL
    `;
    db.query(query, [projectId], callback);
  },
};

module.exports = Project;
