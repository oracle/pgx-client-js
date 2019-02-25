'use strict'

// modules installed
var request = require('request');

// services
const common = require('../services/common.js');

module.exports.delResultSet = function (resultSet) {
  let url = resultSet.graph.session.baseUrl + '/proxy/pgqlResultSet/' + resultSet.resultSetId +
    '?_csrf_token=' + resultSet.graph.session.tokenId;
  return common.doDel(url, resultSet.graph.session, resultSet);
}

module.exports.getResultSetElements = function (graph, resultSetId) {
  let url = graph.session.baseUrl + '/proxy/pgqlResultSet/' + resultSetId + '/elements';
  return common.doGet(url, graph.session);
}

module.exports.getResultSet = function (graph, resultSetId, start, size) {
  let localStart = start != null ? start : 0;
  let localSize = size != null ? size : graph.session.prefetchSize;
  let url = graph.session.baseUrl + '/proxy/pgqlResultSet/' + resultSetId + '?start=' + localStart + '&size=' +
    localSize;
  return common.doGet(url, graph.session);
}