let backend = require('./backend/backend');

function getCommand(body) {
  return body.text.split(" ")[0];
}
function getQuery(body){
  return body.text.split(" ").slice(1).join(" ");
}
function getUrl(body){
  return body.response_url;
}
function getUser(body){
  return body.user_name;
}

exports.commands = function(req, res) {
  let command = getCommand(req.body);
  let query = getQuery(req.body);
  let url = getUrl(req.body);
  let user = getUser(req.body);

  console.log("Solving...", {"command": command, "query": query});

  switch (command){
    case "search":
      res.send("I'm searching for your tracks...");
      backend.search(query, url);
    break;

    case "skip":
      res.send("Skipping!")
      backend.skip(user, url);
    break;

    case "list":
      res.send("I'm getting the playlist...");
      backend.list(url);
    break;

    case "clear":
      res.send("Clearing the queue...");
      backend.clear(user, url);
    break;

    default:
      let re_music = /https?:\/\/play\.google\.com\/music\/m\/(\w+)\??.*/g
      let re_yt1 = /https?:\/\/youtu\.be\/(\w+)\??.*/g
      let re_yt2 = /https?:\/\/(www\.)?youtube\.com\/watch\?v=(\w+)&?.*/g

      // Tbzepahs5jrdnaj3rbjuhjin7hi
      // 6vwNcNOTVzY

      let songid = (re_music.exec(command) || re_yt1.exec(command) || re_yt2.exec(command) || []).pop();

      if (songid){
        res.send("Let me add that to the playlist...");
        console.log("<<<<<<", songid, songid.length, songid.length > 11);
        let uri = "";
        if (songid.length > 11){
          console.log("<<<< gmusic");
          uri = "gmusic:track:" + songid;
        } else {
          console.log("<<<< youtube");
          uri = "yt:http://www.youtube.com/watch?v=" + songid;
        }

        backend.add(uri, url);
      }
      else{
        res.send("That's not a slacktunes command. Try typing `/mopidy` to learn more");
      }

  }
}
