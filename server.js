'use strict';
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const mongoose = require('mongoose');

const { router } = require('./app/routes');
const { router: authRouter } = require('./app/authRoutes');
const { localStrategy } = require('./app/controllers/auth');

const app = express();
const { DATABASE_URL, PORT } = require('./config');

app.use(express.static('public'));
app.use(morgan('common'));
app.use(express.json());

passport.use(localStrategy);

app.use('/', router);   
app.use('/user', authRouter);                       

let server;
function runServer(databaseUrl, port = PORT ) { 
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, 
      { useNewUrlParser: true },
      err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is now listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer() {
  mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log(`Closing server`);
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.log(err));
}

module.exports = { app, runServer, closeServer };
