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
    return session.readGraphWithProperties(common.graphEdgeLabelJson);
  });
});

describe('graph', function () {
  it('transpose(options) renaming edge labels should return a graph', function() {
      return p.then(function(graph) {
        let transposeStrategy = {
          'vertexProperties': null,
          'edgePropNames': null,
          'inPlace': false,
          'edgeLabelMapping': {
            'labelEdge0': 'renamedEdge0',
            'labelEdge1': 'renamedEdge1'
          }
        };
        return graph.transpose(transposeStrategy);
      }).then(function(graph) {
        assert(graph.name.includes('sub-graph'));
        localGraph = graph;
        return localGraph.getEdge(0);
      }).then(function(edge) {
        return edge.label;
      }).then(function(label) {
        assert.equal("renamedEdge0", label);
        return localGraph.getEdge(1);
      }).then(function(edge) {
        return edge.label;
      }).then(function(label) {
        assert.equal("renamedEdge1", label);
        return localGraph.getEdge(2);
      }).then(function(edge) {
        return edge.label;
      }).then(function(label) {
        return assert.equal("labelEdge2", label);
      });
    });
});

after(function() {
  localSession.destroy().then(function(result) {
    p = null;
    localSession = null;
  });
});
