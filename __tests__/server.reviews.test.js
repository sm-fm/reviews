/**
 * @jest-environment node
 */

const { expect } = require('chai');
const request = require('supertest');
const Pool = require('pg-pool');
const client = require('../db/index');
const app = require('../server/index');

describe('Reviews route', () => {

  //Mocking db connection and loading app
  before(async () => {
    const pool = new Pool({
      host: '127.0.0.1',
    port: 5432,
    database: 'reviews',
    user: 'seanmcdaniel',
    password: '',
    max: 1,
    idleTimeoutMillis: 0
    });

    client.query = (text, values) => {
      return pool.query(text, values);
    }
  });

  //Creating temp tables and insert fake data to test routes
  beforeEach(async () => {
    await client.query('CREATE TEMPORARY TABLE reviews (LIKE reviews INCLUDING ALL)');
    await client.query('CREATE TEMPORARY TABLE char (LIKE char INCLUDING ALL)');
    await client.query(`INSERT INTO pg_temp.char (id, product_id, name, review_id, value) VALUES
      ('2', '2', 'Quality', '2', '4')`);
      await client.query(`INSERT INTO pg_temp.reviews (id, product_id, reported, helpfulness) VALUES
      ('2', '2', 'false', '0')`);
  });

  //Drop temp tables
  afterEach(async () => {
    await client.query('DROP TABLE pg_temp.reviews');
    await client.query('DROP TABLE pg_temp.char');
  });

  describe('POST /addreview', () => {

    it('Should create a new review', async () => {
      const req = {
        product_id: '1',
        rating: '5',
        summary: 'blah',
        body: 'blah blah',
        recommend: 'false',
        reported: 'true',
        reviewer_name: 'sean',
        reviewer_email: '@sean',
        response: 'nah',
        helpfulness: '1'
      };

      const response = {
        product_id: '1',
        rating: '5',
        summary: 'blah',
        body: 'blah blah'
      };

      await postReview(req);

      const { rows } = await client.query(`SELECT product_id, rating, summary, body FROM reviews WHERE
        product_id = $1`, [req.product_id]);
      expect(rows).lengthOf(1);
      expect(rows[0]).to.deep.equal(response);

    });

    it('Should fail if product id is not given', async () => {
      const req = {
        something: 1,
        bad: 5
      };

      await postReview(req, 500);
    });
  });

  describe('GET /dbreviews', () => {
    it('Should get a review based on product_id', async () => {
      const req = {
        id: '2'
      };
      const response = {
        id: '2',
        product_id: '2',
        reported: 'false',
        helpfulness: '0'
      };

      await getReview(req);

      const { rows } = await client.query(`SELECT id, product_id, reported, helpfulness FROM reviews
        WHERE product_id = $1`, ['2']);
      expect(rows).lengthOf(1);
      expect(rows[0]).to.deep.equal(response);
    });

    it('Should fail if product id is not given', async () => {
      const req = {
        something: 1,
        bad: 5
      };

      await getReview(req, 500);
    });
  });

  describe('GET /dbmeta', () => {
    it('Should get characteristics for a review based on product_id', async () => {
      const req = {
        id: '2'
      };
      const response = {
        id: '2',
        product_id: '2',
        name: 'Quality',
        review_id: '2',
        value: '4'
      };

      await getMeta(req);

      const { rows } = await client.query(`SELECT id, product_id, name, review_id, value FROM char
        WHERE product_id = $1`, ['2']);

      expect(rows).lengthOf(1);
      expect(rows[0]).to.deep.equal(response);
    });

    it('Should fail if product id is not given', async () => {
      const req = {
        something: 1,
        bad: 5
      };

      await getMeta(req, 500);
    });
  });

  describe('PUT /addHelp', () => {
    it('Should update helpfulness of a review', async () => {
      const req = {
        review_id: '2'
      };
      const response = {
        id: '2',
        product_id: '2',
        reported: 'false',
        helpfulness: '1'
      };

      await addHelp(req);

      const { rows } = await client.query(`SELECT id, product_id, reported, helpfulness FROM reviews
        WHERE product_id = $1`, ['2']);

      expect(rows).lengthOf(1);
      expect(rows[0]).to.deep.equal(response);
    });

    it('Should fail if review id is not given', async () => {
      const req = {
        something: 1,
        bad: 5
      };

      await addHelp(req, 500);
    });
  });

  describe('PUT /reportreview', () => {
    it('Should update reported column for a review', async () => {
      const req = {
        review_id: '2'
      };
      const response = {
        id: '2',
        product_id: '2',
        reported: 'true',
        helpfulness: '0'
      };

      await reportReview(req);

      const { rows } = await client.query(`SELECT id, product_id, reported, helpfulness FROM reviews
        WHERE product_id = $1`, ['2']);

      expect(rows).lengthOf(1);
      expect(rows[0]).to.deep.equal(response);
    });

    it('Should fail if review id is not given', async () => {
      const req = {
        something: 1,
        bad: 5
      };

      await reportReview(req, 500);
    });
  });

  const postReview = async (req, status = 201) => {
    const { body } = await request(app)
      .post('/addreview')
      .send(req)
      .expect(status);
    return body;
  };

  const getReview = async (req, status = 200) => {
    const { body } = await request(app)
      .get('/dbreviews')
      .send(req)
      .expect(status);
    return body;
  };

  const getMeta = async (req, status = 200) => {
    const { body } = await request(app)
      .get('/dbmeta')
      .send(req)
      .expect(status);
    return body;
  };

  const addHelp = async (req, status = 204) => {
    const { body } = await request(app)
      .put('/addHelp')
      .send(req)
      .expect(status);
    return body;
  };

  const reportReview = async (req, status = 204) => {
    const { body } = await request(app)
      .put('/reportreview')
      .send(req)
      .expect(status);
    return body;
  }

});
