'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const { TEST_DATABASE_URL } = require('../config');
const { app, runServer, closeServer } = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Planner integrated testing', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL);
  })

  after(function() {
    return closeServer();
  })

  it('should load an HTML page successfully when called', function() {
    return chai.request(app)
      .get('/planner')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.html;
      })
      .catch(function(err) {
        console.log(err);
      })
  })
})