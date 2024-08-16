const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',  
  user: 'root',       
  password: '4862',       
  database: 'vulnerabilites_config' 
});

// connection.connect((err) => {
//   if (err) {
//     console.error('Error connecting to MySQL:', err.stack);
//     return;
//   }
//   console.log('Connected to MySQL as id ' + connection.threadId);
// });

module.exports = pool;


