'use strict'

const request = require('request');

// helpers
const commonHelper = require('../helpers/common.js');

// services
const common = require('../services/common.js');

module.exports.getFuture = function (session, futureId) {
  return privateGetFuture(session, futureId);
}

function privateGetFuture(session, futureId, timeout) {
  return new Promise(
    function(resolve, reject) {
      let localTimeout = timeout != null ? timeout : setTimeout(
        function() {
          reject(commonHelper.createError(null, null, JSON.stringify('remoteFutureTimeout has been reached')));
        },
        session.remoteFutureTimeout);
      let options = Object.assign(session.baseGetRequest, {url: session.baseUrl + '/future/core/' +
        encodeURIComponent(futureId)});
      request(options, function(err, response, body) {
        let statusCode = response != null ? response.statusCode : null;
        if (!err && ((statusCode === common.HTTP_STATUS_CODES.OK) ||
            (statusCode === common.HTTP_STATUS_CODES.CREATED))) {
          if (body) {
            body = JSON.parse(body);
          }
          clearTimeout(localTimeout);
          resolve(body);
        } else if (!err && (statusCode === common.HTTP_STATUS_CODES.ACCEPTED)) {
          setTimeout(function() {resolve(privateGetFuture(session, futureId, localTimeout));},
            session.remoteFuturePendingRetryInterval);
        } else {
          clearTimeout(localTimeout);
          reject(commonHelper.createError(err, statusCode, body));
        }});
  });
}