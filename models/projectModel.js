const createConnection = require('../config/db');

const Project = {
  create: async (data) => {
    const connection = await createConnection();
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

    const [result] = await connection.query(query, values);
    return result;
  },

  findAll: async () => {
    const connection = await createConnection();
    const query = 'SELECT * FROM projects';
    const [rows] = await connection.query(query);
    return rows;
  },

  findById: async (id) => {
    const connection = await createConnection();
    const query = `
      SELECT p.*, u.name AS project_leader_name
      FROM projects p
      LEFT JOIN users u ON p.project_leader = u.id
      WHERE p.id = ?
    `;
    const [rows] = await connection.query(query, [id]);
    return rows[0];
  },

  deleteById: async (id) => {
    const connection = await createConnection();
    const query = 'DELETE FROM projects WHERE id = ?';
    const [result] = await connection.query(query, [id]);
    return result;
  },

  updateById: async (id, data) => {
    const connection = await createConnection();
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

    const [result] = await connection.query(query, values);
    return result;
  },

  addTeamMembers: async (projectId, userIds) => {
    const connection = await createConnection();
    const query = `
      INSERT INTO project_team_members (project_id, user_id)
      VALUES ${userIds.map(() => '(?, ?)').join(', ')}
    `;

    const values = userIds.flatMap((userId) => [projectId, userId]);
    const [result] = await connection.query(query, values);
    return result;
  },

  getTeamMembersByProject: async (projectId) => {
    const connection = await createConnection();
    const query = `
      SELECT u.id, u.name, u.email
      FROM project_team_members ptm
      JOIN users u ON ptm.user_id = u.id
      WHERE ptm.project_id = ?
    `;
    const [rows] = await connection.query(query, [projectId]);
    return rows;
  },

  getProjectNames: async () => {
    const connection = await createConnection();
    const query = 'SELECT id, name FROM projects';
    const [rows] = await connection.query(query);
    return rows;
  },
  
  getTasksByProjectId: async (projectId) => {
    const connection = await createConnection();
    const query = `
      SELECT t.*, u.name AS assigned_to_name
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE t.project_id = ?
      ORDER BY COALESCE(t.parent_id, t.id), t.parent_id IS NOT NULL, t.id
    `;
    const [rows] = await connection.query(query, [projectId]);
    return rows;
  },

  getMainTasksWithSubtasks: async (projectId) => {
    const connection = await createConnection();
    const query = `
      SELECT t1.id, t1.text AS name, t1.progress, t2.id AS subtask_id, t2.text AS subtask_name, t2.progress AS subtask_progress
      FROM tasks t1
      LEFT JOIN tasks t2 ON t1.id = t2.parent_id
      WHERE t1.project_id = ? AND t1.parent_id IS NULL
    `;
    const [rows] = await connection.query(query, [projectId]);
    return rows;
  },
};

module.exports = Project;