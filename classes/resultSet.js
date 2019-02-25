'use strict'

// services
const resultSetService = require('../services/resultSet.js');

// classes
const iterator = require('../classes/iterator.js');

// helpers
const common = require('../helpers/common.js');

/**
 * Result set of a pattern matching query
 * @module classes/resultSet
 */
module.exports = class ResultSet {

  /**
   * Creates a resultSet
   * @param {object} result - The result of creating a resultSet from ws
   * @param {object} elements - list of PGQL result elements information
   * @param {module:classes/graph} graph - graph
   */
  constructor(result, elements, graph) {
    this.resultSetId = result.resultSetId;
    this.numResults = result.numResults;
    this.resultElements = elements.slice();
    this.graph = graph;
  }

  extractDate(value, type) {
    let result = value;
    switch (type.toUpperCase()) {
      case common.dateTypes.TIME_WITH_TIMEZONE:
        result = value[common.dateTypes.TIME_PART_OF_TIME_WITH_TZ] + ':' + value[common.dateTypes.TZ_PART_OF_TIME_WITH_TZ];
        break;
      case common.dateTypes.TIMESTAMP_WITH_TIMEZONE:
        result = value[common.dateTypes.TIMESTAMP_PART_OF_TS_WITH_TZ] + ':' + value[common.dateTypes.TZ_PART_OF_TS_WITH_TZ];
        break;
    }
    return result;
  }

  getResults(start, size) {
    let self = this;
    return resultSetService.getResultSet(self.graph, self.resultSetId, start, size).then(function(result) {

      let callback = function(row) {
        let elements = {};
        for(let i=0;i<self.resultElements.length;i++) {
          elements[self.resultElements[i].varName] = self.extractDate(row[i], self.resultElements[i].elementType);
        }
        return elements;
      };

      return result.map(callback);
    });
  }

  /**
   * Iterates over the result set
   * @function iterate
   * @memberof module:classes/resultSet
   * @instance
   * @param {function} callback - the function to be used over each element
   * @returns {object} each row of the result set
   */
  iterate(callback) {
    let self = this;
    return iterator.iterate(callback, self.graph.session.prefetchSize, self.numResults,
      function(start, size, iterate) {return self.getResults(start, size).then(iterate);});
  }

  /**
   * Destroy a resultSet
   * @function destroy
   * @memberof module:classes/resultSet
   * @instance
   * @returns {null} null
   */
  destroy() {
    return resultSetService.delResultSet(this);
  }

}