// EXPRESS SERVER Index

require('dotenv').config();
const express = require ("express");
const axios = require ('axios')
const app = express();
const cors = require("cors");
const initGetData = require("./controllers/initGetData.js");
const postData = require('./controllers/postData.js');
const putData = require('./controllers/putData.js');
//for image uploads
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' });

const deleteData = require('./controllers/deleteData.js');
const compression = require('compression');

//CSV work
const csv = require('fast-csv');
const fs = require('fs');
const db = require('../db/index');

// const parser = parse({columns: true}, (err, records) => {
//   records.forEach(record => {
//     db.query(`INSERT INTO review2(id, rating, summary, recommend, response, body, date, reviewer_name,
//       helpfulness, reported, reviewer_email, product_id) VALUES ("${record.id}", "${record.rating}",
//       "${record.summary}", "${record.recommend}", "${record.response}", "${record.body}", "${record.date}",
//       "${record.reviewer_name}", "${record.helpfulness}", "${record.reported}", "${record.reviewer_email}",
//       "${record.product_id}");`);
//   });
// });
// if (row.length === 12) {
//   db.query(`INSERT INTO review2(id, rating, summary, recommend, response, body, date, reviewer_name,
//     helpfulness, reported, reviewer_email, product_id) VALUES ("${row[0]}", "${row[1]}",
//     "${row[2]}", "${row[3]}", "${row[4]}", "${row[5]}", "${row[6]}",
//     "${row[7]}", "${row[8]}", "${row[9]}", "${row[10]}",
//     "${row[11]}");`);
// }
let rows = [];
fs.createReadStream('/Users/seanmcdaniel/hack-reactor-rpp2207/sdc-data/reviews.csv')
  .pipe(csv.parse({headers: true}))
  .on('data', (row) => {
    rows.push(row);
  })
  .on('end', () => {
    db.bulkCreate(rows);
    console.log('finished');
  })
  .on('error', (err) => {
    console.log(err.message);
  });

app.use(express.json());
app.use(cors()); // Not sure if needed
app.use(compression())
app.use(express.urlencoded({ extended: false }));

app.use('/ip/:id', express.static(__dirname + '/../client/dist'));
app.listen(3000, () => console.log('Our Server is listening on port 3000...'));

// ROUTES

app.get('/', initGetData.redirectFromHome);

app.get('/ipCurrent', initGetData.getCurrentProductCardControl);
// app.get('/ip/:id', initGetData.getCurrentProductCardControl);

app.get('/ipRelated', initGetData.getRelatedProductCardControl);

app.get('/getProductStyles', initGetData.getProductStylesControl);

app.get('/getProductRelated', initGetData.getProductRelatedControl);

app.get('/getProductReviews', initGetData.getProductReviewsControl);

app.get('/getProductReviewMeta', initGetData.getProductReviewMeta);

app.get('/getProductQnA', initGetData.getProductQnAControl);

app.post('/uploadImg', upload.any(), postData.postImg);

app.get('/getCart', initGetData.getCart);

app.post('/submitReview', postData.postReviewForm);

app.post('/submitQuestion', postData.postQuestionForm);

app.post('/submitAnswer', postData.postAnswerForm);

app.post('/clickTrackPost', postData.postClickTrack);

app.post('/addToCart', postData.postAddToCart);

app.delete('/deleteCart', deleteData.deleteCart);

app.put('/helpClick', putData.putHelpClick);

app.put('/reportClick', putData.putReportClick);

app.put('/helpfulQuestion', putData.questionHelpfulness);

app.put('/reportedQuestion', putData.questionReported);

app.put('/helpfulAnswer', putData.answerHelpfulness);

app.put('/reportAnswer', putData.answerReported);

