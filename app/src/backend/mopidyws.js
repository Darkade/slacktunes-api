// Instantiates Mopidy Websockets
var env = require('../env');
var Mopidy = require('mopidy');
exports.mopidy = new Mopidy({ webSocketUrl: `ws://${env.mopidyurl}:${env.mopidyport}/mopidy/ws/` });
