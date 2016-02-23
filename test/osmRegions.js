var should = require('should'),
    OSMRegions  = require('../lib/osm-regions'),
    API_KEY = 'YOUR_API_KEY';

describe('OSMRegions API Wrapper', function(){
  var osmregions;

  describe('Initializating', function() {

    it('without any arguments', function() {
      (function() {
        osmregions = new OSMRegions();
      }).should.not.throw();
    });


  });

  describe('API responses', function() {

    beforeEach(function(done){
      osm = new OSMRegions();
      done();
    });

    it('should return rpath of region', function(done) {
      osm.getRegions({
        lat: 52.554123413243,
        lng: 13.213412344
      }).then(function(res) {
        res.should.be.a.Array;
        done();
      });
    });

    it('should return region', function(done) {
      osm.getId({
        id: 51477
      }).then(function(res) {
        res.should.be.a.Object;
        done();
      });
    });

  });

  describe('Validations', function() {

    beforeEach(function(done){
      osm = new OSMRegions();
      done();
    });

    it('validate latitude', function(done) {
      res = osm.checkLat(52.554123413243);
      res.should.be.true();
      done();
    });

    it('validate longitude', function(done) {
      res = osm.checkLng(13.554123413243);
      res.should.be.true();
      done();
    });

  });

});
