const chai = require('chai');
const chaiHttp = require('chai-http');
const randomString = require('randomstring');

const expect = chai.expect;

const { User } = require('../app/models/user');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);

describe('User creation verification', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  after(function() {
    return closeServer();
  });

  afterEach(function() {
    return User.deleteMany({});
  })

  const username = "rocketship101";
  const password = "blastoff205";
  
  describe('/signup', function() {
    describe('POST', function() {

      it('should send an error when username is a non-string object type', function() {
        return chai
          .request(app)
          .post('/signup')
          .send({
            username: 1234,
            password
          })
          .then((res) => {
            expect(res).to.have.status(422);
            expect(res.body.code).to.equal(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Incorrect field type: expected string');
            expect(res.body.location).to.equal('username');
          })
      })

      it('should send an error when password is a non-string object type', function() {
        return chai
          .request(app)
          .post('/signup')
          .send({
            username,
            password: 1234
          })
          .then((res) => {
            expect(res).to.have.status(422);
            expect(res.body.code).to.equal(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Incorrect field type: expected string');
            expect(res.body.location).to.equal('password');
          })
      })

      it('should send an error when username does not meet minimum field length', function() {
        return chai
          .request(app)
          .post('/signup')
          .send({
            username: '',
            password
          })
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.code).to.equal(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Must be at least 1 character(s) long');
            expect(res.body.location).to.equal('username');
          })
      })

      it('should send an error when password exceeds maximum field length', function() {
        return chai
          .request(app)
          .post('/signup')
          .send({
            username,
            password: randomString.generate(73)
          })
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.code).to.equal(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Must be less than 72 characters long');
            expect(res.body.location).to.equal('password');
          })
      })

      it('should send an error when password does not meet minimum field length', function() {
        return chai
          .request(app)
          .post('/signup')
          .send({
            username,
            password: ''
          })
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.code).to.equal(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Must be at least 8 character(s) long');
            expect(res.body.location).to.equal('password');
          })
      })

      it('should create a new user', function() {
        return chai
          .request(app)
          .post('/signup')
          .send({
            username,
            password
          })
          .then(res => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.keys('username');
            expect(res.body.username).to.equal(username);
            return User.findOne({username});
          })
          .then(user => {
            expect(user).to.not.be.null;
            return user.validatePassword(password);
          })
          .then(passwordIsCorrect => {
            expect(passwordIsCorrect).to.be.true;
          })
      })
    })
  })
})

