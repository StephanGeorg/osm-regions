const should = require('chai').should();
const expect = require('chai').expect;
const RegionsJS = require('../src/index');

let regions;

describe('RegionsAPI API Wrapper', () => {
  describe('Initializating', () => {
    it('without any arguments', (done) => {
      regions = new RegionsJS();
      // regions.should.not.throw();
      done();
    });
  });

  describe('OSM DB responses', () => {
    beforeEach((done) => {
      regions = new RegionsJS({
        // endpoint: 'http://localhost:1234/'
      });
      done();
    });

    describe('Responses from REVERSE endpoint ', () => {
      it('should return all regions for (52.55.., 13.21..)', (done) => {
        regions.reverse({
          lat: 52.554123413243,
          lng: 13.213412344,
        }).then((res) => {
          res.should.be.a('array');
          res.should.have.length(4);
          done();
        }).catch(console.log);
      });

      it('should return admin_level=2 region for (52.55.., 13.21..)', (done) => {
        regions.reverse({
          lat: 52.554123413243,
          lng: 13.213412344,
          level: 2,
        }).then((res) => {
          res.should.be.a('array');
          res.should.have.length(1);
          done();
        }).catch(console.log);
      });

      it('should return admin_level=2 || 4 region for (bound)', (done) => {
        regions.reverse({
          bound: '[[0,34.30714],[35.8593, 34.3071],[35.8593,48.6909],[0,48.6909],[0,34.30714]]',
          level: 4,
        }).then((res) => {
          res.should.be.a('array');
          // expect(res).to.have.length.around(472, 10);
          done();
        }).catch(console.log);
      }).timeout(5000);
    });

    describe('Responses from GET endpoint ', () => {
      it('should return SINGLE region 1543125', (done) => {
        regions.get({
          id: 1543125,
        }).then((res) => {
          res.should.be.a('array');
          res.should.have.length(1);
          done();
        }).catch(console.log);
      });

      it('should return MULTIPLE region 1543125,51477', (done) => {
        regions.get({
          id: '1543125,51477',
        }).then((res) => {
          res.should.be.a('array');
          res.should.have.length(2);
          done();
        }).catch(console.log);
      });

      it('should return RPATH for 1543125', (done) => {
        regions.get({
          id: 1543125,
          fields: ['rpath', 'osm_id'],
        }).then((res) => {
          res.should.be.a('array');
          res.should.have.length(1);
          res[0].rpath.should.be.a('array');
          res[0].rpath.should.have.length(2);
          done();
        }).catch(console.log);
      });

      it('should return WAY for 1543125', (done) => {
        regions.get({
          id: 1543125,
          fields: ['way'],
        }).then((res) => {
          res.should.be.a('array');
          res.should.have.length(1);
          res[0].way.should.be.a('object');
          res[0].way.geometry.coordinates.should.be.a('array');
          // res[0].way.geometry.coordinates.should.have.length(17);
          done();
        }).catch(console.log);
      });

      it('should return CENTER for 1543125', (done) => {
        regions.get({
          id: 1543125,
          fields: ['center'],
        }).then((res) => {
          res.should.be.a('array');
          res.should.have.length(1);
          res[0].center.should.be.a('object');
          res[0].center.geometry.coordinates.should.be.a('array');
          res[0].center.geometry.coordinates.should.have.length(2);
          done();
        }).catch(console.log);
      });

      it('should return BBOX for 1543125', (done) => {
        regions.get({
          id: 1543125,
          fields: ['bbox'],
        }).then((res) => {
          res.should.be.a('array');
          res.should.have.length(1);
          res[0].bbox.should.be.a('object');
          res[0].bbox.geometry.coordinates.should.be.a('array');
          res[0].bbox.geometry.coordinates[0].should.have.length(5);
          done();
        }).catch(console.log);
      });

      it('should return AREA for 1543125', (done) => {
        regions.get({
          id: 1543125,
          fields: ['area'],
        }).then((res) => {
          res.should.be.a('array');
          res.should.have.length(1);
          res[0].area.should.be.a('number');

          done();
        }).catch(console.log);
      });

      it('should return NEIGHBOURS for 1543125', (done) => {
        regions.get({
          id: 1543125,
          fields: ['neighbours'],
        }).then((res) => {
          res.should.be.a('array');
          res.should.have.length(1);
          res[0].rpath.should.be.a('array');
          res[0].rpath.should.have.length(2);
          res[0].neighbours.should.be.a('array');
          res[0].neighbours.should.have.length(5);
          done();
        }).catch(console.log);
      });
    });


  describe('Responses from NEIGHBOURS endpoint ', () => {
      it('should return neighbours for 62771', (done) => {
        regions.neighbours({
          id: 62771,
        }).then((res) => {
          res.should.be.a('array');
          res.should.have.length(12);
          done();
        }).catch(console.log);
      });
    });
  });

  describe('MONGO DB responses', () => {
    it('should return (get) structure for 51477', (done) => {
      regions.get({
        id: 51477,
        fields: ['additional.structure'],
      }).then((res) => {
        res.should.be.a('array');
        res.should.have.length(1);
        res[0].should.have.property('additional');
        res[0].additional.structure.borders.int.should.have.length(9);
        done();
      }).catch(console.log);
    });

    it('should return (reverse) structure for 51477', (done) => {
      regions.reverse({
        lat: 52.554123413243,
        lng: 13.213412344,
        level: 2,
        fields: ['additional.structure'],
      }).then((res) => {
        res.should.be.a('array');
        res.should.have.length(1);
        res[0].should.have.property('additional');
        res[0].additional.structure.borders.int.should.have.length(9);
        done();
      }).catch(console.log);
    });
  });
  describe('Responses from SEARCH endpoint', () => {
    it('should return region by Path', (done) => {
      regions.search({
        path: 'Italy/Rome',
      }).then((res) => {
        res.should.be.a('array')
          .and.have.length(1);
        done();
      }).catch(console.log);
    });

    it('should return region by Name', (done) => {
      regions.search({
        name: 'Berlin',
      }).then((res) => {
        res.should.be.a('array')
          .and.have.length(9);
        done();
      }).catch(console.log);
    });

    it('should return region by Path and OSM Data', (done) => {
      regions.search({
        path: 'Italy/Rome',
        fields: ['center', 'bbox'],
      }).then((res) => {
        res.should.be.a('array')
          .and.have.length(1);
        res[0].should.have.nested.property('center.geometry.coordinates')
          .and.to.be.an('array')
          .and.to.have.length(2);
        res[0].should.have.nested.property('bbox.geometry.coordinates')
          .and.to.be.an('array')
          .and.to.have.length(1);
        done();
      }).catch(console.log);
    });
  });
});
