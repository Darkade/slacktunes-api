// Instantiates Mopidy Websockets
var env = require('../env');
var Mopidy = require('mopidy');

function readyForCalls(){
  console.log(">>> READY FOR API CALLS <<<");
}

exports.mopidy = new Mopidy({ webSocketUrl: `ws://${env.mopidyurl}:${env.mopidyport}/mopidy/ws/` });
exports.mopidy.on("state:online", readyForCalls);
