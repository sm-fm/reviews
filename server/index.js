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

app.use(express.json());
app.use(cors());
app.use(compression())
app.use(express.urlencoded({ extended: false }));

//Reviews DB testing
app.get('/dbreviews', initGetData.getReviews);
app.get('/dbmeta', initGetData.getReviewMeta);
app.post('/addreview', postData.addReviewToDB);
app.put('/addHelp', putData.addHelpClick);
app.put('/reportreview', putData.reportReview);

module.exports = app.listen(8080, () => console.log('Server is listening on port 8080...'));