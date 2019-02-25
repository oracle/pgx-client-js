'use strict'

// modules installed
var request = require('request');

// helpers
const commonHelper = require('../helpers/common.js');

// services
const common = require('../services/common.js');

module.exports.postSession = function (url, options, tokenId) {
  let localOptions = Object.assign({}, options);
  localOptions.url = url + '/session';
  if (typeof window === 'undefined') { // no need to do this in a browser (will trigger security error)
    localOptions.headers = {
      'Cookie': '_csrf_token=' + tokenId
    };
  }
  localOptions.json = {
    '_csrf_token': tokenId,
    'source': 'pgxRest',
    'idleTimeout': null,
    'taskTimeout': null,
    'timeUnitName': 'SECONDS'
  };
  /* browser */
  localOptions.withCredentials = true;
  return new Promise(
    function(resolve, reject) {
      request.post(
        localOptions,
        function(err, response, body) {
          let statusCode = response != null ? response.statusCode : null;
          if (!err && statusCode === common.HTTP_STATUS_CODES.CREATED) {
            resolve(common.getCookie(response, 'SID'));
          } else {
            reject(commonHelper.createError(err, statusCode, body));
          }
      });
  });
}

module.exports.delSession = function (session) {
  let url = session.baseUrl + '/session' + '?_csrf_token=' + session.tokenId;
  return common.doDel(url, session, session);
}