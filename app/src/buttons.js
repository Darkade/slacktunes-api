let mpd = require('./backend/mopidyws');
let mopidy = mpd.mopidy;
let backend = require('./backend/backend');

exports.buttons = function(req, res){
  let body = JSON.parse(req.body.payload);
  let actions = body.actions;
  let callback = body.callback_id;
  let url = body.response_url;

  switch (callback){
    case "addSong":
      let songuri = actions[0].selected_options[0].value;
      res.send("...adding");
      backend.add(songuri, url);
    break;
  }
}
