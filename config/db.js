const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',        // ganti sesuai user MySQL
  password: '',        // password MySQL
  database: 'profosalrw'
});

module.exports = pool;
