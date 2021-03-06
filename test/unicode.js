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
  });
});

describe('unicode', function () {
  it('map should set unicode characters', function() {
    return p.then(function(graph) {
      return graph.createMap('string', 'string');
    }).then(function(map) {
      return map.set('¢£¤', '¥¦§¨©');
    }).then(function(map) {
      return map.get('¢£¤');
    }).then(function(result) {
      assert(result === '¥¦§¨©');
    });
  });
  it('property should fill unicode characters', function() {
    return p.then(function(graph) {
      return graph.createVertexProperty('string');
    }).then(function(property) {
      return property.fill('¥¦§¨©');
    }).then(function(property) {
      return property.iterateValues(function(row) {
        assert(row.value === '¥¦§¨©');
      });
    });
  });
  it('property should set unicode characters', function() {
    return p.then(function(graph) {
      return graph.createVertexProperty('string');
    }).then(function(property) {
      return property.set(128, '¥¦§¨©');
    }).then(function(property) {
      return property.get(128);
    }).then(function(result) {
      assert(result === '¥¦§¨©');
    });
  });
  it('scalar should set unicode characters', function() {
    return p.then(function(graph) {
      return graph.createScalar('string');
    }).then(function(scalar) {
      return scalar.set('¥¦§¨©');
    }).then(function(scalar) {
      return scalar.get();
    }).then(function(result) {
      assert(result === '¥¦§¨©');
    });
  });
});

after(function() {
  localSession.destroy().then(function(result) {
    p = null;
    localSession = null;
  });
});