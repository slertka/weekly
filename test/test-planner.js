'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require('../server');

const expect = chai.expect;

describe('Planner integrated testing', function() {

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