'use strict'

// modules installed
var request = require('request');

// helpers
const commonHelper = require('../helpers/common.js');

// services
const common = require('../services/common.js');

module.exports.getToken = function (url, options) {
  let localOptions = Object.assign({}, options);
  localOptions.url = url + '/token';
  /* browser */
  localOptions.withCredentials = true;
  return new Promise(
    function(resolve, reject) {
      request.get(localOptions,
        function(err, response, body) {
          let statusCode = response != null ? response.statusCode : null;
          if (!err && statusCode === common.HTTP_STATUS_CODES.CREATED) {
            let token = common.getCookie(response, '_csrf_token');
            resolve(token);
          } else {
            let contentType = response && response.headers && response.headers['content-type'] ?
              response.headers['content-type'] : 'empty';
            let localBody = body;
            if (!contentType.includes("json")) {
              localBody = JSON.stringify('could not connect, expected JSON response but got <' + contentType + '>');
            }
            reject(commonHelper.createError(err, statusCode, localBody));
          }
      });
  });
}