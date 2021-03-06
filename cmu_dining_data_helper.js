'use strict';
var _ = require('lodash');
var cheerio = require('cheerio');
var rp = require('request-promise');
var ENDPOINT = 'http://webapps.studentaffairs.cmu.edu/dining/ConceptInfo/?page=listConcepts';

function CMUDiningDataHelper() { }

CMUDiningDataHelper.prototype.requestOpenLocations = function() {
    var _this = this;
    var resultNames = [];      
    
    return this.getAllLocations().then(
        function(response) {
            console.log('-Received JSON response.');

      	    var name = response( '.Open', '.bucketRow').parents('.conceptBucket').find('.conceptName').text();

            console.log(name);
            if (name != undefined && name != null && name != 'undefined') {
                resultNames.push(name);
            }

            console.log('-Done checking openness.');
            console.log('-Open Locations: ' + resultNames);
            return resultNames;
        }
    );
};

CMUDiningDataHelper.prototype.requestLocation = function(locationname) {
  // Should return location obj.
  return;
};


CMUDiningDataHelper.prototype.getAllLocations = function() {
  var options = {
    method: 'GET',
    uri: ENDPOINT,
    resolveWithFullResponse: false,
      json: false,
      transform: function (body) {
          return cheerio.load(body);
      }
  };
  return rp(options);
};

CMUDiningDataHelper.prototype.formatOpenLocations = function(openList) {
	var numOpen = openList.length;
	var locationNames = '';

	if (openList.length == 1) {
		locationNames += openList[0];
	}
	if (openList.length == 2) {
		locationNames += openList[0] + ' and ' + openList[1];
	}
	else {
		for (var i = 0; i < openList.length; i++) {
			if (i == openList.length -1) {
				//end of list
				locationNames += 'and ' + openList[i];
			} else {
				locationNames += openList[i] + ', ';
			}
		}
	}

	// 'There are currently 3 locations open. Asiana, Carnegie Mellon Cafe, and El Gallo de Oro'
	return 'There are currently ' + numOpen + ' locations open. ' + locationNames;
};

CMUDiningDataHelper.prototype.formatLocation = function(openList) {

};


CMUDiningDataHelper.prototype.isLocationOpen = function(times) {
  var cur_date = new Date();

  if (cur_date.getTimezoneOffset() === 0) {
    cur_date.setMinutes(-240);
  }

  for (var i = 0; i < times.length; i++) {
    var timerange = times[i];

    var cur_day = cur_date.getDay();
    var cur_hour = cur_date.getHours();
    var cur_min = cur_date.getMinutes();

    var start_day = timerange.start.day;
    var start_hour = timerange.start.hour;
    var start_min = timerange.start.min;

    var end_day = timerange.end.day;
    var end_hour = timerange.end.hour;
    var end_min = timerange.end.min;

    // Location is open between open/closing days
    if (start_day < cur_day && cur_day < end_day) {
      console.log('  -> Middle day.');
      //easily true
      return true;
    }
    if (start_day < cur_day && cur_day === end_day) {
      console.log('  -> End day.');
      if (cur_hour < end_hour) {
        console.log('     -> Less than hour.');
        return true;
      }
      if (cur_hour === end_hour) {
        console.log('     -> Equal hour.');
        return cur_min <= end_min;
      }
      else {
        console.log('     -> Greater than hour.');
      }
    }
    if (start_day === cur_day && cur_day < end_day) {
      console.log('  -> Start day.');
      if (cur_hour > start_hour) {
        console.log('     -> Greater than hour.');
        return true;

      }
      if (cur_hour === start_hour) {
        console.log('     -> Equal hour.');
        if (cur_min >= startmin) {
          return true;
        }
      }
    }
    // 5:30 - 6:30, now: 5:15
    if (start_day === cur_day && cur_day === end_day) {
      console.log('  -> Both days.');
      if (start_hour < cur_hour && cur_hour < end_hour) {
        return true;
      }
      if (start_hour < cur_hour && cur_hour === end_hour) {
        if (cur_min <= end_min) {
          return true;
        }
      }
      if (start_hour === cur_hour && cur_hour < end_hour) {
        if (cur_min >= start_min) {
          return true;
        }
      }
      if (start_hour <= cur_hour && cur_hour <= end_hour) {
        if (start_min <= cur_min && cur_min <= end_min) {
          return true;
        }
      }
    }
  }
  console.log('  -> Vacuous case.');
  return false;
};

module.exports = CMUDiningDataHelper;


