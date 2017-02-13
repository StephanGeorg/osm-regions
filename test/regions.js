var should = require('should'),
    RegionsJS  = require('../src/index'),
    API_KEY = 'YOUR_API_KEY';

describe('OSMRegions API Wrapper', function(){
  var osmregions;

  describe('Initializating', function() {

    it('without any arguments', function() {
      (function() {
        osmregions = new RegionsJS();
      }).should.not.throw();
    });


  });

  describe('API responses', function() {

    beforeEach(function(done){
      osm = new RegionsJS({
        endpoint: 'http://localhost:1234/'
      });
      done();
    });

    it('should return all regions for (52.55.., 13.21..)', function(done) {
      osm.getRegions({
        lat: 52.554123413243,
        lng: 13.213412344
      }).then(function(res) {
        res.should.be.a.Array;
        done();
      }).catch(function (err) { console.log(err); });
    });

    it('should return region 1543125', function(done) {
      osm.getId({
        id: 1543125,
        fields: ['osm_id']
      }).then(function(res) {
        res.should.be.a.Object;
        done();
      }).catch(function(err){ console.log(err); });
    });

    it('should return rpath for 1543125', function(done) {
      osm.getId({
        id: 1543125,
        fields: ['rpath']
      }).then(function(res) {
        res.should.be.a.Object;
        done();
      }).catch(function(err){ console.log(err); });
    });

    it('should return neighbours for 62771', function(done) {
      osm.getNeighbours({
        id: 62771,
      }).then(function(res) {
        res.should.be.a.Object;
        done();
      }).catch(function(err){ console.log(err); });
    });

  });

});
