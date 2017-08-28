var express = require('express');
var bodyParser = require('body-parser');

var env = require('./src/env');
var commands = require('./src/commands');
var buttons = require('./src/buttons');
var events = require('./src/events');
var slackevents = require('./src/slackevents');

// Instantiates Express and assigns our app variable to it
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Start app in PORT
const PORT=4390;
app.listen(PORT, () => {
  console.log("Slacktunes listening on port " + PORT);
});

app.get('/', (req, res) => {res.send("... listening")});
app.get('/oauth', (req, res)=>{
  // When a user authorizes an app, a code query parameter is passed on the oAuth endpoint. If that code is not there, we respond with an error message
  if (!req.query.code) {
    res.status(500);
    res.send({"Error": "Looks like we're not getting code."});
    console.log("Looks like we're not getting code.");
  } else {
    // If it's there...

    // We'll do a GET call to Slack's `oauth.access` endpoint, passing our app's client ID, client secret, and the code we just got as query parameters.
    request({
      url: 'https://slack.com/api/oauth.access', //URL to hit
      qs: {code: req.query.code, client_id: clientId, client_secret: clientSecret}, //Query string data
      method: 'GET', //Specify the method

    }, function (error, response, body) {
      if (error) {
        console.log(error);
      } else {
        res.json(body);

      }
    })
  }
});

app.post('/command', commands.commands);
app.post('/buttons', buttons.buttons);
app.post('/events', slackevents.slackevents);
