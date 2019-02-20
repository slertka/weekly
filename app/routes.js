const express = require('express');
const path = require('path');

const router = express.Router();

router.use(express.json());

const root = path.join(__dirname, "..");

router.get('/planner', (req, res) => {
  res.sendFile(path.join(root + '/views/planner.html'));
})

module.exports = { router };