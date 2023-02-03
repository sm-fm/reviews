const db = require('../../db/index.js');
const Promise = require('bluebird');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  getReviews: (id) => {
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
            'date', (SELECT to_char(to_timestamp(date::bigint/1000), 'YYYY-MM-DD"T"HH24:MI:SS"Z"')),
            'reviewer_name', reviewer_name,
            'helpfulness', helpfulness,
            'photos', (
              SELECT coalesce (json_agg(
                json_build_object(
                  'id', id,
                  'url', url
                )
              ), '[]'::json) FROM photos WHERE photos.review_id = reviews.id
            )
          )
        ) FROM reviews WHERE product_id = $1
      ));`, [id])
      .then((result) => {
        return result.rows[0].json_build_object;
      })
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
        var count1 = 0;
        result.rows.forEach(row => {
          count1 += Number(row.value);
        });
        data.characteristics = {};
        data.characteristics.Fit = {};
        data.characteristics.Fit.value = count1 / result.rows.length || 0;
        return db.query(`SELECT value FROM char WHERE product_id = $1 AND name = 'Length'`, [id])
      })
      .then(result => {
        var count2 = 0;
        result.rows.forEach(row => {
          count2 += Number(row.value);
        });
        data.characteristics.Length = {};
        data.characteristics.Length.value = count2 / result.rows.length || 0;
        return db.query(`SELECT value FROM char WHERE product_id = $1 AND name = 'Comfort'`, [id])
      })
      .then(result => {
        var count3 = 0;
        result.rows.forEach(row => {
          count3 += Number(row.value);
        });
        data.characteristics.Comfort = {};
        data.characteristics.Comfort.value = count3 / result.rows.length || 0;
        return db.query(`SELECT value FROM char WHERE product_id = $1 AND name = 'Quality'`, [id])
      })
      .then(result => {
        var count4 = 0;
        result.rows.forEach(row => {
          count4 += Number(row.value);
        });
        data.characteristics.Quality = {};
        data.characteristics.Quality.value = count4 / result.rows.length || 0;
        return data;
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