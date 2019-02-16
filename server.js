const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(express.static('public'));
app.use(morgan('common'));
app.use(express.json());

app.listen(process.env.PORT || 8080);

module.exports = { app };
