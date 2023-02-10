require('dotenv').config();
const Pool = require('pg-pool');
const pool = new Pool ({
  host: process.env.HOST,
  port: 5432,
  database: 'reviews',
  user: process.env.USER,
  password: process.env.PASSWORD,
  max: 20,
  idleTimeoutMillis: 1000
});

module.exports = {
  query: (text, values) => {
    return pool.query(text, values);
  }
}