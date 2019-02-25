'use strict'

const common = require('../services/common.js');

module.exports.getValues = function (session, proxyId, start, size) {
  let localStart = start != null ? encodeURIComponent(start) : 0;
  let localSize = size != null ? encodeURIComponent(size) : session.prefetchSize;
  let url = session.baseUrl + '/proxy/property/' + encodeURIComponent(proxyId) + '?start=' + localStart + '&size=' +
    localSize;
  return common.doGet(url, session);
}

module.exports.getByKey = function (session, proxyId, key) {
  let url = session.baseUrl + '/proxy/property/' + encodeURIComponent(proxyId) + '/byKey?key=' +
    encodeURIComponent(key);
  return common.doGet(url, session);
}

module.exports.getBottom = function (session, proxyId, k, start, size) {
  let localStart = start != null ? encodeURIComponent(start) : 0;
  let localSize = size != null ? encodeURIComponent(size) : session.prefetchSize;
  let url = session.baseUrl + '/proxy/property/' + encodeURIComponent(proxyId) + '/bottom?k=' + encodeURIComponent(k) +
    '&start=' + localStart + '&size=' + localSize;
  return common.doGet(url, session);
}

module.exports.getTop = function (session, proxyId, k, start, size) {
  let localStart = start != null ? encodeURIComponent(start) : 0;
  let localSize = size != null ? encodeURIComponent(size) : session.prefetchSize;
  let url = session.baseUrl + '/proxy/property/' + encodeURIComponent(proxyId) + '/top?k=' + encodeURIComponent(k) +
    '&start=' + localStart + '&size=' + localSize;
  return common.doGet(url, session);
}