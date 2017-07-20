// Get Environment Apps
exports.clientId = process.env.SLACKID;
exports.clientSecret = process.env.SLACKSECRET;

exports.mopidyurl = process.env.MOPIDYURL || '192.168.99.100';
exports.mopidyport = process.env.MOPIDYPORT || '6680';

exports.slackhook = process.env.SLACKHOOK || "https://hooks.slack.com/services/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";
exports.listenurl = process.env.LISTENURL || "https://0d450da7.ngrok.io";
