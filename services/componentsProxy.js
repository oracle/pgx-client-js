'use strict'

// services
const common = require('../services/common.js');

module.exports.getComponents = function (session, proxy, start, size) {
  let localStart = start != null ? encodeURIComponent(start) : 0;
  let localSize = size != null ? encodeURIComponent(size) : session.prefetchSize;
  let url = session.baseUrl + '/proxy/components/' + encodeURIComponent(proxy) + '?start=' + localStart + '&size=' +
    localSize;
  return common.doGet(url, session);
}

module.exports.getComponentById = function (session, proxy, id) {
  let url = session.baseUrl + '/proxy/components/' + encodeURIComponent(proxy) + '/componentById/' +
    encodeURIComponent(id);
  return common.doGet(url, session);
}

module.exports.getComponentIdForNode = function (session, proxy, nodeId, nodeType) {
  let url = session.baseUrl + '/proxy/components/' + encodeURIComponent(proxy) + '/componentIdForNode?node=' +
    encodeURIComponent(nodeId) + '&nodeType=' + encodeURIComponent(nodeType.toUpperCase());
  return common.doGet(url, session);
}