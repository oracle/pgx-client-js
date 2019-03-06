/**
 * Copyright (c) 2019 Oracle and/or its affiliates. All rights reserved.
 *
 * Licensed under the Universal Permissive License v 1.0 as shown at
 * http://oss.oracle.com/licenses/upl.
 */
'use strict'

// services
const common = require('../services/common.js');

module.exports.getVersion = function (session) {
  let url = session.baseUrl + '/version';
  return common.doGet(url, session);
}