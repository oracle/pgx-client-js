'use strict'

const NANOS_PER_SECOND = 1000000000;
const NANOS_PER_MINUTE = NANOS_PER_SECOND * 60;
const NANOS_PER_HOUR = NANOS_PER_MINUTE * 60;
const MILLIS_PER_NANO = 1000000;

/**
 * A class with utilities methods
 * @module classes/util
 */
module.exports = class Util {

  /**
   * Iterates over an array of componentCollection
   * @function iterateOverComponentCollections
   * @memberof module:classes/util
   * @static
   * @param {module:classes/componentCollection[]} arr - array of componentCollection
   * @param {function} callback - the function to be used over each vertex
   * @returns {module:classes/vertex} each vertex
   */
  static iterateOverComponentCollections(arr, callback) {
    let localArr = (arr && arr.constructor === Array) ? arr : [];
    return localArr.reduce(function(promise, compCol) {
      return promise.then(function() {
        return compCol.iterate(callback);
      });
    }, Promise.resolve());
  }

  /**
   * Extracts the date as Millis of day,
   * @function toMilliOfDay
   * @memberof module:classes/util
   * @static
   * @param {date} date - the date to extract
   * @returns {number} the millis of day equivalent to this date
   */
  static toMilliOfDay(date) {
    let total = 0;
    if (Object.prototype.toString.call(date) === '[object Date]') {
      total += date.getHours() * NANOS_PER_HOUR;
      total += date.getMinutes() * NANOS_PER_MINUTE;
      total += date.getSeconds() * NANOS_PER_SECOND;
      total = Math.trunc(total / MILLIS_PER_NANO) + date.getMilliseconds();
    }
    return total;
  }

}