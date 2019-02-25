'use strict'

/**
 * A path from a source to a destination vertex in a graph
 * @module classes/path
 */
module.exports = class Path {

  /**
   * Creates a path
   * @param {number} rootId - source vertex id
   * @param {number} destId - destination vertex id
   * @param {object} result - The result of creating a path from ws
   * @param {module:classes/graph} graph - graph
   */
  constructor(rootId, destId, result, graph) {
    this.source = rootId;
    this.destination = destId;
    this.pathLengthWithCost = result.cost;
    this.pathLengthWithHop = result.pathLength;
    this.vertices = result.serializedNodes;
    this.edges = result.serializedEdges;
    this.existsField = result.exists;
    this.graph = graph;
  }

  /**
   * Checks whether a path exists
   * @function exists
   * @memberof module:classes/path
   * @instance
   * @returns {boolean} true, if exists
   */
  exists() {
    return this.existsField;
  }

}