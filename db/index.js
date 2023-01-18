const { Client } = require('pg');
const client = new Client ({
  host: '127.0.0.1',
  port: 5432,
  database: 'reviews',
  user: 'seanmcdaniel',
  password: ''
});

client.connect();

// const execute = async (query) => {
//   try {
//     await client.connect()
//     return await client.query(query);
//   } catch (error) {
//     console.log(error.stack);
//     return false;
//   } finally {
//     await client.end();
//   }
// };

// execute(review)
//   .then(result => {
//     if (result) {
//       console.log('Table created');
//     }
//   });

// const { Pool } = require('pg');

// const pool = new Pool({
//   host: '127.0.0.1',
//   port: 5432,
//   database: 'reviews',
//   user: 'seanmcdaniel',
//   password: ''
// });

// module.exports = {
//   query: (text) => {
//     return pool.query(text);
//   }
// };


// module.exports.client = client;
// module.exports = execute;

module.exports = {
  query: (text, values) => {
    return new Promise((res, rej) => {
       res(client.query(text, values));
    })
  }
}
