'use strict'

const allPathsProxy = require('../services/allPathsProxy.js');
const path = require('../classes/path.js');

/**
 * The paths from one source vertex to all other vertices
 * @module classes/allPaths
 */
module.exports = class AllPaths {

  /**
   * Creates an allPaths
   * @param {number} rootId - source vertex id
   * @param {string} proxyId - proxy id
   * @param {module:classes/graph} graph - graph
   */
  constructor(rootId, proxyId, graph) {
    this.source = rootId;
    this.proxyId = proxyId;
    this.graph = graph;
  }

  /**
   * Gets the path
   * @function getPath
   * @memberof module:classes/allPaths
   * @instance
   * @param {number} destId - destination vertex id
   * @returns {module:classes/path} The path to the destination vertex
   */
  getPath(destId) {
    let self = this;
    return allPathsProxy.getPath(self.graph.session, self.proxyId, destId, self.graph.vertexIdType.toUpperCase()).then(
      function(result) {
        return new path(self.source, destId, result, self.graph);
    });
  }

}