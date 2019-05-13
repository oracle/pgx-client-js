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
    return graph.session.analyst.scc(graph);
  })
});

describe('partition', function () {
  it('should have proxyId', function() {
    return p.then(function(partition) {
      assert(partition.proxyId);
    });
  });
  it('should have sizeField', function() {
    return p.then(function(partition) {
      assert(partition.sizeField);
    });
  });
  it('should have propertyName', function() {
    return p.then(function(partition) {
      assert(partition.propertyName);
    });
  });
  it('should have componentNamespace', function() {
    return p.then(function(partition) {
      assert(partition.componentNamespace);
    });
  });
  it('getPartitionByIndex should be a vertexSet', function() {
    return p.then(function(partition) {
      return partition.getPartitionByIndex(0);
    }).then(function(collection) {
      assert((collection.elementType === 'vertex') && (collection.collectionType === 'set'));
    });
  });
  it('getPartitionIndexOfVertex should be 0', function() {
    return p.then(function(partition) {
      return partition.getPartitionIndexOfVertex(128);
    }).then(function(index) {
      assert.equal(0, index);
    });
  });
  it('getPartitionByVertex should be a vertexSet', function() {
    return p.then(function(partition) {
      return partition.getPartitionByVertex(128);
    }).then(function(collection) {
      assert((collection.elementType === 'vertex') && (collection.collectionType === 'set'));
    });
  });
  it('getResults should have 2 elements', function() {
    return p.then(function(partition) {
      return partition.getResults();
    }).then(function(result) {
      assert.equal(2, result.length);
    });
  });
  it('getResults in page 1 should have 1 element', function() {
    return p.then(function(partition) {
      return partition.getResults(0, 1);
    }).then(function(result) {
      assert(result[0].componentNamespace.startsWith('compproxy_') && result.length === 1);
    });
  });
  it('getResults in page 2 should have 1 element', function() {
    return p.then(function(partition) {
      return partition.getResults(1, 1);
    }).then(function(result) {
      assert(result[0].componentNamespace.startsWith('compproxy_') && result.length === 1);
    });
  });
  it('iterate row should be a componentCollection', function() {
    return p.then(function(partition) {
      return partition.iterate(function(collection) {
        assert((collection.elementType === 'vertex') && (collection.collectionType === 'set') &&
          collection.componentNamespace.startsWith('compproxy_'));
      });
    });
  });
  it('size should be 2', function() {
    return p.then(function(partition) {
      assert.equal(2, partition.size());
    });
  });
  it('destroy should remove partition', function() {
    return p.then(function(partition) {
      return partition.destroy();
    }).then(function(result) {
      assert.equal(null, result);
    });
  });
});

after(function() {
  localSession.destroy().then(function(result) {
    p = null;
    localSession = null;
  });
});