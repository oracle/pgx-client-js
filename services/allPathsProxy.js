/**
 * Copyright (c) 2019 Oracle and/or its affiliates. All rights reserved.
 *
 * Licensed under the Universal Permissive License v 1.0 as shown at
 * http://oss.oracle.com/licenses/upl.
 */
'use strict'

const common = require('../services/common.js');

module.exports.getPath = function (session, proxy, destId, destType) {
  let url = session.baseUrl + '/proxy/paths/' + encodeURIComponent(proxy) + '/getPath?destValue=' +
    encodeURIComponent(destId) + '&destValueType=' + encodeURIComponent(destType);
  return common.doGet(url, session);
}