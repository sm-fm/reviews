CREATE TABLE all_reviews (
  product_id INT,
  count INT,
  page Int,
  review_id INT,
  PRIMARY KEY(product_id),
  FOREIGN KEY(review_id)
    REFERENCES review(review_id)
);

CREATE TABLE review (
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
);

CREATE TABLE photos (
  photo_id INT,
  url VARCHAR(100),
  review_id INT,
  PRIMARY KEY(photo_id),
  FOREIGN KEY(review_id)
    REFERENCES review(review_id)
);

CREATE TABLE meta (
  product_id INT,
  PRIMARY KEY(product_id),
  FOREIGN KEY(ratings_id)
    REFERENCES ratings(ratings_id),
  FOREIGN KEY(recommended_id)
    REFERENCES recommended(recommended_id),
  FOREIGN KEY(characteristics_id)
    REFERENCES characteristics(characteristics_id)
);

CREATE TABLE ratings (
  ratings_id INT,
  1 INT,
  2 INT,
  3 INT,
  4 INT,
  5 INT,
  PRIMARY KEY(ratings_id),
  FOREIGN KEY(product_id)
    REFERENCES meta(product_id),
);

CREATE TABLE recommended (
  recommended_id INT,
  false INT,
  true INT,
  PRIMARY KEY(recommended_id),
  FOREIGN KEY(product_id)
    REFERENCES meta(product_id)
);

CREATE TABLE characteristics (
  characteristics_id INT,
  PRIMARY KEY(characteristics_id),
  FOREIGN KEY(product_id)
    REFERENCES meta(product_id),
  FOREIGN KEY(fit_id)
    REFERENCES fit(fit_id),
  FOREIGN KEY(length_id)
    REFERENCES length(length_id),
  FOREIGN KEY(comfort_id)
    REFERENCES comfort(comfort_id),
  FOREIGN KEY(quality_id)
    REFERENCES quality(quality_id)
);

CREATE TABLE fit (
  fit_id INT,
  value VARCHAR(50),
  PRIMARY KEY(fit_id)
);

CREATE TABLE length (
  length_id INT,
  value VARCHAR(50),
  PRIMARY KEY(length_id)
);

CREATE TABLE comfort (
  comfort_id INT,
  value VARCHAR(50),
  PRIMARY KEY(comfort_id)
);

CREATE TABLE quality (
  quality_id INT,
  value VARCHAR(50),
  PRIMARY KEY(quality_id)
);