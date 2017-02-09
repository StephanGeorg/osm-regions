var request  = require('request');
var _ = require('lodash');

/**
 * OSMRegions API wrapper
 *
 * @param options Configuration options
 * @return Instance of {@link OSMRegions}
 */
function OSMRegions (options) {

  this.options = options || {};
  this.endpoint = this.options.endpoint || 'https://osm.luftlinie.org/';

  /*if (!options.apiKey) {
    throw new Error('API Key not set');
  }*/

}

module.exports = OSMRegions;

/**
 * Get Regions based on Lat/Lng
 * @param  {[object]}   options  must contain the following properties:
 *          * lat: Latitude
 *          * lng: Longitude
 *          * fields: Return the full response
 */
OSMRegions.prototype.getRegions = function (options) {

  return new Promise(function(resolve, reject) {

    if(!options.lat && !options.lng) {
      reject({code: 400, msg: "Lat/Lng parameter missing"});
    }
    if(!this.checkLat(options.lat)) {
      reject({code: 400, msg: "Latitude malformed"});
    }
    if(!this.checkLng(options.lng)) {
      reject({code: 400, msg: "Longitude malformed"});
    }

    options.fields = this._fields(options.fields);
    if(!options.fields) {
      options.fields = [];
    } else {
      options.fields = options.fields.split(',');
    }
    options.fields.push('osm_id');

    this.execute('region', {lat: options.lat, lng: options.lng, fields: _.uniq(options.fields).join()})
      .then(function(response) {
        resolve(this._parse(response));
      }.bind(this))
      .catch(function(err) {
        reject(err);
      });
  }.bind(this));
};

/**
 * Return a region based on the osm_id
 * @param  {[object]}   options  Can contain the following properties:
 *          * id: osm_id
 *          * fields: (way)
 */
OSMRegions.prototype.getId = function (options) {

  return new Promise(function(resolve, reject) {

    if(!options.id) {
      reject({code: 400, msg: "ID parameter missing"});
    }

    options.fields = this._fields(options.fields);

    this.execute('get', {id: options.id, fields: options.fields})
      .then(function(response) {
        resolve(this._parse(response));
      }.bind(this))
      .catch(function(err) {
        reject(err);
      });
    }.bind(this));
};

/**
 * Return a neighbour regions based on osm_id
 * @param  {[object]}   options  Can contain the following properties:
 *          * id: osm_id
 *          * level: (optional) admin_level (default: same as from osm_id)
 */
OSMRegions.prototype.getNeighbours = function (options) {

  return new Promise(function(resolve, reject) {

    if (!options.id) reject({code: 400, msg: "ID parameter missing"});

    this.execute('neighbour', options)
      .then(function(response) {
        resolve(this._parse(response));
      }.bind(this))
      .catch(function(err) {
        reject(err);
      });



  }.bind(this));



};

/**
 * Return parsed fields
 * @param  {[object]}   response  A response from the API
 */
OSMRegions.prototype._fields = function (fields) {

  if (_.isArray(fields)) return fields.join();
  return fields;

};

/**
 * Return parsed response
 * @param  {[object]}   response  A response from the API
 */
OSMRegions.prototype._parse = function (response) {

  _.each(response,function(reg,i){
    if(reg.way && typeof reg.way === 'string') {
      response[i].way = JSON.parse(reg.way);
    }
    if(reg.center && typeof reg.center === 'string') {
      response[i].center = JSON.parse(reg.center);
    }
    if(reg.bbox && typeof reg.bbox === 'string') {
      response[i].bbox = JSON.parse(reg.bbox);
    }
    if(reg.osm_id && typeof reg.osm_id === 'string') {
      response[i].osm_id = parseInt(reg.osm_id);
    }
  });

  return response;

};

/**
  * Check if valid latitude
  */
OSMRegions.prototype.checkLat = function (lat) {
  if(typeof lat === 'number' && lat > -90 && lat < 90) {
    return true;
  }
  return;
};

/**
  * Check if valid longitude
  */
OSMRegions.prototype.checkLng = function (lng) {
  if(typeof lng === 'number' && lng > -180 && lng < 180) {
    return true;
  }
  return;
};


/**
 * Sends a given request as a JSON object to the OSM API and returns
 * a promise which if resolved will contain the resulting JSON object.
 *
 * @param  {[type]}   method   OSM API method to call (regions | get)
 * @param  {[type]}   params   Object containg parameters to call the API with
 * @param  {Function} Promise
 */
OSMRegions.prototype.execute = function (method, params) {
  return new Promise(function(resolve, reject) {

    //var finalParams = _.extend({ key:  this.apiKey }, params);
    var finalParams = params;

    options = {
      url: this.endpoint + method,
      qs: finalParams
    };

    request.get(options, function (error, response, body) {
      if(error) {
        reject({code: 404, msg: error});
      } else {
        if(response.statusCode !== 200) {
          reject({code: 404, msg: 'Unable to connect to the API endpoint ' + options.url});
        } else if (response.body.error_msg) {
          reject({code: 400, msg: response.body.error_msg});
        }
        if(body){
          try {
            resolve(JSON.parse(response.body));
          } catch (err) {
            reject({code: 500, msg: err});
          }
        } else {
          reject({code: response.statusCode, msg: 'Empty body'});
        }
      }
    });
  }.bind(this));

};
