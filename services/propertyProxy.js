/**
 * Copyright (c) 2019 Oracle and/or its affiliates. All rights reserved.
 *
 * Licensed under the Universal Permissive License v 1.0 as shown at
 * http://oss.oracle.com/licenses/upl.
 */
'use strict'

const common = require('../services/common.js');

module.exports.getValues = function (session, proxyId, start, size) {
  let localStart = start != null ? encodeURIComponent(start) : 0;
  let localSize = size != null ? encodeURIComponent(size) : session.prefetchSize;
  let url = session.baseUrl + '/core/v1/propertyProxies/x-proxy-id/values?start=' + localStart + '&size=' + localSize;

  let headers = {
    'x-proxy-id': proxyId
  }

  return common.doGet(url, session, false, headers);
}

module.exports.getByKey = function (session, proxyId, key) {
  let url = session.baseUrl + '/core/v1/propertyProxies/x-proxy-id/values/x-property-key';
  let headers = {
    'x-proxy-id': proxyId,
    'x-property-key': key
  }
  return common.doGet(url, session, false, headers);
}

module.exports.getBottom = function (session, proxyId, k, start, size) {
  let localStart = start != null ? encodeURIComponent(start) : 0;
  let localSize = size != null ? encodeURIComponent(size) : session.prefetchSize;
  let url = session.baseUrl + '/core/v1/propertyProxies/x-proxy-id/bottomKValues?k=' + encodeURIComponent(k) +
    '&start=' + localStart + '&size=' + localSize;

  let headers = {
    'x-proxy-id': proxyId
  }
  return common.doGet(url, session, false, headers);
}

module.exports.getTop = function (session, proxyId, k, start, size) {
  let localStart = start != null ? encodeURIComponent(start) : 0;
  let localSize = size != null ? encodeURIComponent(size) : session.prefetchSize;
  let url = session.baseUrl + '/core/v1/propertyProxies/x-proxy-id/topKValues?k=' + k +
    '&start=' + localStart + '&size=' + localSize;

  let headers = {
    'x-proxy-id': proxyId
  }

  return common.doGet(url, session, false, headers);
}
