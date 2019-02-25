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