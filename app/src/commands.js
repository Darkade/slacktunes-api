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
      if (command.slice(0,4)=="http"){
        res.send("Let me add that to the playlist...");
        let uri = backend.getUri(command);
        backend.add(uri, url);
      }
      else{
        res.send("That's not a slacktunes command. Try typing `/mopidy` to learn more");
      }

  }
}
