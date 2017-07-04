// Import express and request modules
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var Mopidy = require('mopidy');

// Get Environment Apps
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

// Start app in PORT
const PORT=4390;
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

var returnSearchResult = function(searchResult){
  let tracks = searchResult[1].tracks.slice(0,5);
  for (let track of tracks){
    console.log(`${track.name} – ${track.album.name} (${track.date})`);
  }
  return {
      "text": "Would you like to play a game?",
      "attachments": [
          {
              "text": "Choose a game to play",
              "fallback": "You are unable to choose a game",
              "callback_id": "wopr_game",
              "color": "#3AA3E3",
              "attachment_type": "default",
              "actions": [
                  {
                      "name": "game",
                      "text": "Chess",
                      "type": "button",
                      "value": "chess"
                  },
                  {
                      "name": "game",
                      "text": "Falken's Maze",
                      "type": "button",
                      "value": "maze"
                  },
                  {
                      "name": "game",
                      "text": "Thermonuclear War",
                      "style": "danger",
                      "type": "button",
                      "value": "war",
                      "confirm": {
                          "title": "Are you sure?",
                          "text": "Wouldn't you prefer a good game of chess?",
                          "ok_text": "Yes",
                          "dismiss_text": "No"
                      }
                  }
              ]
          }
      ]
  }
}

app.post('/command', function(req, res) {
  console.log('Resolving command...', req.body.text);

  let command = req.body.text.split(" ")[0];
  let query = req.body.text.split(" ").slice(1).join(" ");

  switch (command){

    case "search":
      mopidy.library.search({'any': [query]})
                    .then(returnSearchResult)
                    .then(function(msg){
                      res.send(msg)
                    });
//      res.send("Search a song");
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
