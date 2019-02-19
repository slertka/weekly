const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

const { User } = require('../app/models/user');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);

describe('/user', function() {
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
  const usernameB = "friedchicken";
  const passwordB = "yummyfood";
  
  describe('/user', function() {
    describe('POST', function() {

      it('should throw an error when username is a non-string object type', function() {
        return chai
          .request(app)
          .post('/user')
          .send({
            username: 1234,
            password
          })
          .then((res) => {
            expect(res.body.code).to.equal(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Incorrect field type: expected string');
            expect(res.body.location).to.equal('username');
          })
      })

      it('should throw an error when password is a non-string object type', function() {
        return chai
          .request(app)
          .post('/user')
          .send({
            username,
            password: 1234
          })
          .then((res) => {
            expect(res.body.code).to.equal(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Incorrect field type: expected string');
            expect(res.body.location).to.equal('password');
          })
      })

      it('should create a new user', function() {
        return chai
          .request(app)
          .post('/user')
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

