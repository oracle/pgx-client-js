'use strict'

const common = require('../services/common.js');

module.exports.getPath = function (session, proxy, destId, destType) {
  let url = session.baseUrl + '/proxy/paths/' + encodeURIComponent(proxy) + '/getPath?destValue=' +
    encodeURIComponent(destId) + '&destValueType=' + encodeURIComponent(destType);
  return common.doGet(url, session);
}