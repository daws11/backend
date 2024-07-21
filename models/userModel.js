const db = require('../config/db'); // Adjust this path as necessary

const User = {
  create: (username, password, role, name, email, photoProfile, callback) => {
    const query = 'INSERT INTO users (username, password, role, name, email, photo_profile) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [username, password, role, name, email, photoProfile], callback);
  },
  findByUsername: (username, callback) => {
    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], callback);
  },
  findByRole: (role, callback) => {
    const query = 'SELECT * FROM users WHERE role = ?';
    db.query(query, [role], callback);
  },
  findById: (id, callback) => {  // Add this function
    const query = 'SELECT * FROM users WHERE id = ?';
    db.query(query, [id], callback);
  }
};

module.exports = User;
