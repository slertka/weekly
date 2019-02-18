'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const { router: plannerRouter } = require('./app/routes');

const app = express();
const { DATABASE_URL, PORT } = require('./config');

app.use(express.static('public'));
app.use(morgan('common'));
app.use(express.json());

app.use('/planner', plannerRouter);                          

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
