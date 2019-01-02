const request = require('request');
const _ = require('lodash');

/**
 * OSMRegions API wrapper
 *
 * @param options Configuration options
 * @return Instance of {@link OSMRegions}
 */
class RegionsJS {
  constructor(options = {}) {
    this.options = options;
    this.endpoint = this.options.endpoint || 'https://api.distance.to/api/regions/';
  }

  /**
   * Get Regions based on Lat/Lng
   * @param  {[object]}   options  must contain the following properties:
   *          * lat: Latitude
   *          * lng: Longitude
   *          * fields: [String] Return the full response
   */
  reverse(options = {}) {
    const {
      lat, lng, level, bound,
    } = options;
    let { fields } = options;
    return new Promise((resolve, reject) => {
      // if (!lat && !lng) reject(this.error(400, 'Lat/Lng parameter missing'));
      if (lat && !checkLat(lat)) reject(this.error(400, 'Latitude malformed'));
      if (lng && !checkLng(lng)) reject(this.error(400, 'Longitude malformed'));

      fields = this.getFields(fields);

      this.execute('reverse', {
        lat,
        lng,
        bound,
        fields,
        level,
      })
        .then((response) => {
          resolve(this.parseResponse(response));
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  // Backwarts compatibility
  getRegions(options = {}) {
    return this.reverse(options);
  }

  /**
   * Return a region based on the osm_id
   * @param  {[object]}   options  Can contain the following properties:
   *          * id: osm_id
   *          * fields: [String] (way)
   */
  get(options = {}) {
    const { id } = options;
    let { fields } = options;

    return new Promise((resolve, reject) => {
      if (!id) reject(this.error(400, 'id parameter missing'));
      fields = this.getFields(fields);

      this.execute('get', { id, fields })
        .then((response) => {
          resolve(this.parseResponse(response));
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  // Backwarts compatibility
  getId(options = {}) {
    return this.get(options);
  }

  /**
   * Search regions by path or name based on Lat/Lng
   * @param  {[object]}   options  must contain on of the following two properties:
   *          * path: Path of a region (i.e. Germany/Berlin)
   *          * name: Name of a region (i.e. Rome)
   *          *
   *          * fields: [String] Return the full response
   */
  search(options = {}) {
    const { path, name } = options;
    let { fields } = options;
    return new Promise((resolve, reject) => {
      if (!name && !path) reject(this.error(400, 'Please secify path or name.'));

      fields = this.getFields(fields);

      this.execute('search', {
        path,
        name,
        fields,
      })
        .then((response) => {
          resolve(this.parseResponse(response));
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  /**
   * Return a neighbour regions based on osm_id
   * @param  {[object]}   options  Can contain the following properties:
   *          * id: osm_id
   *          * level: (optional) admin_level (default: same as from osm_id)
   */
  neighbours(options = {}) {
    return new Promise((resolve, reject) => {
      if (!options.id) reject(this.error(400, 'ID parameter missing'));

      this.execute('neighbour', options)
        .then((response) => {
          resolve(this.parseResponse(response));
        })
        .catch(reject);
    });
  }
  // Backwarts compatibility
  getNeighbours(options = {}) {
    return this.neighbours(options);
  }

  /**
   * Sends a given request as a JSON object to the OSM API and returns
   * a promise which if resolved will contain the resulting JSON object.
   *
   * @param  {[type]}   method   OSM API method to call (regions | get)
   * @param  {[type]}   params   Object containg parameters to call the API with
   * @param  {Function} Promise
   */
  execute(method, params) {
    return new Promise((resolve, reject) => {
      const finalParams = params;
      const options = {
        url: this.endpoint + method,
        qs: finalParams,
      };

      request.get(options, (err, response, body) => {
        if (err) reject(this.error(404, err));
        else {
          if (response.statusCode !== 200) reject(this.error(response.statusCode, `Unable to connect to the API endpoint ${options.url}`));
          else if (response.body.error_msg) reject(this.error(400, response.body.error_msg));
          if (body) {
            try {
              resolve(JSON.parse(response.body));
            } catch (e) {
              reject(this.error(500, e));
            }
          } else reject(this.error(response.statusCode, 'Empty body'));
        }
      });
    });
  }

  /**
   * Return parsed response
   * @param  {[object]}   response  A response from the API
   */
  parseResponse(response) {
    response.forEach((reg, i) => {
      if (reg.way && typeof reg.way === 'string') response[i].way = JSON.parse(reg.way);
      if (reg.center && typeof reg.center === 'string') response[i].center = JSON.parse(reg.center);
      if (reg.bbox && typeof reg.bbox === 'string') response[i].bbox = JSON.parse(reg.bbox);
      if (reg.osm_id && typeof reg.osm_id === 'string') response[i].osm_id = parseInt(reg.osm_id);
    });
    return response;
  }

  /**
   * Return parsed fields
   * @param  {[object]}   response  A response from the API
   */
  getFields(fields = ['osm_id']) {
    if (_.isString(fields)) fields = fields.split(',');
    fields.push('osm_id');
    return _.uniq(fields).join();
  }

  error (msg, code) {
    return {
      code,
      msg
    };
  }

}

module.exports = RegionsJS;

// Helper functions

/**
  * Check if valid latitude
  */
const checkLat = function (lat) {
  if(typeof lat === 'number' && lat > -90 && lat < 90) {
    return true;
  }
  return;
};

/**
  * Check if valid longitude
  */
const checkLng = function (lng) {
  if(typeof lng === 'number' && lng > -180 && lng < 180) {
    return true;
  }
  return;
};
