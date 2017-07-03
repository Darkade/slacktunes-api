// Import express and request modules
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var Mopidy = require('mopidy');

// Store our app's ID and Secret. These we got from Step 1.
// For this tutorial, we'll keep your API credentials right here. But for an actual app, you'll want to  store them securely in environment variables.
var clientId = process.env.SLACKID;
var clientSecret = process.env.SLACKSECRET;

var mopidyurl = process.env.MOPIDYURL || '192.168.99.100';
var mopidyport = process.env.MOPIDYPORT || '6680';

// Instantiates Mopidy Websockets
var mopidy = new Mopidy({ webSocketUrl: `ws://${mopidyurl}:${mopidyport}/mopidy/ws/` });

// Instantiates Express and assigns our app variable to it
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Again, we define a port we want to listen to
const PORT=4390;
// Lets start our server
app.listen(PORT, function () {
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Slacktunes listening on port " + PORT);
});


// This route handles GET requests to our root ngrok address and responds with the same "Ngrok is working message" we used before
app.get('/', function(req, res) {
    res.send('Ngrok is working! Path Hit: ' + req.url);
});

// This route handles get request to a /oauth endpoint. We'll use this endpoint for handling the logic of the Slack oAuth process behind our app.
app.get('/oauth', function(req, res) {
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

///////////////////////////
// Slack Commands /////////
///////////////////////////

app.post('/command', function(req, res) {
  console.log('Resolving command...', req.body.text);

  switch (req.body.text.split(" ")[0]){

    case "search":
      res.send("Search a song");
      break;

    case "prev":
      res.send("Previous Song");
      break;

    case "add":
      res.send("Adding a song");
      break;

    case "skip":
      res.send("Skip Song");
      break;

    case "list":
      res.send("Playlist");
      break;

  }

});
