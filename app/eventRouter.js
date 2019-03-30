const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const sortArray = require("sort-array");

const router = express.Router();

const { User } = require("./models/user");
const { Cal } = require("./models/calendar");
const { Task } = require("./models/task");
const { JWT_SECRET, JWT_EXPIRY } = require("../config");
const { jwtStrategy } = require("./controllers/auth");

passport.use(jwtStrategy);

router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));

// JSON Web Token Strategy
const jwtStrat = passport.authenticate("jwt", { session: false });

// Access Protected Data - Planner Events
router.get("/", jwtStrat, (req, res) => {
  const { _id } = req.user;

  // Find planner associated with user
  Cal.find({ user: _id }).then(_cal => {
    let cal = {};
    for (let i = 0; i <= 6; i++) {
      cal[i] = sortArray(_cal[0][i], "startTime");
    }
    cal.user = _id;
    res.json(cal);
  });
});

// Create new event
router.post("/", jwtStrat, (req, res) => {
  const { _id } = req.user;
  const { title, notes, startTime, day } = req.body;

  return Cal.find({ user: _id })
    .then(cal => {
      return cal[0];
    })
    .then(cal => {
      cal[day].push({ title, notes, startTime });
      console.log(
        cal[day].sort(function(a, b) {
          return b.startTime - a.startTime;
        })
      );
      return cal.save();
    })
    .then(() => {
      return res.status(201).end();
    })
    .catch(err => console.log(err));
});

// Update existing event
router.put("/:id", jwtStrat, (req, res) => {
  const requestBody = req.body;

  let eventId = requestBody._id;
  let { day, title, notes, startTime } = requestBody;

  // Verify param id and body id match
  if (!(req.params.id && eventId && req.params.id === eventId)) {
    return res.status(400).json({
      error: "Request path id and body _id must match"
    });
  }

  // Determine fields to update
  const update = {};
  const updateableFields = ["title", "notes", "startTime"];
  updateableFields.forEach(field => {
    if (field in req.body) {
      let updateKey = day + ".$." + field;
      update[updateKey] = req.body[field];
    }
  });

  // Create query document object for event
  const eventIdQ = day + "._id";
  let query = {};
  query[eventIdQ] = eventId;

  // Update event
  return Cal.updateOne(
    query,
    { $set: update },
    { returnNewDocument: true }
  ).then(event => {
    res.status(204).end();
  });
});

// Delete existing event
router.delete("/planner/events/:id", jwtStrat, (req, res) => {
  let day = req.body.day;
  let eventId = req.body._id;

  // Verify param id and body id match
  if (!(req.params.id && eventId && req.params.id === eventId)) {
    return res.status(400).json({
      error: "Request path id and body _id must match"
    });
  }

  // Create query document object for event
  const eventIdQ = day + "._id";
  let query = {};
  query[eventIdQ] = eventId;

  // Create delete document query object
  let removeQ = {};
  removeQ[day] = { _id: eventId };

  // return res.end();
  return Cal.update(query, { $pull: removeQ }).then(res.status(204).end());
});

module.exports = { router };
