'use strict';

require('dotenv').config();
const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Home Page', function() {
  before(function() {
    return runServer(process.env.TEST_DATABASE_URL);
  });

  after(function() {
    return closeServer();
  })

  it('should display home page when opened', function() {
    return chai.request(app)
      .get('/')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.html;
      })
      .catch(function(err) {
        console.log(err);
      })
  })
})