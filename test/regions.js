const should = require('chai').should();
const RegionsJS  = require('../src/index');

describe('OSMRegions API Wrapper', function(){

  describe('Initializating', function() {
    it('without any arguments', function() {
      (function() {
        regions = new RegionsJS();
      }).should.not.throw();
    });
  });

  describe('OSM DB responses', function() {
    beforeEach(function(done){
      regions = new RegionsJS({
        // endpoint: 'http://localhost:1234/'
      });
      done();
    });

    describe('Responses from REVERSE endpoint ', function() {

      it('should return all regions for (52.55.., 13.21..)', function(done) {
        regions.reverse({
          lat: 52.554123413243,
          lng: 13.213412344
        }).then(function(res) {
          res.should.be.a('array');
          res.should.have.length(4);
          done();
        }).catch(function (err) { console.log(err); });
      });

      it('should return admin_level=2 region for (52.55.., 13.21..)', function(done) {
        regions.reverse({
          lat: 52.554123413243,
          lng: 13.213412344,
          level: 2,
        }).then(function(res) {
          res.should.be.a('array');
          res.should.have.length(1);
          done();
        }).catch(function (err) { console.log(err); });
      });

    });

    describe('Responses from GET endpoint ', function() {

      it('should return SINGLE region 1543125', function(done) {
        regions.get({
          id: 1543125
        }).then(function(res) {
          res.should.be.a('array');
          res.should.have.length(1);
          done();
        }).catch(function(err){ console.log(err); });
      });

      it('should return MULTIPLE region 1543125,51477', function(done) {
        regions.get({
          id: '1543125,51477'
        }).then(function(res) {
          res.should.be.a('array');
          res.should.have.length(2);
          done();
        }).catch(function(err){ console.log(err); });
      });

      it('should return RPATH for 1543125', function(done) {
        regions.get({
          id: 1543125,
          fields: ['rpath']
        }).then(function(res) {
          res.should.be.a('array');
          res.should.have.length(1);
          res[0].rpath.should.be.a('array');
          res[0].rpath.should.have.length(2);
          done();
        }).catch(function(err){ console.log(err); });
      });

      it('should return WAY for 1543125', function(done) {
        regions.get({
          id: 1543125,
          fields: ['way']
        }).then(function(res) {
          res.should.be.a('array');
          res.should.have.length(1);
          res[0].way.should.be.a('object');
          res[0].way.geometry.coordinates.should.be.a('array');
          // res[0].way.geometry.coordinates.should.have.length(17);
          done();
        }).catch(function(err){ console.log(err); });
      });

      it('should return CENTER for 1543125', function(done) {
        regions.get({
          id: 1543125,
          fields: ['center']
        }).then(function(res) {
          res.should.be.a('array');
          res.should.have.length(1);
          res[0].center.should.be.a('object');
          res[0].center.geometry.coordinates.should.be.a('array');
          res[0].center.geometry.coordinates.should.have.length(2);
          done();
        }).catch(function(err){ console.log(err); });
      });

      it('should return BBOX for 1543125', function(done) {
        regions.get({
          id: 1543125,
          fields: ['bbox']
        }).then(function(res) {
          res.should.be.a('array');
          res.should.have.length(1);
          res[0].bbox.should.be.a('object');
          res[0].bbox.geometry.coordinates.should.be.a('array');
          res[0].bbox.geometry.coordinates[0].should.have.length(5);
          done();
        }).catch(function(err){ console.log(err); });
      });

      it('should return AREA for 1543125', function(done) {
        regions.get({
          id: 1543125,
          fields: ['area']
        }).then(function(res) {
          res.should.be.a('array');
          res.should.have.length(1);
          res[0].area.should.be.a('number');

          done();
        }).catch(function(err){ console.log(err); });
      });

      it('should return NEIGHBOURS for 1543125', function(done) {
        regions.get({
          id: 1543125,
          fields: ['neighbours']
        }).then(function(res) {
          res.should.be.a('array');
          res.should.have.length(1);
          res[0].rpath.should.be.a('array');
          res[0].rpath.should.have.length(2);
          res[0].neighbours.should.be.a('array');
          res[0].neighbours.should.have.length(5);
          done();
        }).catch(function(err){ console.log(err); });
      });


    });


  describe('Responses from NEIGHBOURS endpoint ', function() {

    it('should return neighbours for 62771', function(done) {
      regions.neighbours({
        id: 62771,
      }).then(function(res) {
        res.should.be.a('array');
        res.should.have.length(12);
        done();
      }).catch(function(err){ console.log(err); });
    });


  });


  describe('Additional responses from mongodb', function() {

    /*it('should return neighbours for 62771', function(done) {
      osm.getNeighbours({
        id: 62771,
      }).then(function(res) {
        res.should.be.a('array');
        res.should.have.length(12);
        done();
      }).catch(function(err){ console.log(err); });
    });*/


  });



  });

});
