const axios = require('axios');
const models = require('../models/reviews');

exports.addHelpClick = (req, res) => {
  const review_id = req.query.review_id;
  if (!review_id) {
    throw 'Missing review id';
  }
  models.addHelpClick(review_id)
    .then(result => {
      res.status(204).send(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    });
}

exports.reportReview = (req, res) => {
  const review_id = req.query.review_id;
  if (!review_id) {
    throw 'Missing review id';
  }
  models.reportReview(review_id)
    .then(result => {
      res.status(204).send(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    });
}
