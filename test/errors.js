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
  });
});

describe('error handling', function () {
  it('connect should get an Error - 1', function() {
    let localBaseUrl = common.baseUrl.replace("/pgx", "");
    return pgx.connect(localBaseUrl, common.options).then(function(session) {
      throw new Error('was not supposed to succeed.');
    }).catch(function(error) {
      assert(error.message.indexOf('could not connect') > -1);
    });
  });
  it('connect should get an Error - 2', function() {
    return pgx.connect('https://localhost:05', common.options).then(function(session) {
      throw new Error('was not supposed to succeed.');
    }).catch(function(error) {
      assert(error.message.indexOf('ECONNREFUSED') > -1);
    });
  });
  it('session.readGraphWithProperties should get an Error', function() {
    return pgx.connect(common.baseUrl, common.options).then(function(session) {
      return session.readGraphWithProperties(common.graphJson + 'badReq');
    }).then(function(graph) {
      throw new Error('was not supposed to succeed.');
    }).catch(function(error) {
      assert(error.message.indexOf('Unexpected token') > -1);
    });
  });
  it('closenessCentralityDoubleLength should get an Error', function() {
    return p.then(function(graph) {
      return graph.session.analyst.closenessCentrality(graph, {
        variant: algorithmHelper.closenessCentralityVariant.WEIGHTED,
        cost: 'cost1'
      });
    }).then(function(property) {
      throw new Error('was not supposed to succeed.');
    }).catch(function(error) {
      assert(error.message.indexOf('no edge property') > -1);
    });
  });
  it('shortestPathDijkstra should get an Error', function() {
    return p.then(function(graph) {
      return graph.session.analyst.shortestPathDijkstra(graph, {
        src: 1281,
        dst: 333,
        cost: 'cost',
        variant: algorithmHelper.dijkstraVariant.CLASSICAL
      });
    }).then(function(path) {
      throw new Error('was not supposed to succeed.');
    }).catch(function(error) {
      assert(error.message.indexOf('no vertex ID') > -1);
    });
  });
  it('fattestPath should get an Error', function() {
    return p.then(function(graph) {
      return graph.session.analyst.fattestPath(graph);
    }).then(function(allPaths) {
      throw new Error('was not supposed to succeed.');
    }).catch(function(error) {
      assert(error.message.indexOf('no edge property') > -1);
    });
  });
  it('allPaths.getPath should get an Error', function() {
    return p.then(function(graph) {
      return graph.session.analyst.fattestPath(graph, {root: 128, capacity: 'cost'});
    }).then(function(allPaths) {
      return allPaths.getPath(3331);
    }).then(function(path) {
      throw new Error('was not supposed to succeed.');
    }).catch(function(error) {
      assert(error.message.indexOf('no vertex ID') > -1);
    });
  });
  it('graph.queryPgql should get an Error', function() {
    return p.then(function(graph) {
      return graph.queryPgql('SELECT n1 WHERE (n)')
    }).then(function(resultSet) {
      throw new Error('was not supposed to succeed.');
    }).catch(function(error) {
      assert(error.message.indexOf('Unresolved variable') > -1);
    });
  });
  it('graph.destroy should get an Error', function() {
    return p.then(function(graph) {
      graph.name = 'graphError';
      return graph.destroy();
    }).then(function(result) {
      throw new Error('was not supposed to succeed.');
    }).catch(function(error) {
      assert(error.message.indexOf('no graph named') > -1);
    });
  });
  it('session.destroy should get an Error', function() {
    localSession.tokenId = '05';
    return localSession.destroy().then(function(result) {
      throw new Error('was not supposed to succeed.');
    }).catch(function(error) {
      assert(error.message.indexOf('request does not contain') > -1);
    });
  });
});

after(function() {
  localSession.destroy().then(function(result) {
    p = null;
    localSession = null;
  });
});
