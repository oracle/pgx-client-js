'use strict'

const algorithm = require('../helpers/algorithm.js');

/**
 * Object that holds the state for repeatedly returning estimated ratings
 * @module classes/matrixFactorizationModel
 */
module.exports = class MatrixFactorizationModel {

  /**
   * Creates a matrixFactorizationModel
   * @param {module:classes/property} features - features vertex property
   * @param {number} rootMeanSquareError - computed root mean square error value
   * @param {module:classes/graph} graph - graph
   */
  constructor(features, rootMeanSquareError, graph) {
    this.features = features;
    this.rootMeanSquareError = rootMeanSquareError;
    this.graph = graph;
  }

  /**
   * Computes estimated ratings for a specific vertex
   * @function getEstimatedRatings
   * @memberof module:classes/matrixFactorizationModel
   * @instance
   * @param {module:classes/vertex} vertex - The vertex to get estimated ratings for
   * @returns {module:classes/property} vertex property holding the result
   */
  getEstimatedRatings(vertex) {
    return algorithm.matrixFactorizationRecommendations(this.graph, this.features, vertex);
  }

}