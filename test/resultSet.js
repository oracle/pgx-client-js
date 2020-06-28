'use strict'

const assert = require('assert');
const common = require('./common.js');
const pgx = common.pgx;

let p = null;
let localSession = null;
let localGraph = null;

before(function() {
  p = pgx.connect(common.baseUrl, common.options).then(function(session) {
    localSession = session;
    return session.readGraphWithProperties(common.graphJson);
  }).then(function(graph) {
    localGraph = graph;
    return graph.session.analyst.pagerank(graph, {name: 'pagerank'});
  }).then(function(property) {
    return property.graph.queryPgql("SELECT n, n.pagerank WHERE (n) ORDER BY n.pagerank");
  });
});

describe('resultSet', function () {
  it('should have resultSetId', function() {
    return p.then(function(resultSet) {
      assert(resultSet.resultSetId);
    });
  });

  it('numResults should have 10916 elements', function() {
    return p.then(function(resultSet) {
      assert.equal(10916, resultSet.numResults);
    });
  });

  it('resultElements should have 2 elements', function() {
    return p.then(function(resultSet) {
      assert.equal(2, resultSet.resultElements.length);
    });
  });

  it('resultElement 1 should be n', function() {
    return p.then(function(resultSet) {
      assert.equal('n', resultSet.resultElements[0].varName);
    });
  });

  it('resultElement 2 should be n.pagerank', function() {
    return p.then(function(resultSet) {
      assert.equal('n.pagerank', resultSet.resultElements[1].varName);
    });
  });

  it('getResults should have 4 elements', function() {
    return p.then(function(resultSet) {
      return resultSet.getResults();
    }).then(function(result) {
      assert.equal(2048, result.length);
    });
  });

  it('getResults in page 1 should have 2 elements', function() {
    return p.then(function(resultSet) {
      return resultSet.getResults(0, 2);
    }).then(function(result) {
      assert.equal(2, result.length);
    });
  });

  it('getResults in page 2 should have 2 elements', function() {
    return p.then(function(resultSet) {
      return resultSet.getResults(2, 2);
    }).then(function(result) {
      assert.equal(2, result.length);
    });
  });

  it('iterate row should have n and n.pagerank', function() {
    return p.then(function(resultSet) {
      return resultSet.iterate(function(row) {
        assert((typeof row['n'] === 'number') && (typeof row['n.pagerank'] === 'number'));
      });
    });
  });

  it('destroy should remove resultSet', function() {
    return p.then(function(resultSet) {
      return resultSet.destroy();
    }).then(function(result) {
      assert.equal(null, result);
    });
  });
});

after(function() {
  if(localGraph){
    localGraph.destroy().catch(function(e){
    });
  }

  if(localSession){
    localSession.destroy().catch(function(e){
    });
  }
});

