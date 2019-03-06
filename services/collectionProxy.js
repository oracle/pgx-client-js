/**
 * Copyright (c) 2019 Oracle and/or its affiliates. All rights reserved.
 *
 * Licensed under the Universal Permissive License v 1.0 as shown at
 * http://oss.oracle.com/licenses/upl.
 */
'use strict'

const common = require('../services/common.js');

module.exports.getElements = function (session, proxyId, start, size) {
  let localStart = start != null ? encodeURIComponent(start) : 0;
  let localSize = size != null ? encodeURIComponent(size) : session.prefetchSize;
  let url = session.baseUrl + '/proxy/collection/' + encodeURIComponent(proxyId) + '?start=' + localStart + '&size=' +
    localSize;
  return common.doGet(url, session);
}