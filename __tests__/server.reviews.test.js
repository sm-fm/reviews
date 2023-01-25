/**
 * @jest-environment node
 */

// import request from 'supertest';
// import express from 'express';
// import index from ''
// import initGetData from "../server/controllers/initGetData.js";
// import postData from '../server/controllers/postData.js';
// import putData from'../server/controllers/putData.js';
// import deleteData from'../server/controllers/deleteData.js';

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

  //Creating temp tables
  beforeEach(async () => {
    await client.query('CREATE TEMPORARY TABLE reviews (LIKE reviews INCLUDING ALL)');
  });

  //Insert fake data to test PUT requests
  beforeEach(async () => {
    await client.query(`INSERT INTO pg_temp.reviews (id, product_id, reported, helpfulness) VALUES
      ('2', '2', 'false', '0')`);
  });

  //Drop temp tables
  afterEach(async () => {
    await client.query('DROP TABLE pg_temp.reviews');
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
    });

  })

  const postReview = async (req, status = 201) => {
    const { body } = await request(app)
      .post('/addreview')
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


// describe('Testing Home Route', function () {
//   const app = new express();
//   app.use('/', initGetData.redirectFromHome);

//   test('should redirect with status code 304', async () => {
//     const res = await request(app).get('/');
//     expect(res.statusCode).toBe(302);
//   });
// });