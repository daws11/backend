const createConnection = require('../config/db');

const User = {
  create: async (username, password, role, name, email, photoProfile) => {
    const connection = await createConnection();
    const query = 'INSERT INTO users (username, password, role, name, email, photo_profile) VALUES (?, ?, ?, ?, ?, ?)';
    const [result] = await connection.query(query, [username, password, role, name, email, photoProfile]);
    return result;
  },
  findByUsername: async (username) => {
    const connection = await createConnection();
    const query = 'SELECT * FROM users WHERE username = ?';
    const [rows] = await connection.query(query, [username]);
    return rows[0];
  },
  findByRole: async (role) => {
    const connection = await createConnection();
    const query = 'SELECT * FROM users WHERE role = ?';
    const [rows] = await connection.query(query, [role]);
    return rows;
  },
  findById: async (id) => {
    const connection = await createConnection();
    const query = 'SELECT * FROM users WHERE id = ?';
    const [rows] = await connection.query(query, [id]);
    return rows[0];
  }
};

module.exports = User;