'use strict'

// services
const core = require('../services/core.js');
const mapProxy = require('../services/mapProxy.js');

// classes
const iterator = require('../classes/iterator.js');
const ArgumentBuilder = require('../classes/argumentBuilder.js');

/**
 * A map is a collection of key-value pairs
 * @module classes/map
 */
module.exports = class Map {

  /**
   * Creates a map
   * @param {string} name - map name
   * @param {string} keyType - key type
   * @param {string} valType - value type
   * @param {module:classes/graph} graph - graph
   */
  constructor(name, keyType, valType, graph) {
    this.name = name;
    this.keyType = keyType;
    this.valType = valType;
    this.graph = graph;
  }

  /**
   * Checks if the map contains key
   * @function containsKey
   * @memberof module:classes/map
   * @instance
   * @param {(number|string)} key - The key
   * @returns {boolean} true if the map contains key
   */
  containsKey(key) {
    let localSession = this.graph.session;
    return core.getMapProxy(this.graph, this.name).then(function(proxy) {
      return mapProxy.containsKey(localSession, proxy.proxyId, key);
    });
  }

  entries(start, size) {
    let localSession = this.graph.session;
    return core.getMapProxy(this.graph, this.name).then(function(proxy) {
      return mapProxy.getEntries(localSession, proxy.proxyId, start, size);
    });
  }

  /**
   * Iterates over the entries
   * @function iterateEntries
   * @memberof module:classes/map
   * @instance
   * @param {function} callback - the function to be used over each element
   * @returns {object} each key-value pair
   */
  iterateEntries(callback) {
    return this.iterate(callback, 'entries');
  }

  /**
   * Gets the value of a key
   * @function get
   * @memberof module:classes/map
   * @instance
   * @param {(number|string)} key - the key
   * @returns {string} the value
   */
  get(key) {
    let localSession = this.graph.session;
    return core.getMapProxy(this.graph, this.name).then(function(proxy) {
      return mapProxy.getValue(localSession, proxy.proxyId, key);
    });
  }

  keys(start, size) {
    let localSession = this.graph.session;
    return core.getMapProxy(this.graph, this.name).then(function(proxy) {
      return mapProxy.getKeys(localSession, proxy.proxyId, start, size);
    });
  }

  /**
   * Iterates over the keys
   * @function iterateKeys
   * @memberof module:classes/map
   * @instance
   * @param {function} callback - the function to be used over each element
   * @returns {string} each key
   */
  iterateKeys(callback) {
    return this.iterate(callback, 'keys');
  }

  iterate(callback, type) {
    let self = this;
    let f = null;
    return self.size().then(function(numResults) {
      return numResults;
    }).then(function(numResults) {
      if (type === 'entries') {
        f = function(start, size, iterate) {return self.entries(start, size).then(iterate)};
      } else if (type === 'keys') {
        f = function(start, size, iterate) {return self.keys(start, size).then(iterate)};
      }
      return iterator.iterate(callback, self.graph.session.prefetchSize, numResults, f);
    });
  }

  /**
   * Removes the entry specified by the given key from the map
   * @function remove
   * @memberof module:classes/map
   * @instance
   * @param {(number|string)} key - the key
   * @returns {module:classes/map} the resulting map
   */
  remove(key) {
    let self = this;
    let mapJson = new ArgumentBuilder().setType(self.keyType).setValue(key).isVector(false).build();
    return core.postMapEntryDelete(self.graph, self.name, mapJson).then(function(result) {
      return self;
    });
  }

  /**
   * Sets the value for a key in the map
   * @function set
   * @memberof module:classes/map
   * @instance
   * @param {(number|string)} key - the key
   * @param {(number|string)} value - the value
   * @returns {module:classes/map} the resulting map
   */
  set(key, value) {
    let self = this;
    let mapEntryJson = {
      "key": new ArgumentBuilder().setType(self.keyType).setValue(JSON.stringify(key)).isVector(false).build(),
      "value": new ArgumentBuilder().setType(self.valType).setValue(JSON.stringify(value)).isVector(false).build()
    };
    return core.postMapEntry(self.graph, self.name, mapEntryJson).then(function(result) {
      return self;
    });
  }

  /**
   * Returns the size of the map
   * @function size
   * @memberof module:classes/map
   * @instance
   * @returns {number} the size of the map
   */
  size() {
    return core.getMapProxy(this.graph, this.name).then(function(proxy) {
      return proxy.size;
    });
  }

  /**
   * Destroy the map
   * @function destroy
   * @memberof module:classes/map
   * @instance
   * @returns {null} null
   */
  destroy() {
    return core.delMap(this);
  }

}