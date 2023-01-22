const { Client } = require('pg');
const client = new Client ({
  host: '127.0.0.1',
  port: 5432,
  database: 'reviews',
  user: 'seanmcdaniel',
  password: ''
});

client.connect();

module.exports = {
  query: (text, values) => {
    return new Promise((res, rej) => {
       res(client.query(text, values));
    })
  }
}