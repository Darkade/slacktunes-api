var request = require('request');

exports.SendMessage = function(msg, url){

  let options = {
    url: url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    json: msg
  };

  request(options, function(error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.
  });

}
