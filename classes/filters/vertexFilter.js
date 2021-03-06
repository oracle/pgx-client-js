/**
 * Copyright (c) 2019 Oracle and/or its affiliates. All rights reserved.
 *
 * Licensed under the Universal Permissive License v 1.0 as shown at
 * http://oss.oracle.com/licenses/upl.
 */
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