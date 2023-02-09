require('dotenv').config();
const Pool = require('pg-pool');
const pool = new Pool ({
  host: 'ec2-18-225-35-250.us-east-2.compute.amazonaws.com',
  port: 5432,
  database: 'reviews',
  user: 'seanmcdaniel',
  password: 'password',
  max: 20,
  idleTimeoutMillis: 1000
});

module.exports = {
  query: (text, values) => {
    return pool.query(text, values);
  }
}