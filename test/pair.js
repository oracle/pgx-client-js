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
    return graph.session.analyst.hits(graph);
  });
});

describe('pair', function () {
  it('first should have a Property', function() {
    return p.then(function(pair) {
      assert((pair.first.name.startsWith('vertex_prop_double')) && (pair.first.entityType === 'vertex'));
    });
  });
  it('second should have a Property', function() {
    return p.then(function(pair) {
      assert((pair.second.name.startsWith('vertex_prop_double')) && (pair.second.entityType === 'vertex'));
    });
  });
});

after(function() {
  localSession.destroy().then(function(result) {
    p = null;
    localSession = null;
  });
});