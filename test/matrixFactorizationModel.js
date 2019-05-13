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
    return graph.createVertexSet();
  }).then(function(collection) {
    return collection.addAll([333, 99]);
  }).then(function(collection) {
    return collection.graph.bipartiteSubGraphFromLeftSet(collection);
  }).then(function(bipartiteGraph) {
    return bipartiteGraph.session.analyst.matrixFactorizationGradientDescent(bipartiteGraph, {weight: 'cost'});
  });
});

describe('matrixFactorizationModel', function () {
  it('features is a property', function() {
    return p.then(function(matrixFactorizationModel) {
      assert((matrixFactorizationModel.features.name.startsWith('vertex_prop_double')) &&
        (matrixFactorizationModel.features.entityType === 'vertex'));
    });
  });
  it('rootMeanSquareError is a number', function() {
    return p.then(function(matrixFactorizationModel) {
      assert(typeof matrixFactorizationModel.rootMeanSquareError === 'number');
    });
  });
  it('getEstimatedRatings should have a property', function() {
    let localMatrixFactorizationModel = null;
    return p.then(function(matrixFactorizationModel) {
      localMatrixFactorizationModel = matrixFactorizationModel;
      return matrixFactorizationModel.graph.getVertex(333);
    }).then(function(vertex) {
      return localMatrixFactorizationModel.getEstimatedRatings(vertex);
    }).then(function(property) {
      assert((property.name.startsWith('vertex_prop_double')) && (property.entityType === 'vertex'));
    });
  });
});

after(function() {
  localSession.destroy().then(function(result) {
    p = null;
    localSession = null;
  });
});