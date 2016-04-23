'use strict';
var _ = require('lodash');
var rp = require('request-promise');
var ENDPOINT = 'http://apis.scottylabs.org/dining/v1/locations';

function CMUDiningDataHelper() { }

CMUDiningDataHelper.prototype.requestOpenLocations = function() {
  var _this = this;
	return this.getAllLocations().then(
    function(response) {
      console.log('success - received location info');

      var resultNames = [];      

      for (var i = 0; i < response.body.locations.length; i++) {
        console.log(name);
      	var name = response.body.locations[i].name;
      	var description = response.body.locations[i].description;
      	var keywords = response.body.locations[i].keywords;
      	var location = response.body.locations[i].location;
      	var times = response.body.locations[i].times;

        if (_this.isLocationOpen(times)) {
          resultNames.push(name);
        }
      }
      console.log('DONE');
      console.log(resultNames);
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
    resolveWithFullResponse: true,
    json: true
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

    /* TODO: This algo currently does not account for minutes.
     *       We made need the same 4-case structure for minutes...
     */

    // Location is open between open/closing days
    if (start_day < cur_day && cur_day < end_day) {
      //easily true
      return true;
    }
    if (start_day < cur_day && cur_day === end_day) {
      if (cur_hour <= end_hour) {
        return true;
      }
    }
    if (start_day === cur_day && cur_day < end_day) {
      if (start_hour <= cur_hour) {
        return true;
      }
    }
    if (start_day === cur_day && cur_day === end_day) {
      if (start_hour <= cur_hour && cur_hour <= end_hour) {
        return true;
      }
    }
  }
  return false;
};

module.exports = CMUDiningDataHelper;


