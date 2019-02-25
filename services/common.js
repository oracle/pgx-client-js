'use strict'

const request = require('request');
const cookie = require('cookie');

// helpers
const commonHelper = require('../helpers/common.js');

// services
const future = require('../services/future.js');

const HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202
};

module.exports.HTTP_STATUS_CODES = HTTP_STATUS_CODES;

module.exports.doDel = function (url, session, item, withFuture) {
  return new Promise(
    function(resolve, reject) {
      let options = Object.assign(session.baseDelRequest, { url: url });
      request(options, function(err, response, body) {
        let statusCode = response != null ? response.statusCode : null;
        if (!err && ((statusCode === HTTP_STATUS_CODES.OK) || (statusCode === HTTP_STATUS_CODES.CREATED))) {
          if (withFuture) {
            future.getFuture(session, JSON.parse(body).futureId).then(function(result) {
              item = null;
              resolve(item);
            }, function(err) {
              reject(err);
            });
          } else {
            item = null;
            resolve(item);
          }
        } else {
          reject(commonHelper.createError(err, statusCode, body));
        }
      });
  });
}

module.exports.doPost = function (url, session, jsonContent) {
  return new Promise(
    function(resolve, reject) {
      let localJson = {};
      if (jsonContent) {
        localJson = jsonContent;
      }
      localJson['_csrf_token'] = session.basePostRequest.json['_csrf_token'];
      let options = Object.assign(session.basePostRequest, { url: url, json: localJson });
      request(options, function(err, response, body) {
        let statusCode = response != null ? response.statusCode : null;
        if (!err && ((statusCode === HTTP_STATUS_CODES.OK) || (statusCode === HTTP_STATUS_CODES.CREATED))) {
          future.getFuture(session, body.futureId).then(function(result) {
            resolve(result);
          }, function(err) {
            reject(err);
          });
        } else {
          reject(commonHelper.createError(err, statusCode, body));
        }
      });
  });
}

module.exports.doGet = function (url, session, withFuture) {
  return new Promise(
    function(resolve, reject) {
      let options = Object.assign(session.baseGetRequest, { url: url });
      request(options, function(err, response, body) {
        let statusCode = response != null ? response.statusCode : null;
        if (!err && ((statusCode === HTTP_STATUS_CODES.OK) || (statusCode === HTTP_STATUS_CODES.CREATED))) {
          if (withFuture) {
            future.getFuture(session, JSON.parse(body).futureId).then(function(result) {
              resolve(result);
            }, function(err) {
              reject(err);
            });
          } else {
            resolve(JSON.parse(body));
          }
        } else {
          reject(commonHelper.createError(err, statusCode, body));
        }});
  });
}

function getCookiesFromHeaderOrBrowser(response) {
  let headerField = 'set-cookie';
  if (response.headers && response.headers[headerField]) {
    return response.headers[headerField].toString();
  } else if (document) {
    return document.cookie;
  } else {
    return '';
  }
}

module.exports.getCookie = function(response, key) {
  let cookiesString = getCookiesFromHeaderOrBrowser(response);
  let cookies = cookie.parse(cookiesString);
  return cookies[key];
}
