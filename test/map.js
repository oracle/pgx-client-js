'use strict'

const assert = require('assert');
const common = require('./common.js');
const algorithmHelper = require(`${common.pgxDir}/helpers/algorithm.js`);
const pgx = common.pgx;

let p = null;
let localSession = null;

before(function() {
  p = pgx.connect(common.baseUrl, common.options).then(function(session) {
    localSession = session;
    return session.readGraphWithProperties(common.graphJson);
  }).then(function(graph) {
    return graph.session.analyst.degreeDistribution(graph, {degree: algorithmHelper.degreeDistributionVariant.OUT});
  })
});

describe('map', function () {
  it('should have a name', function() {
    return p.then(function(map) {
      assert(map.name);
    });
  });
  it('should have keyType', function() {
    return p.then(function(map) {
      assert(map.keyType);
    });
  });
  it('should have valType', function() {
    return p.then(function(map) {
      assert(map.valType);
    });
  });
  it('containsKey should be true', function() {
    return p.then(function(map) {
      return map.containsKey(0);
    }).then(function(result) {
      assert.equal(true, result);
    });
  });
  it('should have 3 entries', function() {
    return p.then(function(map) {
      return map.entries();
    }).then(function(entries) {
      assert.equal(3, entries.length);
    });
  });
  it('entries in page 1 should have 2 elements', function() {
    return p.then(function(map) {
      return map.entries(0, 2);
    }).then(function(entries) {
      assert(entries.length === 2);
    });
  });
  it('entries in page 2 should have 1 element', function() {
    return p.then(function(map) {
      return map.entries(2, 1);
    }).then(function(entries) {
      assert(entries.length === 1);
    });
  });
  it('iterateEntries row should have key and value', function() {
    return p.then(function(map) {
      return map.iterateEntries(function(row) {
        assert((typeof row.key === 'number') && (typeof row.value === 'number'));
      });
    });
  });
  it('iterate(cb, \'entries\') row should have key and value', function() {
    return p.then(function(map) {
      return map.iterate(function(row) {
        assert((typeof row.key === 'number') && (typeof row.value === 'number'));
      }, 'entries');
    });
  });
  it('get(1) should be equal to value 2', function() {
    return p.then(function(map) {
      return map.get(1);
    }).then(function(result) {
      assert.equal(2, result);
    });
  });
  it('keys should be equal 0,2,1', function() {
    return p.then(function(map) {
      return map.keys();
    }).then(function(keys) {
      assert.equal('0,2,1', keys);
    });
  });
  it('keys in page 1 should have 2 elements', function() {
    return p.then(function(map) {
      return map.keys(0, 2);
    }).then(function(keys) {
      assert(keys.length === 2);
    });
  });
  it('keys in page 2 should have 1 element', function() {
    return p.then(function(map) {
      return map.keys(2, 1);
    }).then(function(keys) {
      assert(keys.length === 1);
    });
  });
  it('iterateKeys row should be one of 0,2,1', function() {
    return p.then(function(map) {
      return map.iterateKeys(function(row) {
        assert([0, 2, 1].indexOf(row) > -1);
      });
    });
  });
  it('iterate(cb, \'Keys\') row should be one of 0,2,1', function() {
    return p.then(function(map) {
      return map.iterate(function(row) {
        assert([0, 2, 1].indexOf(row) > -1);
      }, 'keys');
    });
  });
  it('should remove item 0', function() {
    return p.then(function(map) {
      return map.remove(0);
    }).then(function(map) {
      return map.get(0);
    }).then(function(result) {
      assert.equal(null, result);
    });
  });
  it('set should be 4', function() {
    return p.then(function(map) {
      return map.set(3,4);
    }).then(function(map) {
      return map.get(3);
    }).then(function(result) {
      assert.equal(4, result);
    });
  });
  it('destroy should remove map', function() {
    return p.then(function(map) {
      return map.destroy().then(function(result) {
        assert.equal(null, result);
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