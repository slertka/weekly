require('dotenv').config();
const chai = require('chai');
const chaiHttp = require('chai-http');
const randomString = require('randomstring');
const jwt = require('jsonwebtoken');

const expect = chai.expect;

const { User } = require('../app/models/user');
const { Task } = require('../app/models/task');
const { Cal, Event} = require('../app/models/calendar');
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
            expect(res.body).to.have.keys('username', '_id');
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
            expect(res).to.have.status(201);
            expect(res).to.be.a('object');
          })
      })
    })
  })

})

describe('Returning planner data', function() {
  let user, task, event, cal;

  before(function() {
    return runServer(process.env.TEST_DATABASE_URL);
  })

  after(function() {
    return closeServer();
  })

  // Create serialized user to return both username and _id
  beforeEach(function() {
    return User.hashPassword(password)
      .then(password => {
        return User.create({
          username,
          password
        })
      .then(_user => {
        user = _user;
        return user.serialize();
      });
      });
  });

  // Create cal with event added to each day
  beforeEach(function() {
    event = {
      title: "test event",
      startTime: "13:00",
      notes: "test notes"
    };
    
    return Cal.create({
      0: [event],
      1: [event],
      2: [event],
      3: [event],
      4: [event],
      5: [event],
      6: [event],
      user: user._id
    }).then(_cal => cal = _cal);
  });

  // Create task
  beforeEach(function() {
    return Task.create({
      title: "test title",
      notes: "test notes",
      complete: false,
      priority: true,
      user: user._id
    })
      .then(_task => task = _task);
  });

  // Delete User
  afterEach(function() {
    return User.deleteMany();
  })

  // Delete Cal
  afterEach(function() {
    return Cal.deleteMany();
  })

  // Delete Tasks
  afterEach(function() {
    return Task.deleteMany()
  })

  describe('GET', function() {
    describe('/planner/events', function() {
      it('should not return data with invalid credentials', function() {
        return chai.request(app).get('/planner/events')
          .then(res => 
            expect(res).to.have.status(401)
          )
      })

      it('should reject requests with an invalid token', function() {
        const token = jwt.sign(
          {user},
          'wrongSecret',
          {
            algorithm: 'HS256',
            subject: user.username,
            expiresIn: process.env.JWT_EXPIRY
          }
        );

        return chai.request(app).get('/planner/events')
          .set('Authorization', `Bearer ${token}`)
          .then(res => {
            expect(res).to.have.status(401);
          })
      })

      it('should return events data associated with the user', function() {
        const token = jwt.sign(
          {user},
          process.env.JWT_SECRET,
          {
            algorithm: 'HS256',
            subject: user.username,
            expiresIn: process.env.JWT_EXPIRY
          }
        );

        return chai.request(app).get('/planner/events')
          .set('Authorization', `Bearer ${token}`)
          .then(res => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.keys('cal');
            expect(res.body.cal).to.be.a('array');
            
            const resCal = res.body.cal[0];
            expect(resCal).to.have.keys('user', '_id', '__v', 0, 1, 2, 3, 4, 5, 6);
            expect(resCal[0]).to.be.a('array');

            const resEvent = resCal[0][0];
            expect(resEvent).to.have.keys('title', '_id', 'notes', 'startTime')
            expect(resEvent.title).to.equal(event.title);
            expect(resEvent.notes).to.equal(event.notes);
            expect(resEvent.startTime).to.equal(event.startTime)
          })
      })
    })

    describe('/planner/tasks', function() {
      it('should not return data with invalid credentials', function() {
        return chai.request(app).get('/planner/tasks')
          .then(res => {
            expect(res).to.have.status(401);
          })
      })

      it('should reject requests with an invalid token', function() {
        const token = jwt.sign(
          {user},
          'wrongSecret',
          {
            algorithm: 'HS256',
            subject: user.username,
            expiresIn: process.env.JWT_EXPIRY
          }
        );

        return chai.request(app).get('/planner/tasks')
          .set('Authorization', `Bearer ${token}`)
          .then(res => {
            expect(res).to.have.status(401);
          })
      })

      it('should return tasks data associated with the user', function() {
        const token = jwt.sign(
          {user},
          process.env.JWT_SECRET,
          {
            algorithm: 'HS256',
            subject: user.username,
            expiresIn: process.env.JWT_EXPIRY
          }
        );

        return chai.request(app).get('/planner/tasks')
          .set('Authorization', `Bearer ${token}`)
          .then(res => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.keys('tasks');
            expect(res.body.tasks).to.be.a('array');

            const resTask = res.body.tasks[0];
            expect(resTask).to.have.keys('_id', 'title', 'notes', 'priority', 'complete', 'user', '__v');
            expect(resTask.title).to.equal(task.title);
            expect(resTask.notes).to.equal(task.notes);
            expect(resTask.priority).to.equal(task.priority);
            expect(resTask.complete).to.equal(task.complete);
          })
      })
    })
  })
})

