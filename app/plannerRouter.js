const express = require('express');
const router = express.Router();
const path = require('path');


router.use(express.json());

const root = path.join(__dirname, "..");

router.get('/', (req, res) => {
  res.sendFile(path.join(root + '/views/planner.html'));
})

module.exports = { router };