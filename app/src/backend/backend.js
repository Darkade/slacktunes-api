let mpd = require('./mopidyws');
let comm = require('./comm');
var env = require('../env');

let mopidy = mpd.mopidy;
let SendMessage = comm.SendMessage;

function SearchMessage(searchResult){
  console.log("... looking for tracks");
  let msg = "";

  if (searchResult.length >= 1) {
    let results = searchResult.pop();
    if(results.tracks){
      let tracks = results.tracks.slice(0,5);
      let options = Array();

      for (let track of tracks){
        options.push({"text": `${track.name} – ${track.album.artists[0].name} – ${track.album.name} (${track.date})`,
        "value": track.uri});
      }

      msg = {
        "text": "I found these songs:",
        "response_type": "ephemeral",
        "attachments": [
          {
            "text": "Choose one to add to the playlist...",
            "fallback": "Found some songs...",
            "color": "#3AA3E3",
            "attachment_type": "default",
            "callback_id": "addSong",
            "actions": [
              {
                "name": "searchresults",
                "text": "Pick a song...",
                "type": "select",
                "options": options
              }
            ]
          }
        ]
      }
    }
  }
  else {
    msg = {
      "text": "I found no songs!",
      "response_type": "ephemeral"
    }
  }
  return msg
}

function QueueMessage(tracks){
  let tracklist = Array();
  let msg = "";
  if (tracks.length > 0){
    for (let tltrack of tracks){
      let track = tltrack.track;
      tracklist.push(`${ tltrack.tlid }. ${track.name} – ${track.album.artists[0].name}`);
    }
    msg = {
      "text": "This is the current tracklist",
      "attachments": [{
        "title": "Tracklist",
        "text": tracklist.join("\n"),
      }],
      "response_type": "ephemeral"
    }
  }
  else {
    msg = {
      "text": "The playlist is empty! Go add some tracks with `/mopidy search`",
      "response_type": "ephemeral"
    }
  }

  return msg
}

function SkipMessage(track, user){
  let msg = "";
  console.log("Skipping track")
  if (track){
    msg = {
      "text": `"${track.name}" was skipped by @${user}`,
      "fallback": "Track skipped",
      "response_type": "in_channel"
    }
  }
  else {
    msg = {
      "text":"There's no track playing. Go add one with `/mopidy search`",
      "response_type": "ephimeral"
    }
  }
  return msg
}

function ClearMessage(user){
  console.log("Clearing playlist")
  let msg = {
    "text": `Playlist was cleared by @${user}`,
    "fallback": "Playlist cleared",
    "response_type": "in_channel"
  }
  return msg
}

function NowPlayingMessage(track){
  let artists = track.album.artists || [{'name': ""}];
  let msg = {
    "fallback": `Now playing ${track.name}`,
    "response_type": "in_channel",
    "attachments": [
      {
        "pretext": "_Now Playing:_",
        "title": track.name,
        "title_link": serviceLink(track.uri),
        "text": `${artists[0].name} - ${track.album.name}`,
        "mrkdwn_in": [
          "text",
          "pretext",
          "footer"
        ],
        "thumb_url": track.album.images[0] || "",
        "footer": `<${env.listenurl}|Listen here!> | Try typing \`/mopidy\` to learn more!`,
        "footer_icon": "https://emoji.slack-edge.com/T2A1W6938/cassette/daff7a64b5c7863d.png",
      }
    ]
  }
  return msg
}

function serviceLink(songuri){
  return "https://play.google.com/music/m/" + songuri.split(":").pop()
}

function isStopped(state){
  return state == "stopped"
}

function addSongUri(songuri){
  return mopidy.tracklist.add(null, null, songuri, null)
}

function addedMessage(tltracks){
  let msg = {
    "text": `${tltracks[0].track.name} – added to tracklist`,
    "response_type": "ephemeral"
  }
  return msg
}

function playStopped(){
  mopidy.playback.getState()
  .then((state)=>{
    if (state != "playing"){
      mopidy.playback.play()
    }
    return true;
  })
}

/***********************/

exports.postSong = function (){
  mopidy.playback.getCurrentTrack()
  .then(NowPlayingMessage)
  .done((msg) => { SendMessage(msg, env.slackhook) });
}

exports.search = function (query, url){
  mopidy.library.search({'any': [query]}, uris=['gmusic:'])
  .then(SearchMessage)
  .done((msg) => { SendMessage(msg, url) });
}

exports.list = function (url){
  mopidy.tracklist.getTlTracks()
  .then(QueueMessage)
  .done((msg)=>{ SendMessage(msg, url) });
}

exports.skip = function (user, url){
  mopidy.playback.getCurrentTrack()
  .then((track)=>{ return SkipMessage(track, user) })
  .then((msg) => { SendMessage(msg, url) })
  .done(()=>{ mopidy.playback.next(); });
}

exports.clear = function (user, url){
  mopidy.tracklist.clear()
  .then(()=>{ return ClearMessage(user) })
  .done((msg)=> { SendMessage(msg, url) });
}

exports.add = function (songuri, url){
  mopidy.playback.getState()
  .then(isStopped)
  .then((clear)=>{
    if (clear) {
      mopidy.tracklist.clear()
    }
    return songuri
  })
  .then(addSongUri)
  .then(addedMessage)
  .then((msg)=> { SendMessage(msg, url) })
  .then(playStopped)
}
