const Pool = require('pg-pool');
const pool = new Pool ({
  host: '127.0.0.1',
  port: 5432,
  database: 'reviews',
  user: 'seanmcdaniel',
  password: '',
  max: 10,
  idleTimeoutMillis: 1000
});

// client.connect();

module.exports = {
  query: (text, values) => {
    return pool.query(text, values);
  }
}