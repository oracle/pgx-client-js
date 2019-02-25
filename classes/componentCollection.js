'use strict'

// services
const core = require('../services/core.js');
const collectionProxy = require('../services/collectionProxy.js');

// classes
const iterator = require('../classes/iterator.js');
const vertex = require('../classes/vertex.js');

/**
 * A collection of vertices
 * @module classes/componentCollection
 */
module.exports = class ComponentCollection {

  /**
   * Creates a collection
   * @param {string} componentNamespace - namespace of the component
   * @param {module:classes/graph} graph - graph
   * @param {number} index - partition index
   */
  constructor(componentNamespace, graph, index) {
    this.componentNamespace = componentNamespace;
    this.idType = graph.vertexIdType;
    this.elementType = "vertex";
    this.collectionType = "set";
    this.graph = graph;
    this.index = index
  }

  getProxy() {
    let self = this;
    return new Promise(
      function(resolve, reject) {
        if (self.proxy) {
          resolve(self.proxy);
        } else {
          return core.getWrappedCollectionProxy(self.graph, self.componentNamespace, self.index).then(function(proxy) {
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

  /**
   * Gets the number of elements in this collection
   * @function size
   * @memberof module:classes/componentCollection
   * @instance
   * @returns {number} number of elements in this collection
   */
  size() {
    return this.getProxyField('size');
  }

  getResults(start, size) {
    let self = this;
    return self.getProxyField('proxyId').then(function(proxyId) {
      return collectionProxy.getElements(self.graph.session, proxyId, start, size);
    }).then(function(elements) {
      let collection = [];
      for(let i=0; i<elements.length; i++) {
        collection.push(new vertex(elements[i], self.graph, self.index));
      }
      return collection;
    });
  }

  /**
   * Iterates over the collection
   * @function iterate
   * @memberof module:classes/componentCollection
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
}