'use strict'

const assert = require('assert');
const common = require('./common.js');
const pgx = common.pgx;

let p = {};
let localSession = null;

before(function() {
  p = pgx.connect(common.baseUrl, common.options).then(function(session){
    localSession = session;
    return session;
  });
});

describe('session', function () {
  it('should have tokenId', function() {
    return p.then(function(session) {
      assert(session.tokenId);
    });
  });

  it('should have sessionId', function() {
    return p.then(function(session) {
      assert(session.sessionId);
    });
  });

  it('should have versionId', function() {
    return p.then(function(session) {
      assert(session.versionId);
    });
  });

  it('readGraphWithProperties should have a graph', function() {
    return p.then(function(session) {
      return session.readGraphWithProperties(common.graphJson);
    }).then(function(graph) {
      assert(graph.name && graph.numVertices);
    });
  });

  it('getGraph should have a graph', function() {
    let graphName;
    return p.then(function(session) {
      return session.readGraphWithProperties(common.graphJson);
    }).then(function(graph) {
      graphName = graph.name;
      return graph.session;
    }).then(function(session) {
      return session.getGraph(graphName);
    }).then(function(graph) {
      assert.equal(graph.name, graphName);
    });
  });

  it('getGraphs should be equal to number of available graphs', function() {
    return p.then(function(session) {
      return session.getGraphs();
    }).then(function(result) {
      assert(result.length > 0);
    });
  });

  it('destroy should remove session', function() {
    return p.then(function(session) {
      return session.destroy();
    }).then(function(result) {
      assert.equal(null, result);
    });
  });
});

after(function() {
  localSession = null;
  p = null;
});
