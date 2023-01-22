const db = require('../../db/index.js');
const Promise = require('bluebird');

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
        // for (var i = 0; i < resultsObj.results.length; i++) {
        //   if (resultsObj.results[i].photos === null) resultsObj.results[i].photos = [];
        //   resultsObj.results[i].date = new Date(Number(resultsObj.results[i].date));
        // }
        return result.rows[0].json_build_object;
      })
      .catch(e => {
        console.log(e);
        return e;
      });
  },

  getReviewMetaData: (id) => {

  }
};