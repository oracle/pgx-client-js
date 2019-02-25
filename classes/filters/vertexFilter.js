'use strict'

const graphFilterWithExpression = require('../filters/graphFilterWithExpression.js');
const filterConstants = require('../filters/filterConstants.js');

/**
 * A vertex filter
 * @module classes/filters/vertexFilter
 * @augments module:classes/filters/graphFilterWithExpression
 */
module.exports = class VertexFilter extends graphFilterWithExpression {

  constructor(filterExpression) {
    super(filterConstants.VERTEX, filterExpression);
  }

}