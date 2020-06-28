/**
 * Copyright (c) 2019 Oracle and/or its affiliates. All rights reserved.
 *
 * Licensed under the Universal Permissive License v 1.0 as shown at
 * http://oss.oracle.com/licenses/upl.
 */
'use strict'

// modules installed
var request = require('request');

// services
const common = require('../services/common.js');

module.exports.delResultSet = function (resultSet) {
  let url = resultSet.graph.session.baseUrl + '/core/v1/pgql/queryResults/x-result-set-id?_csrf_token=' + resultSet.graph.session.tokenId;

  let headers = {
    'x-result-set-id': resultSet.id
  }

  return common.doDel(url, resultSet.graph.session, resultSet, true, headers);
}

module.exports.postPgqlProxies = function(graph, resultSetId) {
  let url = graph.session.baseUrl + '/core/v1/pgqlProxies';
  let body = {
    'resultSetId': resultSetId
  }

  return common.doPost(url, graph.session, body)
}

module.exports.getResultSetElements = function (graph, resultSetId) {
  let url = graph.session.baseUrl + '/core/v1/pgqlProxies/x-proxy-id/elements';

  let headers = {
    'x-proxy-id': resultSetId
  }
  return common.doGet(url, graph.session, false, headers);
}

module.exports.getResultSet = function (graph, resultSetId, start, size) {
  let localStart = start != null ? start : 0;
  let localSize = size != null ? size : graph.session.prefetchSize;
  let url = graph.session.baseUrl + '/core/v1/pgqlProxies/x-proxy-id/results?start=' + localStart + '&size=' +
    localSize;

  let headers = {
    'x-proxy-id': resultSetId
  }
  return common.doGet(url, graph.session);
}
