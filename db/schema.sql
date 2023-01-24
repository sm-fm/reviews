CREATE TABLE IF NOT EXISTS reviews (
  id VARCHAR(1000),
  product_id VARCHAR(1000),
  rating VARCHAR(10),
  date VARCHAR(25),
  summary VARCHAR(40000),
  body VARCHAR(40000),
  recommend VARCHAR(10),
  reported VARCHAR(10),
  reviewer_name VARCHAR(1000),
  reviewer_email VARCHAR(1000),
  response VARCHAR(40000),
  helpfulness VARCHAR(25)
);

CREATE INDEX id_of_product ON reviews(product_id);

CREATE TABLE IF NOT EXISTS photos (
  id VARCHAR(1000),
  review_id VARCHAR(1000),
  url VARCHAR(250),
  product_id VARCHAR(1000)
);

CREATE INDEX p_id ON photos(product_id);

CREATE TABLE IF NOT EXISTS char (
  id VARCHAR(1000),
  product_id VARCHAR(1000),
  name VARCHAR(25),
  review_id VARCHAR(1000),
  value VARCHAR(10)
);

CREATE INDEX pc_id ON char(product_id);