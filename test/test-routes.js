require('dotenv').config();
const chai = require('chai');
const chaiHttp = require('chai-http');
const randomString = require('randomstring');
const jwt = require('jsonwebtoken');

const expect = chai.expect;

const { User } = require('../app/models/user');
const { app, runServer, closeServer } = require('../server');

chai.use(chaiHttp);

const username = "rocketship101";
const password = "blastoff205";
const password2 = "blastoff205";

describe('User creation', function() {
  before(function() {
    return runServer(process.env.TEST_DATABASE_URL);
  });

  after(function() {
    return closeServer();
  });

  afterEach(function() {
    return User.deleteMany({});
  })
  
  describe('/signup', function() {
    describe('GET', function() {
      it('should load a view when requested', function() {
        return chai.request(app).get('/signup')
          .then(res => {
            expect(res).to.have.status(200);
            expect(res).to.be.html;
          })
      })
    })

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

      it('should send an error when username starts with whitespace', function() {
        return chai
          .request(app)
          .post('/signup')
          .send({
            username: ' test',
            password
          })
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.code).to.equal(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Cannot start or end with whitespace');
            expect(res.body.location).to.equal('username');
          })
      })

      it('should send an error when username ends with whitespace', function() {
        return chai
          .request(app)
          .post('/signup')
          .send({
            username: 'test ',
            password
          })
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.code).to.equal(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Cannot start or end with whitespace');
            expect(res.body.location).to.equal('username');
          })
      })

      it('should send an error when password starts with whitespace', function() {
        return chai
          .request(app)
          .post('/signup')
          .send({
            username,
            password: ' test1234'
          })
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.code).to.equal(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Cannot start or end with whitespace');
            expect(res.body.location).to.equal('password');
          })
      })

      it('should send an error when password ends with whitespace', function() {
        return chai
          .request(app)
          .post('/signup')
          .send({
            username,
            password: 'test1234 '
          })
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.code).to.equal(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Cannot start or end with whitespace');
            expect(res.body.location).to.equal('password');
          })
      })

      it('should send an error when passwords do not match', function() {
        return chai.request(app).post('/signup').send({ username, password, password2: 'test1234'})
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.code).to.equal(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Passwords do not match');
            expect(res.body.location).to.equal('password');
          })
      })

      it('should send an error if the username already exists', function() {
        return User.create({
          username,
          password
        })
        .then(() => {
          return chai.request(app).post('/signup').send({username, password, password2})
        })
        .then(res => {
          expect(res).to.have.status(422);
          expect(res.body.reason).to.equal('ValidationError');
          expect(res.body.message).to.equal('Username already exists');
          expect(res.body.location).to.equal('username');
        })
      })

      it('should create a new user', function() {
        return chai
          .request(app)
          .post('/signup')
          .send({
            username,
            password, 
            password2
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

describe('User credential verification', function() {
  before(function() {
    return runServer(process.env.TEST_DATABASE_URL);
  });

  after(function() {
    return closeServer();
  });

  beforeEach(function() {
    return User.hashPassword(password).then(password => {
      return User.create({
        username,
        password
      });
    });
  });

  afterEach(function() {
    return User.deleteMany({});
  });

  describe('/login', function() {
    describe('GET', function() {
      it('should load a view when requested', function() {
        return chai.request(app).get('/login')
          .then(res => {
            expect(res).to.have.status(200);
            expect(res).to.be.html;
          })
      })
    });

    describe('POST', function() {
      it('should generate a JWT with valid credentials', function() {
        return chai.request(app).post('/login').send({username, password})
          .then(res => {
            expect(res).to.have.status(200);
            expect(res).to.be.a('object');
          })
      })
    })
  })

})

