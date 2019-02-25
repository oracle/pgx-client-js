'use strict'

// services
const common = require('../services/common.js');

module.exports.getVersion = function (session) {
  let url = session.baseUrl + '/version';
  return common.doGet(url, session);
}