const models = require('../models/reviews');

exports.getReviews = (req, res) => {
  const id = req.query.product_id;
  if (!id) {
    throw 'Missing id';
  }
  models.getReviews(id)
    .then(result => {
      res.status(200).send(result);
    })
    .catch(e => {
      console.log(e);
      res.sendStatus(500);
    });
}

exports.getReviewMeta = (req, res) => {
  const id = req.query.product_id;
  if (!id) {
    throw 'Missing id';
  }
  models.getReviewMetaData(id)
    .then(result => {
      res.status(200).send(result);
    })
    .catch(e => {
      console.log(e);
      res.sendStatus(500);
    });
}