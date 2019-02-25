'use strict'

// services
const core = require('../services/core.js');
const sessionService = require('../services/session.js');

// classes
const analyst = require('../classes/analyst.js');
const graphClass = require('../classes/graph.js');

/**
 * A PGX session
 * @module classes/session
 */
module.exports = class Session {

  /**
   * Creates a session
   * @param {string} tokenId - token id
   * @param {string} sessionId - session id
   * @param {string} baseUrl - base url
   * @param {object} options - session options
   */
  constructor(tokenId, sessionId, baseUrl, options) {
    this.tokenId = tokenId;
    this.sessionId = sessionId;
    this.baseUrl = baseUrl;
    this.username = options.username;
    this.password = options.password;
    this.clientKey = options.clientKey;
    this.clientCert = options.clientCert;
    this.caCert = options.caCert;
    this.passphrase = options.passphrase;
    this.prefetchSize = options.prefetchSize != null ? options.prefetchSize : 2048;
    this.uploadBatchSize = options.uploadBatchSize != null ? options.uploadBatchSize : 65536;
    this.remoteFutureTimeout = options.remoteFutureTimeout != null ? options.remoteFutureTimeout : 300000;
    this.remoteFuturePendingRetryInterval = options.remoteFuturePendingRetryInterval != null ?
      options.remoteFuturePendingRetryInterval : 500;
    this.analyst = new analyst();
  }

  /**
   * Reads a graph and its properties
   * @function readGraphWithProperties
   * @memberof module:classes/session
   * @instance
   * @param {object} jsonContent - the graph config
   * @returns {module:classes/graph} a graph
   */
  readGraphWithProperties(jsonContent) {
    return core.readGraphWithProperties(this, jsonContent);
  }

  /**
   * Gets an already loaded graph by its name
   * @function getGraph
   * @memberof module:classes/session
   * @instance
   * @returns {module:classes/graph} resulting graph
   */
  getGraph(name) {
    let self = this;
    return core.getGraph(self, name).then(function(result) {
      return new graphClass(result, self);
    });
  }

  /**
   * Returns an array of graphs loaded in this session
   * @function getGraphs
   * @memberof module:classes/session
   * @instance
   * @returns {module:classes/graph[]} array of graphs
   */
  getGraphs() {
    let self = this;
    return core.getGraphs(self).then(function(result) {
      let collection = [];
      for(var i=0; i<result.length; i++) {
        collection.push(new graphClass(result[i], self));
      }
      return collection;
    });
  }

  /**
   * Destroy a session
   * @function destroy
   * @memberof module:classes/session
   * @instance
   * @returns {null} null
   */
  destroy() {
    return sessionService.delSession(this);
  }

}