const mysql = require('mysql2/promise');

const createConnection = async () => {
  try {
    const connection = await mysql.createConnection({
      host: 'wu7nft.stackhero-network.com',
      port: '3973',
      user: 'root',
      password: 'QiWUcSevVC3S7PLytpkT5CZcxGEQibMb',
      database: 'project_management'
    });
    
    console.log('Connected to MySQL database');
    return connection;
  } catch (err) {
    console.error('Database connection failed:', err);
    throw err;
  }
};

module.exports = createConnection;