'use strict'

const binaryGraphFilterOperation = require('../filters/binaryGraphFilterOperation.js');
const filterConstants = require('../filters/filterConstants.js');

/**
 * A graph filter
 * @module classes/filters/graphFilterWithExpression
 */
module.exports = class GraphFilterWithExpression {

  /**
   * Creates a graph filter
   * @param {string} type - filter type [VERTEX | EDGE]
   * @param {string} filterExpression - filter expression
   */
  constructor(type, filterExpression) {
    this.type = type;
    this.filterExpression = filterExpression;
    this.binaryOperation = false;
  }

  /**
   * Intersect this filter with another
   * @function intersect
   * @memberof module:classes/filters/graphFilterWithExpression
   * @instance
   * @param {module:classes/filters/graphFilterWithExpression} graphFilter - graph filter
   * @returns {module:classes/filters/binaryGraphFilterOperation} a binary graph filter
   */
  intersect(graphFilter) {
    return new binaryGraphFilterOperation(filterConstants.INTERSECT, this, graphFilter);
  }

  /**
   * Unite this filter with another
   * @function union
   * @memberof module:classes/filters/graphFilterWithExpression
   * @instance
   * @param {module:classes/filters/graphFilterWithExpression} graphFilter - graph filter
   * @returns {module:classes/filters/binaryGraphFilterOperation} a binary graph filter
   */
  union(graphFilter) {
    return new binaryGraphFilterOperation(filterConstants.UNION, this, graphFilter);
  }

}