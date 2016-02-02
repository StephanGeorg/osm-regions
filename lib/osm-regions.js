var request  = require('request'),
    _        = require('lodash');

/**
 * OSMRegions API wrapper
 *
 * @param options Configuration options
 * @return Instance of {@link OSMRegions}
 */
function OSMRegions (options) {

  if (!options) {
    options = {};
  }

  /*if (!options.apiKey) {
    throw new Error('API Key not set');
  }*/

  this.endpoint = options.endpoint || 'http://osm.nearest.place/';

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

  if(!options.lat && !options.lng) {
    throw new Error('Lat or Lng not set!');
  }

  return new Promise(_.bind(function(resolve, reject) {
    this.execute('region', {lat: options.lat, lng: options.lng})
      .then(function(res) {
        resolve(res);
      })
      .catch(function(err) {
        reject(err);
      });
  }, this));
};




/**
 * Return a region based on the osm_id
 * @param  {[object]}   options  Can contain the following properties:
 *          * id: osm_id
 *          * fields: (way)
 */
OSMRegions.prototype.getId = function (options) {

  if(!options.id) {
    throw new Error('Id not set!');
  }

  options.fields = this._fields(options.fields);

  return new Promise(_.bind(function(resolve, reject) {
    this.execute('get', {id: options.id, fields: options.fields})
      .then(function(res) {
        resolve(res);
      })
      .catch(function(err) {
        reject(err);
      });
  }, this));
};


OSMRegions.prototype._fields = function (fields) {
  if(typeof fields === 'object') {
    return fields.join();
  }
  return fields;
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
  return new Promise(_.bind(function(resolve, reject) {

    //var finalParams = _.extend({ key:  this.apiKey }, params);
    var finalParams = params;

    options = {
      url: this.endpoint + method,
      qs: finalParams
    };

    request.get(options, function (error, response, body) {
      if (response.statusCode !== 200) {
        reject('Unable to connect to the API endpoint ' + options.url);
      } else if (response.body.error) {
        reject(response.body.error + '. Message: ' + response.body.message);
      }
      if(body){
        resolve(response.body);
      }
    });
  }, this));

};
