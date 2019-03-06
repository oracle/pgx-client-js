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
 * An edge filter
 * @module classes/filters/edgeFilter
 * @augments module:classes/filters/graphFilterWithExpression
 */
module.exports = class EdgeFilter extends graphFilterWithExpression {

  constructor(filterExpression) {
    super(filterConstants.EDGE, filterExpression);
  }

}