'use strict'

const filterConstants = require('../filters/filterConstants.js');

/**
 * A binary graph filter
 * @module classes/filters/binaryGraphFilterOperation
 */
module.exports = class BinaryGraphFilterOperation {

  /**
   * Creates a binary graph filter
   * @param {string} type - filter type [INTERSECT | UNION]
   * @param {(module:classes/filters/graphFilterWithExpression|module:classes/filters/binaryGraphFilterOperation)}
   *   leftFilter - left graph filter
   * @param {(module:classes/filters/graphFilterWithExpression|module:classes/filters/binaryGraphFilterOperation)}
   *   rightFilter - right graph filter
   */
  constructor(type, leftFilter, rightFilter) {
    this.type = type;
    this.leftFilter = leftFilter;
    this.rightFilter = rightFilter;
    this.binaryOperation = true;
  }

  /**
   * Intersect this filter with another
   * @function intersect
   * @memberof module:classes/filters/binaryGraphFilterOperation
   * @instance
   * @param {(module:classes/filters/graphFilterWithExpression|module:classes/filters/binaryGraphFilterOperation)}
   *   graphFilter - graph filter
   * @returns {module:classes/filters/binaryGraphFilterOperation} a binary graph filter
   */
  intersect(graphFilter) {
    return new BinaryGraphFilterOperation(filterConstants.INTERSECT, this, graphFilter);
  }

  /**
   * Unite this filter with another
   * @function union
   * @memberof module:classes/filters/binaryGraphFilterOperation
   * @instance
   * @param {(module:classes/filters/graphFilterWithExpression|module:classes/filters/binaryGraphFilterOperation)}
   *   graphFilter - graph filter
   * @returns {module:classes/filters/binaryGraphFilterOperation} a binary graph filter
   */
  union(graphFilter) {
    return new BinaryGraphFilterOperation(filterConstants.UNION, this, graphFilter);
  }

}