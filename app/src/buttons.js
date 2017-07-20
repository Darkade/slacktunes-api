let mpd = require('./backend/mopidyws');

let mopidy = mpd.mopidy;

exports.buttons = function(req, res){
  let body = JSON.parse(req.body.payload);
  let actions = body.actions;
  let callback = body.callback_id;

  switch (callback){
    case "addSong":
      let songuri = actions[0].selected_options[0].value;

      mopidy.tracklist.add(null, null, songuri, null)
      .done((songName)=>{
        res.send(`Se agregó`)
      })

      mopidy.playback.getCurrentTrack()
      .then((track)=>{
        if (!track){
          mopidy.playback.play()
        }
      })
    break;
  }
}
