'use strict'

const assert = require('assert');
const common = require('./common.js');
const vertexClass = require(`${common.pgxDir}/classes/vertex.js`);
const pgx = common.pgx;

let p = null;
let localSession = null;

before(function() {
  p = pgx.connect(common.baseUrl, common.options).then(function(session) {
    localSession = session;
    return session.readGraphWithProperties(common.graphJson);
  }).then(function(graph) {
    return graph.getVertex(128);
  });
});

describe('vertex', function () {
  it('should have an id', function() {
    return p.then(function(vertex) {
      assert(vertex.id);
    });
  });
  it('should have type', function() {
    return p.then(function(vertex) {
      assert(vertex.type);
    });
  });
  it('inEdges should have 1 element', function() {
    return p.then(function(vertex) {
      return vertex.inEdges;
    }).then(function(result) {
      assert.equal(1, result.length);
    });
  });
  it('inNeighbors should have 1 element', function() {
    return p.then(function(vertex) {
      return vertex.inNeighbors;
    }).then(function(result) {
      assert.equal(1, result.length);
    });
  });
  it('outEdges should have 2 elements', function() {
    return p.then(function(vertex) {
      return vertex.outEdges;
    }).then(function(result) {
      assert.equal(2, result.length);
    });
  });
  it('outNeighbors should have 2 element2', function() {
    return p.then(function(vertex) {
      return vertex.outNeighbors;
    }).then(function(result) {
      assert.equal(2, result.length);
    });
  });
  it('getProperty should be 10', function() {
    return p.then(function(vertex) {
      return vertex.getProperty('prop1');
    }).then(function(result) {
      assert.equal(10, result)
    });
  });
  it('setProperty should be 20', function() {
    return p.then(function(vertex) {
      return vertex.graph.clone();
    }).then(function(graph) {
      return graph.getVertex(128)
    }).then(function(vertex) {
      return vertex.setProperty('prop1', 20);
    }).then(function(result) {
      assert.equal(20, result)
    });
  });
  it('isNil should be false', function() {
    return p.then(function(vertex) {
      assert.equal(false, vertex.isNil());
    });
  });
  it('isNil should be true', function() {
    return p.then(function(vertex) {
      return new vertexClass(null, vertex.graph);
    }).then(function(newVertex) {
      assert.equal(true, newVertex.isNil());
    });
  });
});

after(function() {
  localSession.destroy().then(function(result) {
    p = null;
    localSession = null;
  });
});