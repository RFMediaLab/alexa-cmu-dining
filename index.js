'use strict';
module.change_code = 1;
var _ = require('lodash');
var Alexa = require('alexa-app');
var app = new Alexa.app('cmudining');
var CMUDiningDataHelper = require('./cmudining_data_helper');

app.launch(function(req, res) {
  var prompt = 'For CMU dining information, ask me what locations are open.';
  res.say(prompt).reprompt(prompt).shouldEndSession(false);
});

app.intent('CheckLocationOpen', 
	{
 		'slots': {
    	'LOCATIONNAME': 'LOCATIONNAME'
  	},
  	'utterances': ['{|is} {-|LOCATIONNAME} {|open}']
	},
  function(req, res) {
    //get the slot
    var locationName = req.slot('LOCATIONNAME');
    var reprompt = 'For CMU dining information, ask me if the location is open.';
		if (_.isEmpty(locationName)) {
      var prompt = 'I didn\'t hear a location name. Tell me a location name.';
      res.say(prompt).reprompt(reprompt).shouldEndSession(false);
      return true;
    } else {
      var diningHelper = new CMUDiningDataHelper();
			diningHelper.requestLocation(locationName).then(function(locationObj) {
        res.say(diningHelper.formatLocation(locationObj)).send();
      }).catch(function(err) {
        console.log(err.statusCode);
        var prompt = 'I didn\'t have data for a location name of ' + locationName;
        res.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
      });
      return false;
    }
  }
);

app.intent('GetOpenLocations', 
	{
 		'slots': {},
 		'utterances': ['{|what|which} {|locations|restaurants|places|dining locations} {|are|is} {|open|available}']
	},
  function(req, res) {
    var reprompt = 'For CMU dining information, ask me what locations are open.';
    var diningHelper = new CMUDiningDataHelper();
    diningHelper.requestOpenLocations().then(function(openList) {
    	res.say(diningHelper.formatOpenLocations(openList)).send();
    }).catch(function(err) {
    	console.log(err.statusCode);
    	var prompt = 'I had a problem retreiving open locations.';
    	res.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
    });
    return false;
  }
);





//hack to support custom utterances in utterance expansion string
var utterancesMethod = app.utterances;
app.utterances = function() {
return utterancesMethod().replace(/\{\-\|/g, '{');
};

module.exports = app;