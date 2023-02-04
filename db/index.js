const Pool = require('pg-pool');
const pool = new Pool ({
  host: 'sdc-db_c',
  port: 5432,
  database: 'reviews',
  user: 'postgres',
  password: 'password',
  max: 20,
  idleTimeoutMillis: 1000
});

module.exports = {
  query: (text, values) => {
    return pool.query(text, values);
  }
}