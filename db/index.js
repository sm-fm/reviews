const { Client } = require('pg');
const client = new Client ({
  host: '127.0.0.1',
  port: 5432,
  database: 'reviews',
  user: 'seanmcdaniel',
  password: ''
});

client.connect();

const execute = async (query) => {
  try {
    await client.query(query);
    return true;
  } catch (error) {
    console.log(error.stack);
    return false;
  }
};

const review = `
  CREATE TABLE IF NOT EXISTS review (
    review_id INT,
    rating INT,
    summary VARCHAR(250),
    recommended VARCHAR(10),
    response VARCHAR (100),
    body VARCHAR(250),
    date DATE,
    reviewer_name VARCHAR(50),
    helpfulness INT,
    PRIMARY KEY(review_id)
  );`;

const all_reviews = `
  CREATE TABLE IF NOT EXISTS all_reviews (
    product_id INT,
    count INT,
    page Int,
    review_id INT,
    PRIMARY KEY(product_id),
    FOREIGN KEY(review_id)
      REFERENCES review(review_id)
  );`;

const photos = `
  CREATE TABLE IF NOT EXISTS photos (
    photo_id INT,
    url VARCHAR(100),
    review_id INT,
    PRIMARY KEY(photo_id),
    FOREIGN KEY(review_id)
      REFERENCES review(review_id)
  );`;

const fit = `
  CREATE TABLE IF NOT EXISTS fit (
    fit_id INT,
    value VARCHAR(50),
    PRIMARY KEY(fit_id)
  );`;

const length = `
  CREATE TABLE IF NOT EXISTS length (
    length_id INT,
    value VARCHAR(50),
    PRIMARY KEY(length_id)
  );`;

const comfort = `
  CREATE TABLE IF NOT EXISTS comfort (
    comfort_id INT,
    value VARCHAR(50),
    PRIMARY KEY(comfort_id)
  );`;

const quality = `
  CREATE TABLE IF NOT EXISTS quality (
    quality_id INT,
    value VARCHAR(50),
    PRIMARY KEY(quality_id)
  );`;

const characteristics = `
  CREATE TABLE IF NOT EXISTS characteristics (
    characteristics_id INT,
    fit_id INT,
    length_id INT,
    comfort_id INT,
    quality_id INT,
    product_id INT,
    PRIMARY KEY(characteristics_id),
    FOREIGN KEY(fit_id)
      REFERENCES fit(fit_id),
    FOREIGN KEY(length_id)
      REFERENCES length(length_id),
    FOREIGN KEY(comfort_id)
      REFERENCES comfort(comfort_id),
    FOREIGN KEY(quality_id)
      REFERENCES quality(quality_id)
  );`;

const alterChars = `
  ALTER TABLE characteristics
    ADD FOREIGN KEY(product_id)
      REFERENCES meta(product_id);`;

const recommended = `
  CREATE TABLE IF NOT EXISTS recommended (
    recommended_id INT,
    "false" INT,
    "true" INT,
    product_id INT,
    PRIMARY KEY(recommended_id)
  );`;

const alterRecommended = `
  ALTER TABLE recommended
    ADD FOREIGN KEY(product_id)
      REFERENCES meta(product_id);`;

const ratings = `
  CREATE TABLE IF NOT EXISTS ratings (
    ratings_id INT,
    "1" INT,
    "2" INT,
    "3" INT,
    "4" INT,
    "5" INT,
    product_id INT,
    PRIMARY KEY(ratings_id)
  );`;

const alterRatings = `
  ALTER TABLE ratings
    ADD FOREIGN KEY(product_id)
      REFERENCES meta(product_id);`;

const meta = `
  CREATE TABLE IF NOT EXISTS meta (
    product_id INT,
    ratings_id INT,
    recommended_id INT,
    characteristics_id INT,
    PRIMARY KEY(product_id)
  );`;

const alterMeta = `
  ALTER TABLE meta
    ADD FOREIGN KEY(ratings_id)
      REFERENCES ratings(ratings_id),
    ADD FOREIGN KEY(recommended_id)
      REFERENCES recommended(recommended_id),
    ADD FOREIGN KEY(characteristics_id)
      REFERENCES characteristics(characteristics_id);`;

execute(review)
  .then(result => {
    if (result) {
      console.log('Table created');
    }
    return execute(all_reviews);
  })
  .then(result => {
    if (result) {
      console.log('Table created');
    }
    return execute(photos);
  })
  .then(result => {
    if (result) {
      console.log('Table created');
    }
    return execute(fit);
  })
  .then(result => {
    if (result) {
      console.log('Table created');
    }
    return execute(length);
  })
  .then(result => {
    if (result) {
      console.log('Table created');
    }
    return execute(comfort);
  })
  .then(result => {
    if (result) {
      console.log('Table created');
    }
    return execute(quality);
  })
  .then(result => {
    if (result) {
      console.log('Table created');
    }
    return execute(characteristics);
  })
  .then(result => {
    if (result) {
      console.log('Table created');
    }
    return execute(recommended);
  })
  .then(result => {
    if (result) {
      console.log('Table created');
    }
    return execute(ratings);
  })
  .then(result => {
    if (result) {
      console.log('Table created');
    }
    return execute(meta);
  })
  .then(result => {
    if (result) {
      console.log('Table created');
    }
    return execute(alterChars);
  })
  .then(result => {
    if (result) {
      console.log('Table altered');
    }
    return execute(alterRecommended);
  })
  .then(result => {
    if (result) {
      console.log('Table altered');
    }
    return execute(alterRatings);
  })
  .then(result => {
    if (result) {
      console.log('Table altered');
    }
    return execute(alterMeta);
  })
  .then(result => {
    if (result) {
      console.log('Table altered');
    }
    client.end();
  });

module.exports = client;
