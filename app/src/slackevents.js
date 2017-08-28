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
      let re = /https:\/\/play.google.com\/music\/m\/([a-zA-Z0-9]+)\?t=.+/g

      for (let link of links){
        if (link.domain == 'play.google.com'){
          let myarray = re.exec(link.url);
          let uri = "gmusic:track:" + myarray[1];
          backend.add(uri, env.slackhook)
          res.send({ "ok": true });
        }
      }
    break;
  }
}
