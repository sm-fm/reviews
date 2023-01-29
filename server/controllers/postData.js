const models = require('../models/reviews');

exports.addReviewToDB = (req, res) => {
  const data = req.body;
  if (!data.product_id) throw 'Missing product id';
  models.addReview(data)
    .then(result => {
      res.sendStatus(201);
    })
    .catch(err => {
      res.sendStatus(500);
    });
}

