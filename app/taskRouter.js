const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");

const router = express.Router();

const { Task } = require("./models/task");
const { jwtStrategy } = require("./controllers/auth");

passport.use(jwtStrategy);

router.use(bodyParser.urlencoded({ extended: true }));

// JSON Web Token Strategy
const jwtStrat = passport.authenticate("jwt", { session: false });

/// Access Protected Data - Tasks
router.get("/", jwtStrat, (req, res) => {
  const { _id } = req.user;

  // Find tasks associated with user
  Task.find({ user: _id }).then(tasks => res.json({ tasks }));
});

// Create new task
router.post("/", jwtStrat, (req, res) => {
  const { _id } = req.user;
  const { title, notes, priority } = req.body;

  Task.create({
    title,
    notes,
    priority,
    complete: "off",
    user: _id
  }).then(task => res.status(201).json({ task }));
});

// Update existing task
router.put("/:id", jwtStrat, (req, res) => {
  const { _id } = req.body;
  const { title, notes, complete, priority } = req.body;

  // Verify param id and body id match
  if (!(req.params.id && _id && req.params.id === _id)) {
    return res.status(400).json({
      error: "Request path id and body _id must match"
    });
  }

  // Determine fields to update
  const update = {};
  const updateableFields = ["title", "notes", "complete", "priority"];
  updateableFields.forEach(field => {
    if (field in req.body) {
      update[field] = req.body[field];
    }
  });

  // Update tasks
  return Task.findByIdAndUpdate(_id, { $set: update }, { new: true }).then(
    updatedTask => {
      res.status(204).json(updatedTask);
    }
  );
});

// Delete existing task
router.delete("/:id", jwtStrat, (req, res) => {
  return Task.findByIdAndDelete(req.params.id).then(() =>
    res.status(204).end()
  );
});

module.exports = { router };
