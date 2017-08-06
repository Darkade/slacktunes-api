let mpd = require('./backend/mopidyws');

let mopidy = mpd.mopidy;

exports.buttons = function(req, res){
  let body = JSON.parse(req.body.payload);
  let actions = body.actions;
  let callback = body.callback_id;

  switch (callback){
    case "addSong":
      let songuri = actions[0].selected_options[0].value;

      mopidy.playback.getState()
      .then((state)=>{
        console.log("ESTADO:", state);
        if (state == "stopped"){
          console.log("ESTAPARADO")
          mopidy.tracklist.clear()
        }
        return true;
      })
      .then(()=>{
        console.log("Agregar")
        mopidy.tracklist.add(null, null, songuri, null)
        .done((tltrack)=>{
          res.send(`Se agregó ${tltrack[0].track.name}`)
        })
        return true;
      })
      .then(()=>{
        mopidy.playback.getState()
        .then((state)=>{
          console.log("ESTADO:", state);
          if (state != "playing"){
            console.log("ESTAPARADO")
            mopidy.playback.play()
          }
          return true;
        })


      })

    break;
  }
}
