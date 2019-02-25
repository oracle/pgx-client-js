'use strict'

// services
const core = require('../services/core.js');
const collectionProxy = require('../services/collectionProxy.js');

// classes
const iterator = require('../classes/iterator.js');
const vertex = require('../classes/vertex.js');

/**
 * A collection of vertices/edges
 * @module classes/collection
 */
module.exports = class Collection {

  /**
   * Creates a collection
   * @param {string} name - colelction name
   * @param {string} elementType - element type
   * @param {string} collectionType - collection type
   * @param {module:classes/graph} graph - graph
   */
  constructor(name, elementType, collectionType, graph) {
    this.name = name;
    this.idType = graph.vertexIdType;
    this.elementType = elementType;
    this.collectionType = collectionType;
    this.graph = graph;
  }

  /**
   * Adds one element to this collection
   * @function add
   * @memberof module:classes/collection
   * @instance
   * @param {number} value - id of element to be added
   * @returns {module:classes/collection} The collection
   */
  add(value) {
    return this.addAll(value);
  }

  /**
   * Adds one or more elements to this collection
   * @function addAll
   * @memberof module:classes/collection
   * @instance
   * @param {Array.number} values - ids of elements to be added
   * @returns {module:classes/collection} The collection
   */
  addAll(values) {
    let self = this;
    let collectionJson = {
      "valueType": self.idType,
      "values": '[' + values.toString() + ']'
    };
    return core.postAddAllCollection(self.graph, self.name, collectionJson).then(function(collName) {
      return self;
    });
  }

  /**
   * Removes elements from this collection
   * @function removeAll
   * @memberof module:classes/collection
   * @instance
   * @param {Array.number} values - ids of elements to be removed
   * @returns {module:classes/collection} The collection
   */
  removeAll(values) {
    let self = this;
    let collectionJson = {
      "valueType": self.idType,
      "values": '[' + values.toString() + ']'
    };
    return core.postRemoveAllCollection(self.graph, self.name, collectionJson).then(function(collName) {
      return self;
    });
  }

  /**
   * Clears the collection
   * @function clear
   * @memberof module:classes/collection
   * @instance
   * @returns {module:classes/collection} The collection
   */
  clear() {
    let self = this;
    return core.postClearCollection(self.graph, self.name).then(function(collName) {
      return self;
    });
  }

  /**
   * Gets the number of elements in this collection
   * @function size
   * @memberof module:classes/collection
   * @instance
   * @returns {number} number of elements in this collection
   */
  size() {
    return core.getCollectionProxy(this.graph, this.name).then(function(result) {
      return result.size;
    });
  }

  getResults(start, size) {
    let self = this;
    return core.getCollectionProxy(self.graph, self.name).then(function(proxy) {
      return collectionProxy.getElements(self.graph.session, proxy.proxyId, start, size);
    }).then(function(elements) {
      let collection = [];
      for(let i=0; i<elements.length; i++) {
        collection.push(new vertex(elements[i], self.graph));
      }
      return collection;
    });
  }

  /**
   * Iterates over the collection
   * @function iterate
   * @memberof module:classes/collection
   * @instance
   * @param {function} callback - the function to be used over each element
   * @returns {object} each element
   */
  iterate(callback) {
    let self = this;
    let f = null;
    return self.size().then(function(numResults) {
      return numResults;
    }).then(function(numResults) {
      f = function(start, size, iterate) {return self.getResults(start, size).then(iterate)};
      return iterator.iterate(callback, self.graph.session.prefetchSize, numResults, f);
    });
  }

  /**
   * Clone the collection.
   * @function clone
   * @memberof module:classes/collection
   * @instance
   * @returns {module:classes/collection} a new collection
   */
  clone() {
    let self = this;
    return core.postCollectionClone(self.graph, self.name).then(function(collName) {
      return new Collection(collName, self.elementType, self.collectionType, self.graph);
    })
  }

  /**
   * Checks if this collection contains the specified element.
   * @function contains
   * @memberof module:classes/collection
   * @instance
   * @param {number} id - id of element whose presence in this collection is to be tested
   * @returns {boolean} true if this collection contains the specified element
   */
  contains(id) {
    let self = this;
    let collectionJson = {
      "element": id
    };
    return core.postContainsCollection(self.graph, self.name, collectionJson);
  }

  /**
   * Destroy the collection.
   * @function destroy
   * @memberof module:classes/collection
   * @instance
   * @returns {null} null
   */
  destroy() {
    return core.delCollection(this);
  }

}