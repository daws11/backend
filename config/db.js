const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'wu7nft.stackhero-network.com',
  port: '3973',
  user: 'root',
  password: 'QiWUcSevVC3S7PLytpkT5CZcxGEQibMb',
  database: 'project_management'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

module.exports = connection;
