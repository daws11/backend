const createConnection = require('../config/db');

const Chat = {
  create: async (message) => {
    const connection = await createConnection();
    const query = 'INSERT INTO chats SET ?';
    const [result] = await connection.query(query, message);
    return result;
  },
  
  findByProjectId: async (projectId) => {
    const connection = await createConnection();
    const query = `
      SELECT chats.*, users.name as userName 
      FROM chats 
      JOIN users ON chats.user_id = users.id 
      WHERE project_id = ?
    `;
    const [rows] = await connection.query(query, [projectId]);
    return rows;
  }
};

module.exports = Chat;