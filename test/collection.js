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
    return graph.session.analyst.whomToFollow(graph, {vertex: 333});
  }).then(function(pair) {
    return pair.first;
  });
});

describe('collection', function () {
  it('should have a name', function() {
    return p.then(function(collection) {
      assert(collection.name.startsWith('vertex_collection_sequence'));
    });
  });
  it('should have idType', function() {
    return p.then(function(collection) {
      assert.equal('integer', collection.idType);
    });
  });
  it('should be a vertex sequence', function() {
    return p.then(function(collection) {
      assert((collection.elementType === 'vertex') && (collection.collectionType === 'sequence'));
    });
  });
  it('size should have 1 element', function() {
    return p.then(function(collection) {
      return collection.size();
    }).then(function(size) {
      assert.equal(1, size);
    });
  });
  it('removeAll should have 1 element', function() {
    return p.then(function(collection) {
      return collection.removeAll([333]);
    }).then(function(collection) {
      return collection.size();
    }).then(function(size) {
      assert.equal(1, size);
    });
  });
  it('clear should have 0 elements', function() {
    return p.then(function(collection) {
      return collection.clear();
    }).then(function(collection) {
      return collection.size();
    }).then(function(size) {
      assert.equal(0, size);
    });
  });
  it('add should have 1 element', function() {
    return p.then(function(collection) {
      return collection.add(128);
    }).then(function(collection) {
      return collection.size();
    }).then(function(size) {
      assert.equal(1, size);
    });
  });
  it('contains(128) should be true', function() {
    return p.then(function(collection) {
      return collection.contains(128);
    }).then(function(result) {
      assert.equal(result, true);
    });
  });
  it('contains(99) should be false', function() {
    return p.then(function(collection) {
      return collection.contains(99);
    }).then(function(result) {
      assert.equal(result, false);
    });
  });
  it('addAll should have 4 elements', function() {
    return p.then(function(collection) {
      return collection.addAll([333, 99, 1908]);
    }).then(function(collection) {
      return collection.size();
    }).then(function(size) {
      assert.equal(4, size);
    });
  });
  it('getResults should have 4 elements', function() {
    return p.then(function(collection) {
      return collection.getResults();
    }).then(function(result) {
      assert.equal(4, result.length);
    });
  });
  it('getResults should includes [128, 333, 99, 1908]', function() {
    return p.then(function(collection) {
      return collection.getResults();
    }).then(function(result) {
      result.forEach(function(row) {
        assert([128, 333, 99, 1908].indexOf(row.id) > -1);
      });
    });
  });
  it('getResults in page 1 should have 2 elements', function() {
    return p.then(function(collection) {
      return collection.getResults(0, 2);
    }).then(function(result) {
      assert.equal(2, result.length);
    });
  });
  it('getResults in page 2 should have 2 elements', function() {
    return p.then(function(collection) {
      return collection.getResults(2, 2);
    }).then(function(result) {
      assert.equal(2, result.length);
    });
  });
  it('iterate row should be a Vertex', function() {
    return p.then(function(collection) {
      return collection.iterate(function(row) {
        assert(([128, 333, 99, 1908].indexOf(row.id) > -1) && (row.type === 'integer'));
      });
    });
  });
  it('clone should have a collection', function() {
    return p.then(function(collection) {
      return collection.clone();
    }).then(function(collection) {
      assert(collection.name.startsWith('vertex_collection_sequence'));
    });
  });
  it('destroy should remove collection', function() {
    return p.then(function(collection) {
      return collection.destroy();
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