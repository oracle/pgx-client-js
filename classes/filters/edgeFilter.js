'use strict'

const graphFilterWithExpression = require('../filters/graphFilterWithExpression.js');
const filterConstants = require('../filters/filterConstants.js');

/**
 * An edge filter
 * @module classes/filters/edgeFilter
 * @augments module:classes/filters/graphFilterWithExpression
 */
module.exports = class EdgeFilter extends graphFilterWithExpression {

  constructor(filterExpression) {
    super(filterConstants.EDGE, filterExpression);
  }

}