let mpd = require('./backend/mopidyws');
let backend = require('./backend/backend');

let mopidy = mpd.mopidy;

mopidy.on("event:trackPlaybackStarted", backend.postSong)

mopidy.on("event:trackPlaybackEnded", backend.clear)
