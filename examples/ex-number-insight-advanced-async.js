module.exports = function(callback, config) {

  var Nexmo = require('../lib/Nexmo');

  var nexmo = new Nexmo({
    apiKey: config.API_KEY,
    apiSecret: config.API_SECRET
  }, {
    debug: config.DEBUG
  });

  nexmo.numberInsight.get({
    level: 'advanced',
    number: config.TO_NUMBER,
    callback: "http://example.com"
  }, callback);
};
