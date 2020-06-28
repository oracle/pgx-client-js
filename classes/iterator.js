/**
 * Copyright (c) 2019 Oracle and/or its affiliates. All rights reserved.
 *
 * Licensed under the Universal Permissive License v 1.0 as shown at
 * http://oss.oracle.com/licenses/upl.
 */
'use strict'

module.exports = class Iterator {

  static iterate(callback, size, numResults, getResults) {
    let start = 0;
    let fn = function(result) {
      start += size;
      for (let value of result) {
        callback(value);
      }
      if (start < numResults) {
        return getResults(start, size, fn);
      }
    };
    return getResults(start, size, fn);
  }

}
