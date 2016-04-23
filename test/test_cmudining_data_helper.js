'use strict';
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var CMUDiningDataHelper = require('../cmudining_data_helper');
chai.config.includeStack = true;


describe('CMUDiningDataHelper', function() {
  var subject = new CMUDiningDataHelper();
  var time;
  describe('#getOpenLocations', function() {
  	context('with a valid time', function() {
  		it('returns CMU dining locations that are open', function() {
  			time = 1461168000; /* 4/20/16 Noon EST */
  			var value = subject.requestOpenLocations(time).then(function(resultNames) {
  				console.log(resultNames);
  				return resultNames;
  			});
  			return expect(value).to.have.length(15);
  		});
  	});
	});

	describe('#formatOpenLocations', function() {
    var list = ['Asiana', 'Carnegie Mellon Cafe', 'El Gallo de Oro'];

    context('with a list of open locations', function() {
      it('formats the status as expected', function() {
        expect(subject.formatOpenLocations(list)).to.eq('There are currently 3 locations open. Asiana, Carnegie Mellon Cafe, and El Gallo de Oro');
      });
    });

  });

});

