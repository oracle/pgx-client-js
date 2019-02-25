'use strict'

const common = require('../services/common.js');

module.exports.containsKey = function (session, proxy, key) {
  let url = session.baseUrl + '/proxy/map/' + encodeURIComponent(proxy) + '/containsKey?key=' + encodeURIComponent(key);
  return common.doGet(url, session);
}

module.exports.getEntries = function (session, proxy, start, size) {
  let localStart = start != null ? encodeURIComponent(start) : 0;
  let localSize = size != null ? encodeURIComponent(size) : session.prefetchSize;
  let url = session.baseUrl + '/proxy/map/' + encodeURIComponent(proxy) + '/entries?start=' + localStart + '&size=' +
    localSize;
  return common.doGet(url, session);
}

module.exports.getValue = function (session, proxy, key) {
  let url = session.baseUrl + '/proxy/map/' + encodeURIComponent(proxy) + '/getValue?key=' + encodeURIComponent(key);
  return common.doGet(url, session);
}

module.exports.getKeys = function (session, proxy, start, size) {
  let localStart = start != null ? encodeURIComponent(start) : 0;
  let localSize = size != null ? encodeURIComponent(size) : session.prefetchSize;
  let url = session.baseUrl + '/proxy/map/' + encodeURIComponent(proxy) + '/keys?start=' + localStart + '&size=' +
    localSize;
  return common.doGet(url, session);
}