'use strict'

// services
const core = require('../services/core.js');
const propertyProxy = require('../services/propertyProxy.js');

// classes
const iterator = require('../classes/iterator.js');

// helpers
const common = require('../helpers/common.js');

/**
 * A property of a graph
 * @module classes/property
 */
module.exports = class Property {

  /**
   * Creates a property
   * @param {object} result - The result of creating a property from ws
   * @param {module:classes/graph} graph - graph
   */
  constructor(result, graph) {
    this.type = result.type;
    this.transient = result.transient;
    this.name = result.name;
    this.entityType = result.entityType;
    this.dimension = result.dimension != null ? result.dimension : 0;
    this.graph = graph;
  }

  static get NONE() {
    return [];
  }

  static get ALL() {
    return null;
  }

  getProxy() {
    let self = this;
    return new Promise(
      function(resolve, reject) {
        if (self.proxy) {
          resolve(self.proxy);
        } else {
          return core.getPropertyProxy(self.graph, self.name, self.entityType).then(function(proxy) {
            self.proxy = proxy;
            resolve(self.proxy);
          });
        }
    });
  }

  getProxyField(field) {
    let self = this;
    return new Promise(
      function(resolve, reject) {
        self.getProxy().then(function(proxy) {
          if (proxy.hasOwnProperty(field)) {
            resolve(proxy[field]);
          } else {
            reject(`${field} field was not found in proxy`);
          }
        });
    });
  }

  extractOneValueDates(objArray, field) {
    let result = objArray;
    if ((objArray instanceof Array) && (objArray.length > 0)) {
      for (let i = 0; i < objArray.length; i++) {
        result[i] = { key: objArray[i].key, value: objArray[i].value[field] };
      }
    }
    return result;
  }

  extractTimezoneDates(objArray, ts, tz) {
    let result = objArray;
    if ((objArray instanceof Array) && (objArray.length > 0)) {
      for (let i = 0; i < objArray.length; i++) {
        result[i] = { key: objArray[i].key, value: objArray[i].value[ts] + ':' + objArray[i].value[tz] };
      }
    }
    return result;
  }

  extractDates(objArray) {
    let self = this;
    let result = objArray;
    switch (self.type.toUpperCase()) {
      case common.dateTypes.LOCAL_DATE:
        result = self.extractOneValueDates(objArray, common.dateTypes.LOCAL_DATE);
        break;
      case common.dateTypes.TIME:
        result = self.extractOneValueDates(objArray, common.dateTypes.TIME);
        break;
      case common.dateTypes.TIMESTAMP:
        result = self.extractOneValueDates(objArray, common.dateTypes.TIMESTAMP);
        break;
      case common.dateTypes.TIME_WITH_TIMEZONE:
        result = self.extractTimezoneDates(objArray, common.dateTypes.TIME_PART_OF_TIME_WITH_TZ, common.dateTypes.TZ_PART_OF_TIME_WITH_TZ);
        break;
      case common.dateTypes.TIMESTAMP_WITH_TIMEZONE:
        result = self.extractTimezoneDates(objArray, common.dateTypes.TIMESTAMP_PART_OF_TS_WITH_TZ, common.dateTypes.TZ_PART_OF_TS_WITH_TZ);
        break;
    }
    return result;
  }

  extractDate(value) {
    let self = this;
    let result = value;
    switch (self.type.toUpperCase()) {
      case common.dateTypes.LOCAL_DATE:
        result = value[common.dateTypes.LOCAL_DATE];
        break;
      case common.dateTypes.TIME:
        result = value[common.dateTypes.TIME];
        break;
      case common.dateTypes.TIMESTAMP:
        result = value[common.dateTypes.TIMESTAMP];
        break;
      case common.dateTypes.TIME_WITH_TIMEZONE:
        result = value[common.dateTypes.TIME_PART_OF_TIME_WITH_TZ] + ':' + value[common.dateTypes.TZ_PART_OF_TIME_WITH_TZ];
        break;
      case common.dateTypes.TIMESTAMP_WITH_TIMEZONE:
        result = value[common.dateTypes.TIMESTAMP_PART_OF_TS_WITH_TZ] + ':' + value[common.dateTypes.TZ_PART_OF_TS_WITH_TZ];
        break;
    }
    return result;
  }

  addJsonDate(value) {
    let self = this;
    let result = {};
    switch (self.type.toUpperCase()) {
      case common.dateTypes.LOCAL_DATE:
        result[common.dateTypes.LOCAL_DATE] = value;
        break;
      case common.dateTypes.TIME:
        result[common.dateTypes.TIME] = value;
        break;
      case common.dateTypes.TIMESTAMP:
        result[common.dateTypes.TIMESTAMP] = value;
        break;
      case common.dateTypes.TIME_WITH_TIMEZONE:
        result[common.dateTypes.TIME_PART_OF_TIME_WITH_TZ] = value;
        result[common.dateTypes.TZ_PART_OF_TIME_WITH_TZ] = 0;
        break;
      case common.dateTypes.TIMESTAMP_WITH_TIMEZONE:
        result[common.dateTypes.TIMESTAMP_PART_OF_TS_WITH_TZ] = value;
        result[common.dateTypes.TZ_PART_OF_TS_WITH_TZ] = 0;
        break;
      default:
        result = value;
    }
    return result;
  }

  /**
   * Gets the property value
   * @function get
   * @memberof module:classes/property
   * @instance
   * @param {number} key - the id of the property
   * @returns {(string|number|Array.number)} property value
   */
  get(key) {
    let self = this;
    return self.getProxy().then(function(proxy) {
      return propertyProxy.getByKey(self.graph.session, proxy.proxyId, key);
    }).then(function(result) {
      return self.dimension > 0 ? result.vect : self.extractDate(result);
    });
  }

  getValues(start, size) {
    let self = this;
    return self.getProxy().then(function(proxy) {
      return propertyProxy.getValues(self.graph.session, proxy.proxyId, start, size);
    }).then(function(result) {
      let cb = function(row) {
        return {key: row.key, value: row.value.vect};
      };
      return self.dimension > 0 ? result.map(cb) : self.extractDates(result);
    });
  }

  getTopKValues(k, start, size) {
    let self = this;
    return self.getProxy().then(function(proxy) {
      return propertyProxy.getTop(self.graph.session, proxy.proxyId, k, start, size);
    }).then(function(result) {
      return self.extractDates(result);
    });
  }

  getBottomKValues(k, start, size) {
    let self = this;
    return self.getProxy().then(function(proxy) {
      return propertyProxy.getBottom(self.graph.session, proxy.proxyId, k, start, size);
    }).then(function(result) {
      return self.extractDates(result);
    });
  }

  /**
   * Iterates over the values
   * @function iterateValues
   * @memberof module:classes/property
   * @instance
   * @param {function} callback - the function to be used over each element
   * @returns {object} each key-value pair
   */
  iterateValues(callback) {
    return this.iterate(callback, 'values');
  }

  /**
   * Iterates over the top k values
   * @function iterateTopKValues
   * @memberof module:classes/property
   * @instance
   * @param {number} k - how many top values to retrieve
   * @param {function} callback - the function to be used over each element
   * @returns {object} each key-value pair
   */
  iterateTopKValues(k, callback) {
    return this.iterate(callback, 'top', k);
  }

  /**
   * Iterates over the bottom k values
   * @function iterateBottomKValues
   * @memberof module:classes/property
   * @instance
   * @param {number} k - how many bottom values to retrieve
   * @param {function} callback - the function to be used over each element
   * @returns {object} each key-value pair
   */
  iterateBottomKValues(k, callback) {
    return this.iterate(callback, 'bottom', k);
  }

  iterate(callback, type, k) {
    let self = this;
    let f = null;
    let size = 0;
    return self.size().then(function(numResults) {
      return numResults;
    }).then(function(numResults) {
      if (type === 'bottom') {
        f = function(start, size, iterate) {return self.getBottomKValues(k, start, size).then(iterate)};
      } else if (type === 'top') {
        f = function(start, size, iterate) {return self.getTopKValues(k, start, size).then(iterate)};
      } else if (type === 'values') {
        f = function(start, size, iterate) {return self.getValues(start, size).then(iterate)};
      }
      if (k <= self.graph.session.prefetchSize) {
        size = k;
      } else {
        size = self.graph.session.prefetchSize;
      }
      return iterator.iterate(callback, size, numResults, f);
    });
  }

  /**
   * Gets the size/length of this property
   * @function size
   * @memberof module:classes/property
   * @instance
   * @returns {number} the size of the property
   */
  size() {
    return this.getProxyField('size');
  }

  /**
   * Fill this property with a given value
   * @function fill
   * @memberof module:classes/property
   * @instance
   * @param {(string|number|Array.number)} value - the value
   * @returns {module:classes/property} the resulting property
   */
  fill(value) {
    let self = this;
    let localValue = self.addJsonDate(value);
    if (self.dimension > 0) {
      localValue = {'vect': localValue, 'type': self.type};
    }
    let propJson = {
      'entityType': self.entityType,
      'value': {
        'type': self.type,
        'value': JSON.stringify(localValue),
        'isVector': self.dimension > 0 ? true : false
      }
    };
    return core.postFill(this.graph, this.name, propJson).then(function(result) {
      return self;
    });
  }

  /**
   * Renames this property
   * @function rename
   * @memberof module:classes/property
   * @instance
   * @param {string} name - the new name
   * @returns {module:classes/property} the resulting property
   */
  rename(name) {
    let self = this;
    let propJson = {
      'entityType': self.entityType,
      'newName': name
    };
    return core.postRename(self.graph, self.name, propJson).then(function(result) {
      self.name = name;
      return self;
    });
  }

  /**
   * Sets a property value
   * @function set
   * @memberof module:classes/property
   * @instance
   * @param {number} k - the key (vertex/edge) whose property to set
   * @param {(string|number)} v - the value
   * @returns {module:classes/property} the resulting property
   */
  set(k, v) {
    let map = new Map();
    map.set(k, v);
    return this.setValues(map);
  }

  /**
   * Sets multiple property values
   * @function setValues
   * @memberof module:classes/property
   * @instance
   * @param {map} map - the key/value mapping to set
   * @returns {module:classes/property} the resulting property
   */
  setValues(map) {
    let self = this;
    let mapValues = {};
    map.forEach(function (value, key) {
      if (self.dimension > 0) {
        mapValues[key] = {'vect': value, 'type': self.type};
      } else {
        mapValues[key] = self.addJsonDate(value);
      }
    });
    let keyType = self.entityType === 'vertex' ? self.graph.vertexIdType : self.graph.edgeIdType;
    let propJson = {
      'entityType': self.entityType,
      'keyType': keyType,
      'valueType': self.type,
      'defaultValue': null,
      'values': JSON.stringify(mapValues),
      'isVector': self.dimension > 0 ? true : false
    };
    return core.postPropertySet(self.graph, self.name, propJson).then(function(result) {
      return self;
    });
  }

  /**
   * Creates a copy of this property
   * @function clone
   * @memberof module:classes/property
   * @instance
   * @param {string} [name] - new property name
   * @returns {module:classes/property} resulting property
   */
  clone(name) {
    let self = this;
    let localName = typeof name !== 'undefined' ? name : null;
    let propJson = {
      'entityType': self.entityType,
      'newName': localName
    };
    return core.postPropertyClone(self.graph, self.name, propJson).then(function(newProp) {
      return new Property(newProp, self.graph);
    })
  }

  /**
   * Publish this property
   * @function publish
   * @memberof module:classes/property
   * @instance
   * @returns {module:classes/property} resulting property
   */
  publish() {
    let self = this;
    return core.postPublishProperty(self).then(function(result) {
      return self;
    });
  }

  /**
   * Checks if this property is published
   * @function isPublished
   * @memberof module:classes/property
   * @instance
   * @returns {boolean} true if the property is published
   */
  isPublished() {
    return core.isPublishedProperty(this);
  }

  /**
   * Destroy the property
   * @function destroy
   * @memberof module:classes/property
   * @instance
   * @returns {null} null
   */
  destroy() {
    return core.delProperty(this);
  }

}