'use strict'

const assert = require('assert');
const common = require('./common.js');
const pgx = common.pgx;

let p = null;
let localSession = null;
let prop1;
let prop2;
let prop3;

before(function() {
  p = pgx.connect(common.baseUrl, common.options).then(function(session) {
    localSession = session;
    return session.readGraphWithProperties(common.graphJson);
  });
});

describe('resultSet data types', function () {
  it('queryPgql(local_date, time, timestamp) should have 0 values', function() {
    return p.then(function(graph) {
      return graph.createVertexProperty('local_date');
    }).then(function(property) {
      prop1 = property;
      return prop1.graph.createVertexProperty('time');
    }).then(function(property) {
      prop2 = property;
      return prop2.graph.createVertexProperty('timestamp');
    }).then(function(property) {
      prop3 = property;
      return prop3.graph.queryPgql("SELECT n, n." + prop1.name + ", n." + prop2.name + ", n." + prop3.name + " WHERE (n)");
    }).then(function(resultSet) {
      return resultSet.getResults();
    }).then(function(result) {
      result.forEach(function(row) {
        assert.equal(row['n.' + prop1.name], 0);
        assert.equal(row['n.' + prop2.name], 0);
        assert.equal(row['n.' + prop3.name], 0);
      });
    });
  });
  it('queryPgql(time_with_timezone, timestamp_with_timezone) should have 0:0 values', function() {
    return p.then(function(graph) {
      return graph.createVertexProperty('time_with_timezone');
    }).then(function(property) {
      prop1 = property;
      return prop1.graph.createVertexProperty('timestamp_with_timezone');
    }).then(function(property) {
      prop2 = property;
      return prop2.graph.queryPgql("SELECT n, n." + prop1.name + ", n." + prop2.name + " WHERE (n)");
    }).then(function(resultSet) {
      return resultSet.getResults();
    }).then(function(result) {
      result.forEach(function(row) {
        assert.equal(row['n.' + prop1.name], "0:0");
        assert.equal(row['n.' + prop2.name], "0:0");
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