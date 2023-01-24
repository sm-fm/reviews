const db = require('../../db/index.js');
const Promise = require('bluebird');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  getReviews: (id) => {
    console.log('from model', id);
    return db.query(`SELECT json_build_object(
      'product_id', ${id},
      'page', 0,
      'count', 5,
      'results', (
        SELECT json_agg(
          json_build_object(
            'review_id', id,
            'rating', rating,
            'summary', summary,
            'recommend', recommend,
            'response', response,
            'body', body,
            'date', date,
            'reviewer_name', reviewer_name,
            'helpfulness', helpfulness,
            'photos', (
              SELECT json_agg(
                json_build_object(
                  'id', id,
                  'url', url
                )
              ) FROM photos WHERE product_id = $1
            )
          )
        ) FROM reviews WHERE product_id = $1
      ));`, [id])
      .then((result) => {
        var resultsObj = result.rows[0].json_build_object;
          resultsObj.results.forEach(result => {
            if (result.photos === null) result.photos = [];
            result.date = new Date(Number(result.date));
          });
        return result.rows[0].json_build_object;
      })
      .catch(e => {
        console.log(e);
        return e;
      });
  },

  getReviewMetaData: (id) => {
    let data = {};
    return db.query(`SELECT json_build_object(
      'product_id', ${id},
      'ratings', (
        json_build_object(
          '1', (
            SELECT COUNT(rating) FROM reviews WHERE product_id = $1 AND rating = '1'
          ),
          '2', (
            SELECT COUNT(rating) FROM reviews WHERE product_id = $1 AND rating = '2'
          ),
          '3', (
            SELECT COUNT(rating) FROM reviews WHERE product_id = $1 AND rating = '3'
          ),
          '4', (
            SELECT COUNT(rating) FROM reviews WHERE product_id = $1 AND rating = '4'
          ),
          '5', (
            SELECT COUNT(rating) FROM reviews WHERE product_id = $1 AND rating = '5'
          )
        )
      ),
      'recommended', (
        json_build_object(
          'false', (
            SELECT COUNT(recommend) FROM reviews WHERE product_id = $1 AND recommend = 'false'
          ),
          'true', (
            SELECT COUNT(recommend) FROM reviews WHERE product_id = $1 AND recommend = 'true'
          )
        )
      )
    );`, [id])
      .then(result => {
        data = result.rows[0].json_build_object;
        return db.query(`SELECT value FROM char WHERE product_id = $1 AND name = 'Fit'`, [id])
      })
      .then(result => {
        var count = 0;
        result.rows.forEach(row => {
          count += Number(row.value);
        });
        data.characteristics = {};
        data.characteristics.Fit = {};
        data.characteristics.Fit.value = count / result.rows.length;
        return db.query(`SELECT value FROM char WHERE product_id = $1 AND name = 'Length'`, [id])
      })
      .then(result => {
        var count = 0;
        result.rows.forEach(row => {
          count += Number(row.value);
        });
        data.characteristics.Length = {};
        data.characteristics.Length.value = count / result.rows.length;
        return db.query(`SELECT value FROM char WHERE product_id = $1 AND name = 'Comfort'`, [id])
      })
      .then(result => {
        var count = 0;
        result.rows.forEach(row => {
          count += Number(row.value);
        });
        data.characteristics.Comfort = {};
        data.characteristics.Comfort.value = count / result.rows.length;
        return db.query(`SELECT value FROM char WHERE product_id = $1 AND name = 'Quality'`, [id])
      })
      .then(result => {
        var count = 0;
        result.rows.forEach(row => {
          count += Number(row.value);
        });
        data.characteristics.Quality = {};
        data.characteristics.Quality.value = count / result.rows.length;
        return data;
      })
      .catch(err => {
        console.log(err);
        return err;
      });
  },

  addReview: (data) => {
    let date = new Date().getTime();
    const id = uuidv4();
    return db.query(`INSERT INTO reviews (id, product_id, rating, date, summary, body, recommend,
      reviewer_name, reviewer_email) VALUES ($1, $2, $3, $4, $5,
        $6, $7, $8, $9)`, [id, data.product_id, data.rating, date, data.summary, data.body, data.recommend,
        data.name, data.email]);
  },

  addHelpClick: (review_id) => {
    return db.query(`UPDATE reviews SET helpfulness = helpfulness::int + 1 WHERE id =
    $1`, [review_id]);
  },

  reportReview: (review_id) => {
    return db.query(`UPDATE reviews SET reported = 'true' WHERE id = $1`, [review_id]);
  }
};