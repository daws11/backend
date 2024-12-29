const db = require('../config/db');

const Chat = {
  create: (message, callback) => {
    const query = 'INSERT INTO chats SET ?';
    db.query(query, message, (err, result) => {
      if (err) {
        console.error('Failed to create chat:', err);
      }
      callback(err, result);
    });
  },
  
  findByProjectId: (projectId, callback) => {
    const query = `
      SELECT chats.*, users.name as userName 
      FROM chats 
      JOIN users ON chats.user_id = users.id 
      WHERE project_id = ?`;
    db.query(query, [projectId], (err, result) => {
      if (err) {
        console.error('Failed to fetch chats:', err);
      }
      callback(err, result);
    });
  }
};

module.exports = Chat;