'use strict'

const common = require('../services/common.js');

module.exports.getElements = function (session, proxyId, start, size) {
  let localStart = start != null ? encodeURIComponent(start) : 0;
  let localSize = size != null ? encodeURIComponent(size) : session.prefetchSize;
  let url = session.baseUrl + '/proxy/collection/' + encodeURIComponent(proxyId) + '?start=' + localStart + '&size=' +
    localSize;
  return common.doGet(url, session);
}