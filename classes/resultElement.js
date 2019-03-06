/**
 * Copyright (c) 2019 Oracle and/or its affiliates. All rights reserved.
 *
 * Licensed under the Universal Permissive License v 1.0 as shown at
 * http://oss.oracle.com/licenses/upl.
 */
'use strict'

module.exports = class ResultElement {

  constructor(elementType, varName, vertexEdgeIdType) {
    this.elementType = elementType;
    this.varName = varName;
    this.vertexEdgeIdType = vertexEdgeIdType;
  }

}