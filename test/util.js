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

describe('util', function () {
  it('iterateOverComponentCollections row should be a vertex', function() {
    return p.then(function(partition) {
      let coll = [];
      for (var idx = 0; idx < partition.size(); idx++) {
        coll.push(partition.getPartitionByIndex(idx));
      };
      return pgx.util.iterateOverComponentCollections(coll, function(row) {
        assert([128, 333, 99, 1908].indexOf(row.id) > -1);
        assert(row.type === 'integer');
        assert([0, 1].indexOf(row.partitionIndex) > -1);
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