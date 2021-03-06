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
    return graph.createVertexVectorProperty("integer", 10);
  });
});

describe('vector property', function () {
  it('should have a name', function() {
    return p.then(function(property) {
      assert(property.name);
    });
  });
  it('entityType should be vertex', function() {
    return p.then(function(property) {
      assert(property.entityType === 'vertex');
    });
  });
  it('should have transient', function() {
    return p.then(function(property) {
      assert(property.transient);
    });
  });
  it('type should be integer', function() {
    return p.then(function(property) {
      assert(property.type === 'integer');
    });
  });
  it('dimension should be 10', function() {
    return p.then(function(property) {
      assert.equal(10, property.dimension);
    });
  });
  it('get should have an array of numbers', function() {
    return p.then(function(property) {
      return property.get(128);
    }).then(function(result) {
      assert(Array.isArray(result) && (typeof result[0] === 'number'));
    });
  });
  it('getValues should have 4 elements', function() {
    return p.then(function(property) {
      return property.getValues();
    }).then(function(result) {
      assert.equal(4, result.length);
    });
  });
  it('getValues should includes [128, 1908, 99, 333] as key', function() {
    return p.then(function(property) {
      return property.getValues();
    }).then(function(result) {
      result.forEach(function(row) {
          assert([128, 1908, 99, 333].indexOf(row.key) > -1);
      });
    });
  });
  it('getValues should includes array of numbers as value', function() {
    return p.then(function(property) {
      return property.getValues();
    }).then(function(result) {
      result.forEach(function(row) {
          assert(Array.isArray(row.value) && (typeof row.value[0] === 'number'));
      });
    });
  });
  it('iterateValues row should have key and value', function() {
    return p.then(function(property) {
      return property.iterateValues(function(row) {
        assert((typeof row.key === 'number') && (Array.isArray(row.value)) && (typeof row.value[0] === 'number'));
      });
    });
  });
  it('size should be 4', function() {
    return p.then(function(property) {
      return property.size();
    }).then(function(size) {
      assert.equal(4, size);
    });
  });
  it('fill should set all values', function() {
    return p.then(function(property) {
      return property.fill([10,10,10,10,10,10,10,10,10,10]);
    }).then(function(property) {
      return property.getValues();
    }).then(function(result) {
      result.forEach(function(row) {
        assert((typeof row.key === 'number') && (Array.isArray(row.value)) && (row.value[0] === 10));
      });
    });
  });
  it('set should have a value', function() {
    return p.then(function(property) {
      return property.set(128, [10,10,10,10,10,10,10,10,10,10]);
    }).then(function(property) {
      return property.get(128);
    }).then(function(result) {
      result.forEach(function(row) {
        assert(row === 10);
      });
    });
  });
  it('setValues should have a value', function() {
    let map = new Map();
    map.set(128, [10,10,10,10,10,10,10,10,10,10]);
    map.set(333, [30,30,30,30,30,30,30,30,30,30]);
    return p.then(function(property) {
      return property.setValues(map);
    }).then(function(property) {
      return property.getValues();
    }).then(function(result) {
      result.forEach(function(row) {
        if (row.key === 128) {
          assert.equal(10, row.value[0]);
        } else if (row.key === 333) {
          assert.equal(30, row.value[0]);
        }
      });
    });
  });
  it('destroy should remove property', function() {
    return p.then(function(property) {
      return property.destroy();
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