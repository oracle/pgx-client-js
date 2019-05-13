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
    return graph.session.analyst.shortestPathDijkstra(graph, {
      src: 128,
      dst: 333,
      cost: 'cost',
      variant: algorithmHelper.dijkstraVariant.CLASSICAL
    });
  })
});

describe('path', function () {
  it('source is 128', function() {
    return p.then(function(path) {
      assert.equal(128, path.source);
    });
  });
  it('destination is 333', function() {
    return p.then(function(path) {
      assert.equal(333, path.destination);
    });
  });
  it('pathLengthWithCost is 346.51', function() {
    return p.then(function(path) {
      assert.equal(346.51, path.pathLengthWithCost);
    });
  });
  it('pathLengthWithHop is 2', function() {
    return p.then(function(path) {
      assert.equal(2, path.pathLengthWithHop);
    });
  });
  it('vertices is [128,99,333]', function() {
    return p.then(function(path) {
      assert.equal('[128,99,333]', path.vertices);
    });
  });
  it('edges is [2,0]', function() {
    return p.then(function(path) {
      assert.equal('[2,0]', path.edges);
    });
  });
  it('existsField is true', function() {
    return p.then(function(path) {
      assert.equal(true, path.existsField);
    });
  });
  it('exists() is true', function() {
    return p.then(function(path) {
      assert.equal(true, path.exists());
    });
  });
});

after(function() {
  localSession.destroy().then(function(result) {
    p = null;
    localSession = null;
  });
});