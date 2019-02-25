'use strict'

// services
const componentsProxy = require('../services/componentsProxy.js');
const core = require('../services/core.js');

// classes
const iterator = require('../classes/iterator.js');
const componentCollection = require('../classes/componentCollection.js');

/**
 * A vertex partition of a graph
 * @module classes/partition
 */
module.exports = class Partition {

  /**
   * Creates a partition
   * @param {object} result - The result of creating a partition from the ws
   * @param {module:classes/graph} graph - graph
   */
  constructor(result, graph) {
    this.proxyId = result.proxyId;
    this.sizeField = result.size;
    this.propertyName = result.propertyName;
    this.graph = graph;
    this.componentNamespace = result.componentNamespace;
  }

  /**
   * Gets a partition by index
   * @function getPartitionByIndex
   * @memberof module:classes/partition
   * @instance
   * @param {number} index - the index
   * @returns {module:classes/componentCollection} the set of vertices representing the partition
   */
  getPartitionByIndex(index) {
    let self = this;
    return new componentCollection(self.componentNamespace, self.graph, index);
  }

  /**
   * Gets the index of the partition a particular vertex belongs to
   * @function getPartitionIndexOfVertex
   * @memberof module:classes/partition
   * @instance
   * @param {number} nodeId - the vertex id
   * @returns {number} the index of the partition the given vertex belongs to
   */
  getPartitionIndexOfVertex(nodeId) {
    return componentsProxy.getComponentIdForNode(this.graph.session, this.proxyId, nodeId, this.graph.vertexIdType);
  }

  /**
   * Gets the partition a particular vertex belongs to
   * @function getPartitionByVertex
   * @memberof module:classes/partition
   * @instance
   * @param {number} nodeId - the vertex id
   * @returns {module:classes/collection} the set of vertices representing the partition the given vertex belongs to
   */
  getPartitionByVertex(nodeId) {
    let self = this;
    return self.getPartitionIndexOfVertex(nodeId).then(function(index) {
      return self.getPartitionByIndex(index);
    });
  }

  getResults(start, size) {
    let self = this;
    let collection = [];
    start = start || 0;
    size = size || self.sizeField - start;
    return new Promise(
      function(resolve, reject) {
        for(var i=start; i<start+size; i++) {
          collection.push(new componentCollection(self.componentNamespace, self.graph, i));
        }
        resolve(collection);
    });
  }

  /**
   * Iterates over the partitions
   * @function iterate
   * @memberof module:classes/partition
   * @instance
   * @param {function} callback - the function to be used over each element
   * @returns {module:classes/collection} each set of vertices
   */
  iterate(callback) {
    let self = this;
    let localSize = (self.graph.session.prefetchSize > self.sizeField) ? self.sizeField : self.graph.session.prefetchSize;
    return iterator.iterate(callback, localSize, self.sizeField,
      function(start, size, iterate) {return self.getResults(start, size).then(iterate)});
  }

  /**
   * Gets the size of this partition
   * @function size
   * @memberof module:classes/partition
   * @instance
   * @returns {number} the number of partitions
   */
  size() {
    return this.sizeField;
  }

  /**
   * Destroy the partition
   * @function destroy
   * @memberof module:classes/partition
   * @instance
   * @returns {null} null
   */
  destroy() {
    core.delPartition(this)
  }

}