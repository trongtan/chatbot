require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var botController = require('./controllers/BotController');

var app = express();

app.use(bodyParser.json())
app.use(botController)

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
