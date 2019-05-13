'use strict'

const assert = require('assert');
const common = require('./common.js');
const pgx = common.pgx;

let p = null;
let localSession = null;

before(function() {
  p = pgx.connect(common.baseUrl, common.options).then(function(session) {
    localSession = session;
    return session.readGraphWithProperties(common.graphJson);
  }).then(function(graph) {
    return graph.getEdge(1);
  });
});

describe('edge', function () {
  it('should have an id', function() {
    return p.then(function(edge) {
      assert.equal(1, edge.id);
    });
  });
  it('should have type', function() {
    return p.then(function(edge) {
      assert(edge.type);
    });
  });
  it('should have graph', function() {
    return p.then(function(edge) {
      assert(edge.graph.name);
    });
  });
  it('should have source vertex', function() {
    return p.then(function(edge) {
      return edge.source;
    }).then(function(vertex) {
      assert(vertex.id === '128')
    });
  });
  it('should have destination vertex', function() {
    return p.then(function(edge) {
      return edge.destination;
    }).then(function(vertex) {
      assert(vertex.id === '1908')
    });
  });
  it('getProperty should be 27.03', function() {
    return p.then(function(edge) {
      return edge.getProperty('cost');
    }).then(function(result) {
      assert.equal(27.03, result)
    });
  });
  it('setProperty should be 10', function() {
    return p.then(function(edge) {
      return edge.graph.clone();
    }).then(function(graph) {
      return graph.getEdge(0)
    }).then(function(edge) {
      return edge.setProperty('cost', 10);
    }).then(function(result) {
      assert.equal(10, result)
    });
  });
});

after(function() {
  localSession.destroy().then(function(result) {
    p = null;
    localSession = null;
  });
});