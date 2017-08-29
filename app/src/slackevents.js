let backend = require('./backend/backend');
var env = require('./env');


exports.slackevents = function(req, res){
  let body = req.body;

  if (body.challenge){
    res.send(body.challenge);
  }

  event_type = body.event.type;

  switch (event_type){
    case "link_shared":
      links = body.event.links;

      for (let link of links){
        if (link.domain == 'play.google.com'){
          // https://play.google.com/music/m/Tbzepahs5jrdnaj3rbjuhjin7hi?t=Sonido_Amazonico_-_Chicha_Libre
          let re = /https?:\/\/play\.google\.com\/music\/m\/(\w+)\??.*/g

          let myarray = re.exec(link.url);
          let uri = "gmusic:track:" + myarray[1];
          backend.add(uri, env.slackhook);
          res.send({ "ok": true });
        }

        if (link.domain == 'youtu.be'){
          // https://youtu.be/6vwNcNOTVzY?t=43s
          let re = /https?:\/\/youtu\.be\/(\w+)\??.*/g

          let myarray = re.exec(link.url);
          let uri = "yt:http://www.youtube.com/watch?v=" + myarray.pop();

          backend.add(uri, env.slackhook);
          res.send({ "ok": true });
        }

        if (link.domain == 'youtube.com'){
          // https://www.youtube.com/watch?v=1cQh1ccqu8M&list=PLyjgHc47unfT3BIZo5uEt2a-2TWKy54sU
          let re = /https?:\/\/(www\.)?youtube\.com\/watch\?v=(\w+)&?.*/g

          let myarray = re.exec(link.url);
          let uri = "yt:http://www.youtube.com/watch?v=" + myarray.pop();

          backend.add(uri, env.slackhook);
          res.send({ "ok": true });
        }

      }
    break;
  }
}
