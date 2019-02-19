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

