const db = require('../../db/index.js');

module.exports = {
  getReviews: (id) => {
    let data = {
      'product': id,
      'page': 0,
      'count': 5,
      'results': []
    };
    const queryText = {
      text: 'SELECT * FROM review2 WHERE product_id = $1',
      values: [id]
    };
    return db.query('SELECT * FROM review2 WHERE product_id = $1', [id])
      .then((result) => {
        console.log('this is result: ', result.rows);
        data.results = result.rows;
        return data;
      })
      .catch(e => {
        console.log(e);
        return e;
      });
  }
};