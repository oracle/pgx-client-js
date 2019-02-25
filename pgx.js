'use strict'

const version = require('./services/version.js');
const token = require('./services/token.js');
const sessionService = require('./services/session.js');
const sessionClass = require('./classes/session.js');
const vertexFilter = require('./classes/filters/vertexFilter.js');
const edgeFilter = require('./classes/filters/edgeFilter.js');
const util = require('./classes/util.js');

// modules installed
var request = require('request');

/**
 * Main Module for PGX Node.js client
 * @module pgx
 */

/**
 * Connects to the PGX server
 * @function connect
 * @memberof module:pgx
 * @instance
 * @param {string} url - url
 * @param {object} [options] - options
 * @param {string} [options.username] - username
 * @param {string} [options.password] - password
 * @param {file} [options.clientKey] - client key
 * @param {file} [options.clientCert] - client cert
 * @param {file} [options.caCert] - ca cert
 * @param {string} [options.passphrase] - passphrase
 * @param {number} [options.prefetchSize=2048] - prefetch size
 * @param {number} [options.uploadBatchSize=65536] - upload batch size
 * @param {number} [options.remoteFutureTimeout=300000] - remote future timeout
 * @param {number} [options.remoteFuturePendingRetryInterval=500] - remote future pending retry interval
 * @returns {module:classes/session} The session
 */
module.exports.connect = function (url, options) {
  let localOptions = Object.assign({}, options);
  if ((localOptions.username != null) && (localOptions.password != null)) {
    let auth = {};
    auth.username = localOptions.username;
    auth.password = localOptions.password;
    localOptions.auth = auth;
  } else if (localOptions.clientKey != null) {
    localOptions.key = options.clientKey;
    localOptions.cert = options.clientCert;
    localOptions.ca = options.caCert;
    localOptions.passphrase = options.passphrase;
  }
  let session;
  let localTokenId;
  return token.getToken(url, localOptions).then(function(tokenId) {
    localTokenId = tokenId;
    return sessionService.postSession(url, localOptions, localTokenId);
  }).then(function(sessionId) {
    session = new sessionClass(localTokenId, sessionId, url, localOptions);
    let requestDefaults = {
      jar: true, // preserve cookies
      withCredentials: true // allow cross-origin cookies in browser deployments
    };
    if (typeof window === 'undefined') {
      requestDefaults.headers = {
        'Cookie': 'SID=' + session.sessionId
      };
    }
    if (localOptions.username != null && localOptions.password != null) {
      requestDefaults.auth = {
        'username': session.username,
        'password': session.password
      };
    } else if (localOptions.clientKey != null) {
      requestDefaults.key = options.clientKey;
      requestDefaults.cert = options.clientCert;
      requestDefaults.ca = options.caCert;
      requestDefaults.passphrase = options.passphrase;
    }
    session.baseGetRequest = Object.assign({ method: 'GET' }, requestDefaults);
    let delRequestDefaults = Object.assign({ method: 'DELETE' }, requestDefaults);
    if (typeof window === 'undefined') {
      delRequestDefaults.headers = {
        'Cookie': 'SID=' + session.sessionId + '; _csrf_token=' + session.tokenId
      };
    }
    session.baseDelRequest = delRequestDefaults;
    let postRequestDefaults = Object.assign({
      method: 'POST',
      json: {
        '_csrf_token': session.tokenId
      }
    }, requestDefaults);
    if (typeof window === 'undefined') {
      postRequestDefaults.headers = {
        'Cookie': 'SID=' + session.sessionId + '; _csrf_token=' + session.tokenId
      };
    }
    session.basePostRequest = postRequestDefaults;
    return version.getVersion(session);
  }).then(function(versionId) {
    session.versionId = versionId;
    return session;
  })
}

/**
 * Creates a vertex filter
 * @function createVertexFilter
 * @memberof module:pgx
 * @instance
 * @param {string} filterExpression - filter expression
 * @returns {module:classes/filters/vertexFilter} The vertex filter
 */
module.exports.createVertexFilter = function (filterExpression) {
  return new vertexFilter(filterExpression);
}

/**
 * Creates an edge filter
 * @function createEdgeFilter
 * @memberof module:pgx
 * @instance
 * @param {string} filterExpression - filter expression
 * @returns {module:classes/filters/edgeFilter} The edge filter
 */
module.exports.createEdgeFilter = function (filterExpression) {
  return new edgeFilter(filterExpression);
}

module.exports.util = util;