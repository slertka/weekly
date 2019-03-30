"use strict";

// Dependencies
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const passport = require("passport");
const mongoose = require("mongoose");

// Routes
const { router } = require("./app/routes");
const { router: eventRouter } = require("./app/eventRouter");
const { router: taskRouter } = require("./app/taskRouter");

// Auth Strats
const { localStrategy, jwtStrategy } = require("./app/controllers/auth");

// Config
const { PORT, DATABASE_URL } = require("./config");

const app = express();

app.use(express.static("public"));
app.use(morgan("common"));
app.use(express.json());
app.use(passport.initialize());

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use("/", router);
app.use("/planner/events", eventRouter);
app.use("/planner/tasks", taskRouter);

let server;
function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, { useNewUrlParser: true }, err => {
      if (err) {
        return reject(err);
      }
      server = app
        .listen(port, () => {
          console.log(`Your app is now listening on port ${port}`);
          resolve();
        })
        .on("error", err => {
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
