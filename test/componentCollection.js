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
    return graph.session.analyst.communities(graph);
  }).then(function(partition) {
    return partition.getPartitionByIndex(0);
  });
});

describe('componentCollection', function () {
  it('should have componentNamespace', function() {
    return p.then(function(componentCollection) {
      assert(componentCollection.componentNamespace.startsWith('compproxy_'));
    });
  });
  it('should have idType', function() {
    return p.then(function(componentCollection) {
      assert(componentCollection.idType === 'integer');
    });
  });
  it('should be a vertexSet', function() {
    return p.then(function(componentCollection) {
      assert((componentCollection.elementType === 'vertex') && (componentCollection.collectionType === 'set'));
    });
  });
  it('should have index', function() {
    return p.then(function(componentCollection) {
      assert(componentCollection.index === 0);
    });
  });
  it('size should be 3', function() {
    return p.then(function(componentCollection) {
      return componentCollection.size();
    }).then(function(size) {
      assert.equal(3, size);
    });
  });
  it('getResults should have 3 elements', function() {
    return p.then(function(componentCollection) {
      return componentCollection.getResults();
    }).then(function(result) {
      assert.equal(3, result.length);
    });
  });
  it('getResults in page 1 should have 2 elements', function() {
    return p.then(function(componentCollection) {
      return componentCollection.getResults(0, 2);
    }).then(function(result) {
      assert.equal(2, result.length);
    });
  });
  it('getResults in page 2 should have 1 element', function() {
    return p.then(function(componentCollection) {
      return componentCollection.getResults(2, 2);
    }).then(function(result) {
      assert.equal(1, result.length);
    });
  });
  it('iterate row should be a vertex', function() {
    return p.then(function(componentCollection) {
      return componentCollection.iterate(function(row) {
        assert([128, 333, 99].indexOf(row.id) > -1);
        assert(row.type === 'integer');
        assert(row.partitionIndex === 0);
      });
    });
  });
});

after(function() {
  localSession.destroy().then(function(result) {
    p = null;
    localSession = null;
  });
});