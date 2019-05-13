'use strict'

const assert = require('assert');
const common = require('./common.js');
const algorithmHelper = require(`${common.pgxDir}/helpers/algorithm.js`);
const pgx = common.pgx;

let p = null;
let vf = null;
let localSession = null;
let v1, v2, e1;

before(function(done) {
  p = pgx.connect(common.baseUrl, common.options).then(function(session) {
    localSession = session;
    return session.readGraphWithProperties(common.graphJson);
  }).then(function(graph) {
    return graph.getVertex(128);
  }).then(function(vertex) {
    v1 = vertex;
    return vertex.graph.getVertex(333);
  }).then(function(vertex) {
    v2 = vertex;
    return vertex.graph.getEdgeProperty('cost');
  }).then(function(property) {
    e1 = property;
    done();
    return property.graph;
  }).catch(function(err) {
     done(err);
  });
  vf = pgx.createVertexFilter('true');
});

describe('algorithms', function () {
  it('closenessCentralityUnitLength with default should return a Property', function() {
    return p.then(function(graph) {
      return graph.session.analyst.closenessCentrality(graph);
    }).then(function(property) {
      assert((property.name.startsWith('vertex_prop_double')) && (property.entityType === 'vertex'));
    });
  });
  it('closenessCentralityUnitLength with name should return a Property', function() {
    return p.then(function(graph) {
      return graph.session.analyst.closenessCentrality(graph, {
        variant: algorithmHelper.closenessCentralityVariant.DEFAULT,
        name: 'closenessCentralityUnitLength'
      });
    }).then(function(property) {
      assert((property.name === 'closenessCentralityUnitLength') && (property.entityType === 'vertex'));
    });
  });
  it('closenessCentralityUnitLength with cc should return a Property', function() {
    return p.then(function(graph) {
      return graph.getVertexProperty('closenessCentralityUnitLength');
    }).then(function(property) {
      return property.graph.session.analyst.closenessCentrality(property.graph, {
        variant: algorithmHelper.closenessCentralityVariant.DEFAULT,
        cc: property
      });
    }).then(function(property) {
      assert((property.name === 'closenessCentralityUnitLength') && (property.entityType === 'vertex'));
    });
  });
  it('closenessCentralityDoubleLength with name should return a Property', function() {
    return p.then(function(graph) {
      return graph.session.analyst.closenessCentrality(graph, {
        variant: algorithmHelper.closenessCentralityVariant.WEIGHTED,
        cost: 'cost'
      });
    }).then(function(property) {
      assert((property.name.startsWith('vertex_prop_double')) && (property.entityType === 'vertex'));
    });
  });
  it('closenessCentralityDoubleLength with prop using default should return a Property', function() {
    return p.then(function(graph) {
      return graph.session.analyst.closenessCentrality(graph, {
        variant: algorithmHelper.closenessCentralityVariant.WEIGHTED,
        cost: e1
      });
    }).then(function(property) {
      assert((property.name.startsWith('vertex_prop_double')) && (property.entityType === 'vertex'));
    });
  });
  it('closenessCentralityDoubleLength with prop using name should return a Property', function() {
    return p.then(function(graph) {
      return graph.session.analyst.closenessCentrality(graph, {
        name: 'closenessCentralityDoubleLength',
        variant: algorithmHelper.closenessCentralityVariant.WEIGHTED,
        cost: e1
      });
    }).then(function(property) {
      assert((property.name === 'closenessCentralityDoubleLength') && (property.entityType === 'vertex'));
    });
  });
  it('closenessCentralityDoubleLength with prop using cc should return a Property', function() {
    return p.then(function(graph) {
      return graph.getVertexProperty('closenessCentralityDoubleLength');
    }).then(function(property) {
      return property.graph.session.analyst.closenessCentrality(property.graph, {
        cc: property,
        variant: algorithmHelper.closenessCentralityVariant.WEIGHTED,
        cost: e1
      });
    }).then(function(property) {
      assert((property.name === 'closenessCentralityDoubleLength') && (property.entityType === 'vertex'));
    });
  });
  it('degreeCentrality with default should return a Property', function() {
    return p.then(function(graph) {
      return graph.session.analyst.degreeCentrality(graph);
    }).then(function(property) {
      assert((property.name.startsWith('vertex_prop_integer')) && (property.entityType === 'vertex'));
    });
  });
  it('degreeCentrality with name should return a Property', function() {
    return p.then(function(graph) {
      return graph.session.analyst.degreeCentrality(graph, {
        direction: algorithmHelper.degreeCentralityVariant.BOTH,
        name: 'degreeCentrality'
      });
    }).then(function(property) {
      assert((property.name === 'degreeCentrality') && (property.entityType === 'vertex'));
    });
  });
  it('degreeCentrality with dc should return a Property', function() {
    return p.then(function(graph) {
      return graph.getVertexProperty('degreeCentrality');
    }).then(function(property) {
      return property.graph.session.analyst.degreeCentrality(property.graph, {
        direction: algorithmHelper.degreeCentralityVariant.BOTH,
        dc: property
      });
    }).then(function(property) {
      assert((property.name === 'degreeCentrality') && (property.entityType === 'vertex'));
    });
  });
  it('outDegreeCentrality with default should return a Property', function() {
    return p.then(function(graph) {
      return graph.session.analyst.degreeCentrality(graph, {direction: algorithmHelper.degreeCentralityVariant.OUT});
    }).then(function(property) {
      assert((property.name.startsWith('vertex_prop_integer')) && (property.entityType === 'vertex'));
    });
  });
  it('outDegreeCentrality with name should return a Property', function() {
    return p.then(function(graph) {
      return graph.session.analyst.degreeCentrality(graph, {
        direction: algorithmHelper.degreeCentralityVariant.OUT,
        name: 'outDegreeCentrality'
      });
    }).then(function(property) {
      assert((property.name === 'outDegreeCentrality') && (property.entityType === 'vertex'));
    });
  });
  it('outDegreeCentrality with dc should return a Property', function() {
    return p.then(function(graph) {
      return graph.getVertexProperty('outDegreeCentrality');
    }).then(function(property) {
      return property.graph.session.analyst.degreeCentrality(property.graph, {
        direction: algorithmHelper.degreeCentralityVariant.OUT,
        dc: property
      });
    }).then(function(property) {
      assert((property.name === 'outDegreeCentrality') && (property.entityType === 'vertex'));
    });
  });
  it('inDegreeCentrality with default should return a Property', function() {
    return p.then(function(graph) {
      return graph.session.analyst.degreeCentrality(graph, {direction: algorithmHelper.degreeCentralityVariant.IN});
    }).then(function(property) {
      assert((property.name.startsWith('vertex_prop_integer')) && (property.entityType === 'vertex'));
    });
  });
  it('inDegreeCentrality with name should return a Property', function() {
    return p.then(function(graph) {
      return graph.session.analyst.degreeCentrality(graph, {
        direction: algorithmHelper.degreeCentralityVariant.IN,
        name: 'inDegreeCentrality'
      });
    }).then(function(property) {
      assert((property.name === 'inDegreeCentrality') && (property.entityType === 'vertex'));
    });
  });
  it('inDegreeCentrality with dc should return a Property', function() {
    return p.then(function(graph) {
      return graph.getVertexProperty('inDegreeCentrality');
    }).then(function(property) {
      return property.graph.session.analyst.degreeCentrality(property.graph, {
        direction: algorithmHelper.degreeCentralityVariant.IN,
        dc: property
      });
    }).then(function(property) {
      assert((property.name === 'inDegreeCentrality') && (property.entityType === 'vertex'));
    });
  });
  it('outDegreeDistribution with default should return a Map', function() {
    return p.then(function(graph) {
      return graph.session.analyst.degreeDistribution(graph, {degree: algorithmHelper.degreeDistributionVariant.OUT});
    }).then(function(map) {
      assert(map.name.startsWith('map_') && (map.keyType === 'integer') && (map.valType === 'long'));
    });
  });
  it('outDegreeDistribution with name should return a Map', function() {
    return p.then(function(graph) {
      return graph.session.analyst.degreeDistribution(graph, {
        degree: algorithmHelper.degreeDistributionVariant.OUT,
        distributionName: 'outDegreeDistribution'
      });
    }).then(function(map) {
      assert((map.name === 'outDegreeDistribution') && (map.keyType === 'integer') && (map.valType === 'long'));
    });
  });
  it('outDegreeDistribution with object should return a Map', function() {
    return p.then(function(graph) {
      return graph.createMap('integer', 'long', 'newOutDegreeDistribution');
    }).then(function(map) {
      return map.graph.session.analyst.degreeDistribution(map.graph, {
        degree: algorithmHelper.degreeDistributionVariant.OUT,
        distribution: map
      });
    }).then(function(map) {
      assert((map.name === 'newOutDegreeDistribution') && (map.keyType === 'integer') && (map.valType === 'long'));
    });
  });
  it('inDegreeDistribution with default should return a Map', function() {
    return p.then(function(graph) {
      return graph.session.analyst.degreeDistribution(graph);
    }).then(function(map) {
      assert(map.name.startsWith('map_') && (map.keyType === 'integer') && (map.valType === 'long'));
    });
  });
  it('inDegreeDistribution with name should return a Map', function() {
    return p.then(function(graph) {
      return graph.session.analyst.degreeDistribution(graph, {
        degree: algorithmHelper.degreeDistributionVariant.IN,
        distributionName: 'inDegreeDistribution'
      });
    }).then(function(map) {
      assert((map.name === 'inDegreeDistribution') && (map.keyType === 'integer') && (map.valType === 'long'));
    });
  });
  it('inDegreeDistribution with object should return a Map', function() {
    return p.then(function(graph) {
      return graph.createMap('integer', 'long', 'newInDegreeDistribution');
    }).then(function(map) {
      return map.graph.session.analyst.degreeDistribution(map.graph, {
        degree: algorithmHelper.degreeDistributionVariant.IN,
        distribution: map
      });
    }).then(function(map) {
      assert((map.name === 'newInDegreeDistribution') && (map.keyType === 'integer') && (map.valType === 'long'));
    });
  });
  it('shortestPathDijkstra with ids should return a Path', function() {
    return p.then(function(graph) {
      return graph.session.analyst.shortestPathDijkstra(graph, {
        src: 128,
        dst: 333,
        cost: 'cost',
        variant: algorithmHelper.dijkstraVariant.CLASSICAL
      });
    }).then(function(path) {
      assert((path.source === 128) && (path.destination === 333));
    });
  });
  it('shortestPathDijkstra with objects using default should return a Path', function() {
    return p.then(function(graph) {
      return graph.session.analyst.shortestPathDijkstra(graph, {
        src: v1,
        dst: v2,
        cost: e1,
        variant: algorithmHelper.dijkstraVariant.CLASSICAL
      });
    }).then(function(path) {
      assert((path.source === 128) && (path.destination === 333));;
    });
  });
  it('shortestPathDijkstra with objects using name should return a Path', function() {
    return p.then(function(graph) {
      return graph.session.analyst.shortestPathDijkstra(graph, {
        src: v1,
        dst: v2,
        cost: e1,
        variant: algorithmHelper.dijkstraVariant.CLASSICAL,
        parentName: 'parent',
        parentEdgeName: 'parentEdge'
      });
    }).then(function(path) {
      assert((path.source === 128) && (path.destination === 333));
    });
  });
  it('shortestPathDijkstra with objects using prop should return a Path', function() {
    let parent;
    return p.then(function(graph) {
      return graph.getVertexProperty('parent');
    }).then(function(property) {
      parent = property;
      return parent.graph.getVertexProperty('parentEdge');
    }).then(function(parentEdge) {
      return parentEdge.graph.session.analyst.shortestPathDijkstra(parentEdge.graph, {
        src: v1,
        dst: v2,
        cost: e1,
        variant: algorithmHelper.dijkstraVariant.CLASSICAL,
        parent: parent,
        parentEdge: parentEdge
      });
    }).then(function(path) {
      assert((path.source === 128) && (path.destination === 333));
    });
  });
  it('shortestPathFilteredDijkstra with objects using prop should return a Path', function() {
    let parent;
    return p.then(function(graph) {
      return graph.getVertexProperty('parent');
    }).then(function(property) {
      parent = property;
      return parent.graph.getVertexProperty('parentEdge');
    }).then(function(parentEdge) {
      return parentEdge.graph.session.analyst.shortestPathDijkstra(parentEdge.graph, {
        src: v1,
        dst: v2,
        cost: e1,
        variant: algorithmHelper.dijkstraVariant.CLASSICAL,
        parent: parent,
        parentEdge: parentEdge,
        filterExpr: vf
      });
    }).then(function(path) {
      assert((path.source === 128) && (path.destination === 333));
    });
  });
  it('shortestPathDijkstraBidirectional with ids should return a Path', function() {
    return p.then(function(graph) {
      return graph.session.analyst.shortestPathDijkstra(graph, {
        src: 128,
        dst: 333,
        cost: 'cost'
      });
    }).then(function(path) {
      assert((path.source === 128) && (path.destination === 333));
    });
  });
  it('shortestPathDijkstraBidirectional with objects using default should return a Path', function() {
    return p.then(function(graph) {
      return graph.session.analyst.shortestPathDijkstra(graph, {
        src: v1,
        dst: v2,
        cost: e1
      });
    }).then(function(path) {
      assert((path.source === 128) && (path.destination === 333));
    });
  });
  it('shortestPathDijkstraBidirectional with objects using name should return a Path', function() {
    return p.then(function(graph) {
      return graph.session.analyst.shortestPathDijkstra(graph, {
        src: v1,
        dst: v2,
        cost: e1,
        variant: algorithmHelper.dijkstraVariant.BIDIRECTIONAL,
        parentName: 'parent',
        parentEdgeName: 'parentEdge'
      });
    }).then(function(path) {
      assert((path.source === 128) && (path.destination === 333));
    });
  });
  it('shortestPathDijkstraBidirectional with objects using prop should return a Path', function() {
    let parent;
    return p.then(function(graph) {
      return graph.getVertexProperty('parent');
    }).then(function(property) {
      parent = property;
      return parent.graph.getVertexProperty('parentEdge');
    }).then(function(parentEdge) {
      return parentEdge.graph.session.analyst.shortestPathDijkstra(parentEdge.graph, {
        src: v1,
        dst: v2,
        cost: e1,
        variant: algorithmHelper.dijkstraVariant.BIDIRECTIONAL,
        parent: parent,
        parentEdge: parentEdge
      });
    }).then(function(path) {
      assert((path.source === 128) && (path.destination === 333));
    });
  });
  it('shortestPathFilteredDijkstraBidirectional with objects using prop should return a Path', function() {
    let parent;
    return p.then(function(graph) {
      return graph.getVertexProperty('parent');
    }).then(function(property) {
      parent = property;
      return parent.graph.getVertexProperty('parentEdge');
    }).then(function(parentEdge) {
      return parentEdge.graph.session.analyst.shortestPathDijkstra(parentEdge.graph, {
        src: v1,
        dst: v2,
        cost: e1,
        variant: algorithmHelper.dijkstraVariant.BIDIRECTIONAL,
        parent: parent,
        parentEdge: parentEdge,
        filterExpr: vf
      });
    }).then(function(path) {
      assert((path.source === 128) && (path.destination === 333));
    });
  });
  it('eigenvectorCentrality with default should return a Property', function() {
    return p.then(function(graph) {
      return graph.session.analyst.eigenvectorCentrality(graph);
    }).then(function(property) {
      assert((property.name.startsWith('vertex_prop_double')) && (property.entityType === 'vertex'));
    });
  });
  it('eigenvectorCentrality with name should return a Property', function() {
    return p.then(function(graph) {
      return graph.session.analyst.eigenvectorCentrality(graph, {
        max: 90,
        maxDiff: 0.002,
        useL2Norm: true,
        useInEdge: true,
        name: 'eigenvectorCentrality'
      });
    }).then(function(property) {
      assert((property.name === 'eigenvectorCentrality') && (property.entityType === 'vertex'));
    });
  });
  it('eigenvectorCentrality with ec should return a Property', function() {
    return p.then(function(graph) {
      return graph.getVertexProperty('eigenvectorCentrality');
    }).then(function(property) {
      return property.graph.session.analyst.eigenvectorCentrality(property.graph, {
        max: 90,
        maxDiff: 0.002,
        useL2Norm: true,
        useInEdge: true,
        ec: property
      });
    }).then(function(property) {
      assert((property.name === 'eigenvectorCentrality') && (property.entityType === 'vertex'));
    });
  });
  it('fattestPath with ids should return an AllPaths', function() {
    return p.then(function(graph) {
      return graph.session.analyst.fattestPath(graph, {
        root: 128,
        capacity: 'cost'
      });
    }).then(function(allPaths) {
      assert(allPaths.source === 128);
    });
  });
  it('fattestPath with objects using default should return an AllPaths', function() {
    return p.then(function(graph) {
      return graph.session.analyst.fattestPath(graph, {
        root: v1,
        capacity: e1
      });
    }).then(function(allPaths) {
      assert(allPaths.source === 128);
    });
  });
  it('fattestPath with objects using name should return an AllPaths', function() {
    return p.then(function(graph) {
      return graph.session.analyst.fattestPath(graph, {
        root: v1,
        capacity: e1,
        distanceName: 'distance',
        parentName: 'parent',
        parentEdgeName: 'parentEdge'
      });
    }).then(function(allPaths) {
      assert(allPaths.source === 128);
    });
  });
  it('fattestPath with objects using prop should return an AllPaths', function() {
    let dist, parent;
    return p.then(function(graph) {
      return graph.getVertexProperty('distance');
    }).then(function(property) {
      dist = property;
      return dist.graph.getVertexProperty('parent');
    }).then(function(property) {
      parent = property;
      return parent.graph.getVertexProperty('parentEdge');
    }).then(function(parentEdge) {
      return parentEdge.graph.session.analyst.fattestPath(parentEdge.graph, {
        root: v1,
        capacity: e1,
        distance: dist,
        parent: parent,
        parentEdge: parentEdge
      });
    }).then(function(allPaths) {
      assert(allPaths.source === 128);
    });
  });
  it('filteredBfs with id should return a Pair', function() {
    return p.then(function(graph) {
      return graph.session.analyst.filteredBfs(graph, {root: 128});
    }).then(function(pair) {
      assert(pair.first.name.startsWith('vertex_prop_integer') && pair.second.name.startsWith('vertex_prop_vertex'));
    });
  });
  it('filteredBfs with vertex using default should return a Pair', function() {
    return p.then(function(graph) {
      return graph.session.analyst.filteredBfs(graph, {root: v1});
    }).then(function(pair) {
      assert(pair.first.name.startsWith('vertex_prop_integer') && pair.second.name.startsWith('vertex_prop_vertex'));
    });
  });
  it('filteredBfs with vertex using name should return a Pair', function() {
    return p.then(function(graph) {
      return graph.session.analyst.filteredBfs(graph, {
        initWithInfinity: false,
        root: v1,
        filter: pgx.createVertexFilter('false'),
        navigator: pgx.createVertexFilter('false'),
        distanceName: 'filteredBfs-distance',
        parentName: 'filteredBfs-parent'
      });
    }).then(function(pair) {
      assert((pair.first.name === 'filteredBfs-distance') && (pair.second.name === 'filteredBfs-parent'));
    });
  });
  it('filteredBfs with vertex using prop should return a Pair', function() {
    let dist;
    return p.then(function(graph) {
      return graph.getVertexProperty('filteredBfs-distance');
    }).then(function(property) {
      dist = property;
      return dist.graph.getVertexProperty('filteredBfs-parent');
    }).then(function(parent) {
      return parent.graph.session.analyst.filteredBfs(parent.graph, {
        initWithInfinity: false,
        root: v1,
        filter: pgx.createVertexFilter('false'),
        navigator: pgx.createVertexFilter('false'),
        distance: dist,
        parent: parent
      });
    }).then(function(pair) {
      assert((pair.first.name === 'filteredBfs-distance') && (pair.second.name === 'filteredBfs-parent'));
    });
  });
  it('hits with default should return a Pair', function() {
    return p.then(function(graph) {
      return graph.session.analyst.hits(graph);
    }).then(function(pair) {
      assert(pair.first.name.startsWith('vertex_prop_double') && pair.second.name.startsWith('vertex_prop_double'));
    });
  });
  it('hits with name should return a Pair', function() {
    return p.then(function(graph) {
      return graph.session.analyst.hits(graph, {
        max: 90,
        hubsName: 'hubs',
        authName: 'auth'
      });
    }).then(function(pair) {
      assert((pair.first.name === 'auth') && (pair.second.name === 'hubs'));
    });
  });
  it('hits with prop should return a Pair', function() {
    let hubs, auth;
    return p.then(function(graph) {
      return graph.getVertexProperty('hubs');
    }).then(function(property) {
      hubs = property;
      return hubs.graph.getVertexProperty('auth');
    }).then(function(property) {
      auth = property;
      return auth.graph.session.analyst.hits(auth.graph, {
        max: 90,
        hubs: hubs,
        auth: auth
      });
    }).then(function(pair) {
      assert((pair.first.name === 'auth') && (pair.second.name === 'hubs'));
    });
  });
  it('kcore with default should return a Pair', function() {
    return p.then(function(graph) {
      return graph.session.analyst.kcore(graph);
    }).then(function(pair) {
      assert(pair.first.name.startsWith('scalar_long') && pair.second.name.startsWith('vertex_prop_long'));
    });
  });
  it('kcore with name should return a Pair', function() {
    return p.then(function(graph) {
      return graph.session.analyst.kcore(graph, {
        minCore: 0,
        maxCore: 1000,
        maxKCoreName: 'maxKCore',
        kcoreName: 'kcore'
      });
    }).then(function(pair) {
      assert((pair.first.name === 'maxKCore') && (pair.second.name === 'kcore'));
    });
  });
  it('kcore with objects should return a Pair', function() {
    let localProperty;
    return p.then(function(graph) {
      return graph.getVertexProperty('kcore');
    }).then(function(property) {
      localProperty = property;
      return localProperty.graph.createScalar('long', 'newMaxKCore');
    }).then(function(scalar) {
      return scalar.graph.session.analyst.kcore(scalar.graph, {
        minCore: 0,
        maxCore: 1000,
        maxKCore: scalar,
        kcore: localProperty
      });
    }).then(function(pair) {
      assert((pair.first.name === 'newMaxKCore') && (pair.second.name === 'kcore'));
    });
  });
  it('matrixFactorizationGradientDescent with name should return a matrixFactorizationModel', function() {
    return p.then(function(graph) {
      return graph.createVertexSet();
    }).then(function(collection) {
      return collection.addAll([128, 99, 333]);
    }).then(function(collection) {
      return collection.graph.bipartiteSubGraphFromLeftSet(collection);
    }).then(function(bipartiteGraph) {
      return bipartiteGraph.session.analyst.matrixFactorizationGradientDescent(bipartiteGraph, {weight: 'cost'});
    }).then(function(matrixFactorizationModel) {
      assert(matrixFactorizationModel.features.name.startsWith('vertex_prop_double'));
    });
  });
  it('matrixFactorizationGradientDescent with prop using default should return a matrixFactorizationModel', function() {
    return p.then(function(graph) {
      return graph.createVertexSet();
    }).then(function(collection) {
      return collection.addAll([128, 99, 333]);
    }).then(function(collection) {
      return collection.graph.bipartiteSubGraphFromLeftSet(collection);
    }).then(function(bipartiteGraph) {
      return bipartiteGraph.session.analyst.matrixFactorizationGradientDescent(bipartiteGraph, {weight: e1});
    }).then(function(matrixFactorizationModel) {
      assert(matrixFactorizationModel.features.name.startsWith('vertex_prop_double'));
    });
  });
  it('matrixFactorizationGradientDescent with prop using name should return a matrixFactorizationModel', function() {
    return p.then(function(graph) {
      return graph.createVertexSet();
    }).then(function(collection) {
      return collection.addAll([128, 99, 333]);
    }).then(function(collection) {
      return collection.graph.bipartiteSubGraphFromLeftSet(collection);
    }).then(function(bipartiteGraph) {
      return bipartiteGraph.session.analyst.matrixFactorizationGradientDescent(bipartiteGraph, {
        weight: e1,
        learningRate: 0.11,
        changePerStep: 0.91,
        lambda: 0.11,
        maxStep: 90,
        vectorLength: 21,
        featuresName: 'features'
      });
    }).then(function(matrixFactorizationModel) {
      assert(matrixFactorizationModel.features.name === 'features');
    });
  });
  it('matrixFactorizationGradientDescent with prop using prop should return a matrixFactorizationModel', function() {
    return p.then(function(graph) {
      return graph.createVertexSet();
    }).then(function(collection) {
      return collection.addAll([128, 99, 333]);
    }).then(function(collection) {
      return collection.graph.bipartiteSubGraphFromLeftSet(collection);
    }).then(function(bipartiteGraph) {
      return bipartiteGraph.createVertexVectorProperty('double', 21, 'features');
    }).then(function(property) {
      return property.graph.session.analyst.matrixFactorizationGradientDescent(property.graph, {
        weight: e1,
        learningRate: 0.11,
        changePerStep: 0.91,
        lambda: 0.11,
        maxStep: 90,
        vectorLength: 21,
        features: property
      });
    }).then(function(matrixFactorizationModel) {
      assert(matrixFactorizationModel.features.name === 'features');
    });
  });
  it('pagerank with default should return a Property', function() {
    return p.then(function(graph) {
      return graph.session.analyst.pagerank(graph);
    }).then(function(property) {
      assert((property.name.startsWith('vertex_prop_double')) && (property.entityType === 'vertex'));
    });
  });
  it('pagerank with name should return a Property', function() {
    return p.then(function(graph) {
      return graph.session.analyst.pagerank(graph, {
        e: 0.002,
        d: 0.84,
        max: 99,
        name: 'pagerank',
        variant: algorithmHelper.pagerankVariant.DEFAULT
      });
    }).then(function(property) {
      assert((property.name === 'pagerank') && (property.entityType === 'vertex'));
    });
  });
  it('pagerank with rank should return a Property', function() {
    return p.then(function(graph) {
      return graph.getVertexProperty('pagerank');
    }).then(function(property) {
      return property.graph.session.analyst.pagerank(property.graph, {
        e: 0.002,
        d: 0.84,
        max: 99,
        rank: property,
        variant: algorithmHelper.pagerankVariant.DEFAULT
      });
    }).then(function(property) {
      assert((property.name === 'pagerank') && (property.entityType === 'vertex'));
    });
  });
  it('weightedPagerank with weight as name should return a Property', function() {
    return p.then(function(graph) {
      return graph.session.analyst.pagerank(graph, {
        variant: algorithmHelper.pagerankVariant.WEIGHTED,
        weight: 'cost'
      });
    }).then(function(property) {
      assert((property.name.startsWith('vertex_prop_double')) && (property.entityType === 'vertex'));
    });
  });
  it('weightedPagerank with weight as prop using default should return a Property', function() {
    return p.then(function(graph) {
      return graph.session.analyst.pagerank(graph, {
        variant: algorithmHelper.pagerankVariant.WEIGHTED,
        weight: e1
      });
    }).then(function(property) {
      assert((property.name.startsWith('vertex_prop_double')) && (property.entityType === 'vertex'));
    });
  });
  it('weightedPagerank with weight as prop using name should return a Property', function() {
    return p.then(function(graph) {
      return graph.session.analyst.pagerank(graph, {
        e: 0.002,
        d: 0.84,
        max: 90,
        name: 'weightedPagerank',
        variant: algorithmHelper.pagerankVariant.WEIGHTED,
        weight: e1
      });
    }).then(function(property) {
      assert((property.name === 'weightedPagerank') && (property.entityType === 'vertex'));
    });
  });
  it('weightedPagerank with weight as prop using rank should return a Property', function() {
    return p.then(function(graph) {
      return graph.getVertexProperty('weightedPagerank');
    }).then(function(property) {
      return property.graph.session.analyst.pagerank(property.graph, {
        e: 0.002,
        d: 0.84,
        max: 90,
        rank: property,
        variant: algorithmHelper.pagerankVariant.WEIGHTED,
        weight: e1
      });
    }).then(function(property) {
      assert((property.name === 'weightedPagerank') && (property.entityType === 'vertex'));
    });
  });
  it('personalizedPagerank with vertices as id should return a Property', function() {
    return p.then(function(graph) {
      return graph.session.analyst.pagerank(graph, {
        variant: algorithmHelper.pagerankVariant.PERSONALIZED,
        vertices: 128
      });
    }).then(function(property) {
      assert((property.name.startsWith('vertex_prop_double')) && (property.entityType === 'vertex'));
    });
  });
  it('personalizedPagerank with vertices as vertex should return a Property', function() {
    return p.then(function(graph) {
      return graph.session.analyst.pagerank(graph, {
        variant: algorithmHelper.pagerankVariant.PERSONALIZED,
        vertices: v1
      });
    }).then(function(property) {
      assert((property.name.startsWith('vertex_prop_double')) && (property.entityType === 'vertex'));
    });
  });
  it('personalizedPagerank with vertices as vertexSet using default should return a Property', function() {
    return p.then(function(graph) {
      return graph.createVertexSet();
    }).then(function(collection) {
      return collection.addAll([128, 333, 99, 1908]);
    }).then(function(collection) {
      return collection.graph.session.analyst.pagerank(collection.graph, {
        variant: algorithmHelper.pagerankVariant.PERSONALIZED,
        vertices: collection
      });
    }).then(function(property) {
      assert((property.name.startsWith('vertex_prop_double')) && (property.entityType === 'vertex'));
    });
  });
  it('personalizedPagerank with vertices as vertexSet using name should return a Property', function() {
    return p.then(function(graph) {
      return graph.createVertexSet();
    }).then(function(collection) {
      return collection.addAll([128, 333, 99, 1908]);
    }).then(function(collection) {
      return collection.graph.session.analyst.pagerank(collection.graph, {
        e: 0.002,
        d: 0.84,
        max: 90,
        name: 'personalizedPagerank',
        variant: algorithmHelper.pagerankVariant.PERSONALIZED,
        vertices: collection
      });
    }).then(function(property) {
      assert((property.name === 'personalizedPagerank') && (property.entityType === 'vertex'));
    });
  });
  it('personalizedPagerank with vertices as vertexSet using rank should return a Property', function() {
    let localCollection;
    return p.then(function(graph) {
      return graph.createVertexSet();
    }).then(function(collection) {
      return collection.addAll([128, 333, 99, 1908]);
    }).then(function(collection) {
      localCollection = collection;
      return collection.graph.getVertexProperty('personalizedPagerank');
    }).then(function(property) {
      return property.graph.session.analyst.pagerank(property.graph, {
        e: 0.002,
        d: 0.84,
        max: 90,
        rank: property,
        variant: algorithmHelper.pagerankVariant.PERSONALIZED,
        vertices: localCollection
      });
    }).then(function(property) {
      assert((property.name === 'personalizedPagerank') && (property.entityType === 'vertex'));
    });
  });
  it('personalizedWeightedPagerank with weight as name return a Property', function() {
    return p.then(function(graph) {
      return graph.session.analyst.pagerank(graph, {
        variant: algorithmHelper.pagerankVariant.PERSONALIZED_WEIGHTED,
        weight: 'cost',
        vertices: 128
      });
    }).then(function(property) {
      assert((property.name.startsWith('vertex_prop_double')) && (property.entityType === 'vertex'));
    });
  });
  it('personalizedWeightedPagerank with vertices as id should return a Property', function() {
    return p.then(function(graph) {
      return graph.session.analyst.pagerank(graph, {
        variant: algorithmHelper.pagerankVariant.PERSONALIZED_WEIGHTED,
        weight: e1,
        vertices: 128
      });
    }).then(function(property) {
      assert((property.name.startsWith('vertex_prop_double')) && (property.entityType === 'vertex'));
    });
  });
  it('personalizedWeightedPagerank with vertices as vertex should return a Property', function() {
    return p.then(function(graph) {
      return graph.session.analyst.pagerank(graph, {
        variant: algorithmHelper.pagerankVariant.PERSONALIZED_WEIGHTED,
        vertices: v1,
        weight: e1
      });
    }).then(function(property) {
      assert((property.name.startsWith('vertex_prop_double')) && (property.entityType === 'vertex'));
    });
  });
  it('personalizedWeightedPagerank with vertices as vertexSet using default should return a Property', function() {
    return p.then(function(graph) {
      return graph.createVertexSet();
    }).then(function(collection) {
      return collection.addAll([128, 333, 99, 1908]);
    }).then(function(collection) {
      return collection.graph.session.analyst.pagerank(collection.graph, {
        variant: algorithmHelper.pagerankVariant.PERSONALIZED_WEIGHTED,
        vertices: collection,
        weight: e1
      });
    }).then(function(property) {
      assert((property.name.startsWith('vertex_prop_double')) && (property.entityType === 'vertex'));
    });
  });
  it('personalizedWeightedPagerank with vertices as vertexSet using name should return a Property', function() {
    return p.then(function(graph) {
      return graph.createVertexSet();
    }).then(function(collection) {
      return collection.addAll([128, 333, 99, 1908]);
    }).then(function(collection) {
      return collection.graph.session.analyst.pagerank(collection.graph, {
        e: 0.002,
        d: 0.84,
        max: 90,
        name: 'personalizedWeightedPagerank',
        variant: algorithmHelper.pagerankVariant.PERSONALIZED_WEIGHTED,
        vertices: collection,
        weight: e1
      });
    }).then(function(property) {
      assert((property.name === 'personalizedWeightedPagerank') && (property.entityType === 'vertex'));
    });
  });
  it('personalizedWeightedPagerank with vertices as vertexSet using rank should return a Property', function() {
    let localCollection;
    return p.then(function(graph) {
      return graph.createVertexSet();
    }).then(function(collection) {
      return collection.addAll([128, 333, 99, 1908]);
    }).then(function(collection) {
      localCollection = collection;
      return collection.graph.getVertexProperty('personalizedWeightedPagerank');
    }).then(function(property) {
      return property.graph.session.analyst.pagerank(property.graph, {
        e: 0.002,
        d: 0.84,
        max: 90,
        rank: property,
        variant: algorithmHelper.pagerankVariant.PERSONALIZED_WEIGHTED,
        vertices: localCollection,
        weight: e1
      });
    }).then(function(property) {
      assert((property.name === 'personalizedWeightedPagerank') && (property.entityType === 'vertex'));
    });
  });
  it('pagerankApproximate with default should return a Property', function() {
    return p.then(function(graph) {
      return graph.session.analyst.pagerank(graph, {variant: algorithmHelper.pagerankVariant.APPROXIMATE});
    }).then(function(property) {
      assert((property.name.startsWith('vertex_prop_double')) && (property.entityType === 'vertex'));
    });
  });
  it('pagerankApproximate with name should return a Property', function() {
    return p.then(function(graph) {
      return graph.session.analyst.pagerank(graph, {
        e: 0.002,
        d: 0.84,
        max: 90,
        name: 'pagerankApproximate',
        variant: algorithmHelper.pagerankVariant.APPROXIMATE
      });
    }).then(function(property) {
      assert((property.name === 'pagerankApproximate') && (property.entityType === 'vertex'));
    });
  });
  it('pagerankApproximate with rank should return a Property', function() {
    return p.then(function(graph) {
      return graph.getVertexProperty('pagerankApproximate');
    }).then(function(property) {
      return property.graph.session.analyst.pagerank(property.graph, {
        e: 0.002,
        d: 0.84,
        max: 90,
        rank: property,
        variant: algorithmHelper.pagerankVariant.APPROXIMATE
      });
    }).then(function(property) {
      assert((property.name === 'pagerankApproximate') && (property.entityType === 'vertex'));
    });
  });
  it('shortestPathBellmanFord with ids should return an AllPaths', function() {
    return p.then(function(graph) {
      return graph.session.analyst.shortestPathBellmanFord(graph, {
        src: 128,
        cost: 'cost'
      });
    }).then(function(allPaths) {
      assert(allPaths.source === 128);
    });
  });
  it('shortestPathBellmanFord with objects using default should return an AllPaths', function() {
    return p.then(function(graph) {
      return graph.session.analyst.shortestPathBellmanFord(graph, {
        src: v1,
        cost: e1
      });
    }).then(function(allPaths) {
      assert(allPaths.source === 128);
    });
  });
  it('shortestPathBellmanFord with objects using name should return an AllPaths', function() {
    return p.then(function(graph) {
      return graph.session.analyst.shortestPathBellmanFord(graph, {
        src: v1,
        cost: e1,
        traversalDirection: algorithmHelper.shortestPathVariant.FORWARD,
        distanceName: 'distance',
        parentName: 'parent',
        parentEdgeName: 'parentEdge'
      });
    }).then(function(allPaths) {
      assert(allPaths.source === 128);
    });
  });
  it('shortestPathBellmanFord with objects using prop should return an AllPaths', function() {
    let dist, parent;
    return p.then(function(graph) {
      return graph.getVertexProperty('distance');
    }).then(function(property) {
      dist = property;
      return dist.graph.getVertexProperty('parent');
    }).then(function(property) {
      parent = property;
      return parent.graph.getVertexProperty('parentEdge');
    }).then(function(parentEdge) {
      return parentEdge.graph.session.analyst.shortestPathBellmanFord(parentEdge.graph, {
        src: v1,
        cost: e1,
        traversalDirection: algorithmHelper.shortestPathVariant.FORWARD,
        distance: dist,
        parent: parent,
        parentEdge: parentEdge
      });
    }).then(function(allPaths) {
      assert(allPaths.source === 128);
    });
  });
  it('shortestPathBellmanFordReverse with objects using prop should return an AllPaths', function() {
    let dist, parent;
    return p.then(function(graph) {
      return graph.getVertexProperty('distance');
    }).then(function(property) {
      dist = property;
      return dist.graph.getVertexProperty('parent');
    }).then(function(property) {
      parent = property;
      return parent.graph.getVertexProperty('parentEdge');
    }).then(function(parentEdge) {
      return parentEdge.graph.session.analyst.shortestPathBellmanFord(parentEdge.graph, {
        src: v1,
        cost: e1,
        traversalDirection: algorithmHelper.shortestPathVariant.REVERSE,
        distance: dist,
        parent: parent,
        parentEdge: parentEdge
      });
    }).then(function(allPaths) {
      assert(allPaths.source === 128);
    });
  });
  it('shortestPathHopDist with id should return an AllPaths', function() {
    return p.then(function(graph) {
      return graph.session.analyst.shortestPathHopDist(graph, {src: 128});
    }).then(function(allPaths) {
      assert(allPaths.source === 128);
    });
  });
  it('shortestPathHopDist with vertex using default should return an AllPaths', function() {
    return p.then(function(graph) {
      return graph.session.analyst.shortestPathHopDist(graph, {src: v1});
    }).then(function(allPaths) {
      assert(allPaths.source === 128);
    });
  });
  it('shortestPathHopDist with vertex using name should return an AllPaths', function() {
    return p.then(function(graph) {
      return graph.session.analyst.shortestPathHopDist(graph, {
        src: v1,
        traversalDirection: algorithmHelper.shortestPathVariant.FORWARD,
        distanceName: 'distance',
        parentName: 'parent',
        parentEdgeName: 'parentEdge'
      });
    }).then(function(allPaths) {
      assert(allPaths.source === 128);
    });
  });
  it('shortestPathHopDist with vertex using prop should return an AllPaths', function() {
    let dist, parent;
    return p.then(function(graph) {
      return graph.getVertexProperty('distance');
    }).then(function(property) {
      dist = property;
      return dist.graph.getVertexProperty('parent');
    }).then(function(property) {
      parent = property;
      return parent.graph.getVertexProperty('parentEdge');
    }).then(function(parentEdge) {
      return parentEdge.graph.session.analyst.shortestPathHopDist(parentEdge.graph, {
        src: v1,
        traversalDirection: algorithmHelper.shortestPathVariant.FORWARD,
        distance: dist,
        parent: parent,
        parentEdge: parentEdge
      });
    }).then(function(allPaths) {
      assert(allPaths.source === 128);
    });
  });
  it('shortestPathHopDistReverse with vertex using prop should return an AllPaths', function() {
    let dist, parent;
    return p.then(function(graph) {
      return graph.getVertexProperty('distance');
    }).then(function(property) {
      dist = property;
      return dist.graph.getVertexProperty('parent');
    }).then(function(property) {
      parent = property;
      return parent.graph.getVertexProperty('parentEdge');
    }).then(function(parentEdge) {
      return parentEdge.graph.session.analyst.shortestPathHopDist(parentEdge.graph, {
        src: v1,
        traversalDirection: algorithmHelper.shortestPathVariant.REVERSE,
        distance: dist,
        parent: parent,
        parentEdge: parentEdge
      });
    }).then(function(allPaths) {
      assert(allPaths.source === 128);
    });
  });
  it('countTriangles without sortDegree should return 1', function() {
    return p.then(function(graph) {
      return graph.session.analyst.countTriangles(graph, false);
    }).then(function(result) {
      assert.equal(1, result);
    });
  });
  it('countTriangles with sortDegree should return 1', function() {
    return p.then(function(graph) {
      return graph.session.analyst.countTriangles(graph, true);
    }).then(function(result) {
      assert.equal(1, result);
    });
  });
  it('vertexBetweennessCentrality with default should return a Property', function() {
    return p.then(function(graph) {
      return graph.session.analyst.vertexBetweennessCentrality(graph);
    }).then(function(property) {
      assert((property.name.startsWith('vertex_prop_double')) && (property.entityType === 'vertex'));
    });
  });
  it('vertexBetweennessCentrality with name should return a Property', function() {
    return p.then(function(graph) {
      return graph.session.analyst.vertexBetweennessCentrality(graph, {
        name: 'vertexBetweennessCentrality',
        variant: algorithmHelper.betweennessCentralityVariant.FULL,
        numRandomSeeds: 6
      });
    }).then(function(property) {
      assert((property.name === 'vertexBetweennessCentrality') && (property.entityType === 'vertex'));
    });
  });
  it('vertexBetweennessCentrality with bc should return a Property', function() {
    return p.then(function(graph) {
      return graph.getVertexProperty('vertexBetweennessCentrality');
    }).then(function(property) {
      return property.graph.session.analyst.vertexBetweennessCentrality(property.graph, {
        bc: property,
        variant: algorithmHelper.betweennessCentralityVariant.FULL,
        numRandomSeeds: 6
      });
    }).then(function(property) {
      assert((property.name === 'vertexBetweennessCentrality') && (property.entityType === 'vertex'));
    });
  });
  it('approximateVertexBetweennessCentrality with default should return a Property', function() {
    return p.then(function(graph) {
      return graph.session.analyst.vertexBetweennessCentrality(graph, {variant: algorithmHelper.betweennessCentralityVariant.APPROXIMATE});
    }).then(function(property) {
      assert((property.name.startsWith('vertex_prop_double')) && (property.entityType === 'vertex'));
    });
  });
  it('approximateVertexBetweennessCentrality with name should return a Property', function() {
    return p.then(function(graph) {
      return graph.session.analyst.vertexBetweennessCentrality(graph, {
        name: 'approximateVertexBetweennessCentrality',
        variant: algorithmHelper.betweennessCentralityVariant.APPROXIMATE,
        numRandomSeeds: 6
      });
    }).then(function(property) {
      assert((property.name === 'approximateVertexBetweennessCentrality') && (property.entityType === 'vertex'));
    });
  });
  it('approximateVertexBetweennessCentrality with bc should return a Property', function() {
    return p.then(function(graph) {
      return graph.getVertexProperty('approximateVertexBetweennessCentrality');
    }).then(function(property) {
      return property.graph.session.analyst.vertexBetweennessCentrality(property.graph, {
        bc: property,
        variant: algorithmHelper.betweennessCentralityVariant.APPROXIMATE,
        numRandomSeeds: 6
      });
    }).then(function(property) {
      assert((property.name === 'approximateVertexBetweennessCentrality') && (property.entityType === 'vertex'));
    });
  });
  it('approximateVertexBetweennessCentralityFromSeeds with ids using default should return a Property', function() {
    return p.then(function(graph) {
      return graph.session.analyst.vertexBetweennessCentrality(graph, {
        variant: algorithmHelper.betweennessCentralityVariant.APPROXIMATE,
        seeds: [128, 333]
      });
    }).then(function(property) {
      assert((property.name.startsWith('vertex_prop_double')) && (property.entityType === 'vertex'));
    });
  });
  it('approximateVertexBetweennessCentralityFromSeeds with vertices using default should return a Property', function() {
    return p.then(function(graph) {
      return graph.session.analyst.vertexBetweennessCentrality(graph, {
        variant: algorithmHelper.betweennessCentralityVariant.APPROXIMATE,
        seeds: [v1, v2]
      });
    }).then(function(property) {
      assert((property.name.startsWith('vertex_prop_double')) && (property.entityType === 'vertex'));
    });
  });
  it('approximateVertexBetweennessCentralityFromSeeds with vertices using name should return a Property', function() {
    return p.then(function(graph) {
      return graph.session.analyst.vertexBetweennessCentrality(graph, {
        name: 'approximateVertexBetweennessCentralityFromSeeds',
        variant: algorithmHelper.betweennessCentralityVariant.APPROXIMATE,
        seeds: [v1, v2]
      });
    }).then(function(property) {
      assert((property.name === 'approximateVertexBetweennessCentralityFromSeeds') &&
        (property.entityType === 'vertex'));
    });
  });
  it('approximateVertexBetweennessCentralityFromSeeds with vertices using bc should return a Property', function() {
    return p.then(function(graph) {
      return graph.getVertexProperty('approximateVertexBetweennessCentralityFromSeeds');
    }).then(function(property) {
      return property.graph.session.analyst.vertexBetweennessCentrality(property.graph, {
        bc: property,
        variant: algorithmHelper.betweennessCentralityVariant.APPROXIMATE,
        seeds: [v1, v2]
      });
    }).then(function(property) {
      assert((property.name === 'approximateVertexBetweennessCentralityFromSeeds') &&
        (property.entityType === 'vertex'));
    });
  });
  it('adamicAdarCounting with default should return a Property', function() {
    return p.then(function(graph) {
      return graph.session.analyst.adamicAdarCounting(graph);
    }).then(function(property) {
      assert((property.name.startsWith('edge_prop_double')) && (property.entityType === 'edge'));
    });
  });
  it('adamicAdarCounting with name should return a Property', function() {
    return p.then(function(graph) {
      return graph.session.analyst.adamicAdarCounting(graph, {name: 'adamicAdarCounting'});
    }).then(function(property) {
      assert((property.name === 'adamicAdarCounting') && (property.entityType === 'edge'));
    });
  });
  it('adamicAdarCounting with prop should return a Property', function() {
    return p.then(function(graph) {
      return graph.getEdgeProperty('adamicAdarCounting');
    }).then(function(property) {
      return property.graph.session.analyst.adamicAdarCounting(property.graph, {aa: property});
    }).then(function(property) {
      assert((property.name === 'adamicAdarCounting') && (property.entityType === 'edge'));
    });
  });
  it('conductance with default should return a Scalar', function() {
    return p.then(function(graph) {
      return graph.session.analyst.scc(graph);
    }).then(function(partition) {
      return partition.graph.session.analyst.conductance(partition.graph, {
        partition: partition,
        partitionIndex: 0
      });
    }).then(function(scalar) {
      assert(scalar.name.startsWith('scalar_double'));
    });
  });
  it('conductance with name should return a Scalar', function() {
    return p.then(function(graph) {
      return graph.session.analyst.scc(graph);
    }).then(function(partition) {
      return partition.graph.session.analyst.conductance(partition.graph, {
        partition: partition,
        partitionIndex: 0,
        conductanceName: 'conductance',
      });
    }).then(function(scalar) {
      assert(scalar.name === 'conductance');
    });
  });
  it('conductance with object should return a Scalar', function() {
    let localScalar;
    return p.then(function(graph) {
      return graph.createScalar('double', 'newConductance');
    }).then(function(scalar) {
      localScalar = scalar;
      return localScalar.graph.session.analyst.scc(localScalar.graph);
    }).then(function(partition) {
      return partition.graph.session.analyst.conductance(partition.graph, {
        partition: partition,
        partitionIndex: 0,
        conductance: localScalar,
      });
    }).then(function(scalar) {
      assert(scalar.name === 'newConductance');
    });
  });
  it('partitionConductance with default should return a Pair', function() {
    return p.then(function(graph) {
      return graph.session.analyst.scc(graph);
    }).then(function(partition) {
      return partition.graph.session.analyst.conductance(partition.graph, {partition: partition});
    }).then(function(pair) {
      assert(pair.first.name.startsWith('scalar_double') && pair.second.name.startsWith('scalar_double'));
    });
  });
  it('partitionConductance with name should return a Pair', function() {
    return p.then(function(graph) {
      return graph.session.analyst.scc(graph);
    }).then(function(partition) {
      return partition.graph.session.analyst.conductance(partition.graph, {
        partition: partition,
        conductanceName: 'avgConductance',
        minConductanceName: 'minConductance'
      });
    }).then(function(pair) {
      assert((pair.first.name === 'avgConductance') && (pair.second.name === 'minConductance'));
    });
  });
  it('partitionConductance with objects should return a Pair', function() {
    let avgCond, minCond;
    return p.then(function(graph) {
      return graph.createScalar('double', 'newAvgConductance');
    }).then(function(scalar) {
      avgCond = scalar;
      return avgCond.graph.createScalar('double', 'newMinConductance');
    }).then(function(scalar) {
      minCond = scalar;
      return minCond.graph.session.analyst.scc(minCond.graph);
    }).then(function(partition) {
      return partition.graph.session.analyst.conductance(partition.graph, {
        partition: partition,
        conductance: avgCond,
        minConductance: minCond
      });
    }).then(function(pair) {
      assert((pair.first.name === 'newAvgConductance') && (pair.second.name === 'newMinConductance'));
    });
  });
  it('partitionModularity with default should return a Scalar', function() {
    return p.then(function(graph) {
      return graph.session.analyst.scc(graph);
    }).then(function(partition) {
      return partition.graph.session.analyst.partitionModularity(partition.graph, {partition: partition});
    }).then(function(scalar) {
      assert(scalar.name.startsWith('scalar_double'));
    });
  });
  it('partitionModularity with name should return a Scalar', function() {
    return p.then(function(graph) {
      return graph.session.analyst.scc(graph);
    }).then(function(partition) {
      return partition.graph.session.analyst.partitionModularity(partition.graph, {
        partition: partition,
        modularityName: 'partitionModularity'
      });
    }).then(function(scalar) {
      assert(scalar.name === 'partitionModularity');
    });
  });
  it('partitionModularity with object should return a Scalar', function() {
    let localScalar;
    return p.then(function(graph) {
      return graph.createScalar('double', 'newPartitionModularity');
    }).then(function(scalar) {
      localScalar = scalar;
      return localScalar.graph.session.analyst.scc(localScalar.graph);
    }).then(function(partition) {
      return partition.graph.session.analyst.partitionModularity(partition.graph, {
        partition: partition,
        modularity: localScalar
      });
    }).then(function(scalar) {
      assert(scalar.name === 'newPartitionModularity');
    });
  });
  it('salsa with default should return a property', function() {
    return p.then(function(graph) {
      return graph.createVertexSet();
    }).then(function(collection) {
      return collection.addAll([128, 99, 333]);
    }).then(function(collection) {
      return collection.graph.bipartiteSubGraphFromLeftSet(collection);
    }).then(function(bipartiteGraph) {
      return bipartiteGraph.session.analyst.salsa(bipartiteGraph);
    }).then(function(property) {
      assert((property.name.startsWith('vertex_prop_double')) && (property.entityType === 'vertex'));
    });
  });
  it('salsa with name should return a property', function() {
    return p.then(function(graph) {
      return graph.createVertexSet();
    }).then(function(collection) {
      return collection.addAll([128, 99, 333]);
    }).then(function(collection) {
      return collection.graph.bipartiteSubGraphFromLeftSet(collection);
    }).then(function(bipartiteGraph) {
      return bipartiteGraph.session.analyst.salsa(bipartiteGraph, {
        variant: algorithmHelper.salsaVariant.DEFAULT,
        d: 0.80,
        maxIterations: 90,
        maxDiff: 0.002,
        salsaRankName: 'salsa'
      });
    }).then(function(property) {
      assert((property.name === 'salsa') && (property.entityType === 'vertex'));
    });
  });
  it('salsa with rank should return a property', function() {
    return p.then(function(graph) {
      return graph.createVertexSet();
    }).then(function(collection) {
      return collection.addAll([128, 99, 333]);
    }).then(function(collection) {
      return collection.graph.bipartiteSubGraphFromLeftSet(collection);
    }).then(function(bipartiteGraph) {
      return bipartiteGraph.createVertexProperty('double', 'salsa');
    }).then(function(property) {
      return property.graph.session.analyst.salsa(property.graph, {
        variant: algorithmHelper.salsaVariant.DEFAULT,
        d: 0.80,
        maxIterations: 90,
        maxDiff: 0.002,
        salsaRank: property
      });
    }).then(function(property) {
      assert((property.name === 'salsa') && (property.entityType === 'vertex'));
    });
  });
  it('personalizedSalsa with id should return a Property', function() {
    return p.then(function(graph) {
      return graph.createVertexSet();
    }).then(function(collection) {
      return collection.addAll([128, 99, 333]);
    }).then(function(collection) {
      return collection.graph.bipartiteSubGraphFromLeftSet(collection);
    }).then(function(bipartiteGraph) {
      return bipartiteGraph.session.analyst.salsa(bipartiteGraph, {
        variant: algorithmHelper.salsaVariant.PERSONALIZED,
        vertices: 128
      });
    }).then(function(property) {
      assert((property.name.startsWith('vertex_prop_double')) && (property.entityType === 'vertex'));
    });
  });
  it('personalizedSalsa with vertex should return a Property', function() {
    return p.then(function(graph) {
      return graph.createVertexSet();
    }).then(function(collection) {
      return collection.addAll([128, 99, 333]);
    }).then(function(collection) {
      return collection.graph.bipartiteSubGraphFromLeftSet(collection);
    }).then(function(bipartiteGraph) {
      return bipartiteGraph.getVertex(128);
    }).then(function(vertex) {
      return vertex.graph.session.analyst.salsa(vertex.graph, {
        variant: algorithmHelper.salsaVariant.PERSONALIZED,
        vertices: vertex
      });
    }).then(function(property) {
      assert((property.name.startsWith('vertex_prop_double')) && (property.entityType === 'vertex'));
    });
  });
  it('personalizedSalsa with vertexSet using default should return a Property', function() {
    let localCollection;
    return p.then(function(graph) {
      return graph.createVertexSet();
    }).then(function(collection) {
      return collection.addAll([128, 99, 333]);
    }).then(function(collection) {
      localCollection = collection;
      return localCollection.graph.bipartiteSubGraphFromLeftSet(localCollection);
    }).then(function(bipartiteGraph) {
      return bipartiteGraph.session.analyst.salsa(bipartiteGraph, {
        variant: algorithmHelper.salsaVariant.PERSONALIZED,
        vertices: localCollection
      });
    }).then(function(property) {
      assert((property.name.startsWith('vertex_prop_double')) && (property.entityType === 'vertex'));
    });
  });
  it('personalizedSalsa with vertexSet using name should return a Property', function() {
    let localCollection;
    return p.then(function(graph) {
      return graph.createVertexSet();
    }).then(function(collection) {
      return collection.addAll([128, 99, 333]);
    }).then(function(collection) {
      localCollection = collection;
      return localCollection.graph.bipartiteSubGraphFromLeftSet(localCollection);
    }).then(function(bipartiteGraph) {
      return bipartiteGraph.session.analyst.salsa(bipartiteGraph, {
        variant: algorithmHelper.salsaVariant.PERSONALIZED,
        vertices: localCollection,
        d: 0.80,
        maxIterations: 90,
        maxDiff: 0.002,
        salsaRankName: 'personalizedSalsa'
      });
    }).then(function(property) {
      assert((property.name === 'personalizedSalsa') && (property.entityType === 'vertex'));
    });
  });
  it('personalizedSalsa with vertexSet using rank should return a Property', function() {
    let localCollection;
    return p.then(function(graph) {
      return graph.createVertexSet();
    }).then(function(collection) {
      return collection.addAll([128, 99, 333]);
    }).then(function(collection) {
      localCollection = collection;
      return localCollection.graph.bipartiteSubGraphFromLeftSet(localCollection);
    }).then(function(bipartiteGraph) {
      return bipartiteGraph.createVertexProperty('double', 'personalizedSalsa');
    }).then(function(property) {
      return property.graph.session.analyst.salsa(property.graph, {
        variant: algorithmHelper.salsaVariant.PERSONALIZED,
        vertices: localCollection,
        d: 0.80,
        maxIterations: 90,
        maxDiff: 0.002,
        salsaRank: property
      });
    }).then(function(property) {
      assert((property.name === 'personalizedSalsa') && (property.entityType === 'vertex'));
    });
  });
  it('whomToFollow with id should return a Pair', function() {
    return p.then(function(graph) {
      return graph.session.analyst.whomToFollow(graph, {vertex: 128});
    }).then(function(pair) {
      assert(pair.first.name.startsWith('vertex_collection_sequence') &&
        pair.second.name.startsWith('vertex_collection_sequence'));
    });
  });
  it('whomToFollow with vertex using default should return a Pair', function() {
    return p.then(function(graph) {
      return graph.session.analyst.whomToFollow(graph, {vertex: v1});
    }).then(function(pair) {
      assert(pair.first.name.startsWith('vertex_collection_sequence') &&
        pair.second.name.startsWith('vertex_collection_sequence'));
    });
  });
  it('whomToFollow with vertex using name should return a Pair', function() {
    return p.then(function(graph) {
      return graph.session.analyst.whomToFollow(graph, {
        vertex: v1,
        topK: 90,
        sizeCircleOfTrust: 450,
        maxIterations: 100,
        tolerance: 0.001,
        dampingFactor: 0.85,
        salsaMaxIterations: 100,
        salsaTolerance: 0.001,
        hubsName: 'hubs',
        authoritiesName: 'authorities'
      });
    }).then(function(pair) {
      assert((pair.first.name === 'hubs') && (pair.second.name === 'authorities'));
    });
  });
  it('whomToFollow with vertex using collection should return a Pair', function() {
    let hubs;
    return p.then(function(graph) {
      return graph.createVertexSequence('newHubs');
    }).then(function(collection) {
      hubs = collection;
      return collection.graph.createVertexSequence('newAuthorities');
    }).then(function(authorities) {
      return authorities.graph.session.analyst.whomToFollow(authorities.graph, {
        vertex: v1,
        topK: 90,
        sizeCircleOfTrust: 450,
        maxIterations: 100,
        tolerance: 0.001,
        dampingFactor: 0.85,
        salsaMaxIterations: 100,
        salsaTolerance: 0.001,
        hubs: hubs,
        authorities: authorities
      });
    }).then(function(pair) {
      assert((pair.first.name === 'newHubs') && (pair.second.name === 'newAuthorities'));
    });
  });
  it('sccKosaraju with default should return a Partition', function() {
    return p.then(function(graph) {
      return graph.session.analyst.scc(graph);
    }).then(function(partition) {
      assert(partition.propertyName.startsWith('vertex_prop_long'));
    });
  });
  it('sccKosaraju with name should return a Partition', function() {
    return p.then(function(graph) {
      return graph.session.analyst.scc(graph, {
        variant: algorithmHelper.connectedComponentsVariant.KOSARAJU,
        partitionDistributionName: 'sccKosaraju'
      });
    }).then(function(partition) {
      assert(partition.propertyName === 'sccKosaraju');
    });
  });
  it('sccKosaraju with object should return a Partition', function() {
    return p.then(function(graph) {
      return graph.getVertexProperty('sccKosaraju');
    }).then(function(property) {
      return property.graph.session.analyst.scc(property.graph, {
        variant: algorithmHelper.connectedComponentsVariant.KOSARAJU,
        partitionDistribution: property
      });
    }).then(function(partition) {
      assert(partition.propertyName === 'sccKosaraju');
    });
  });
  it('sccTarjan with default should return a Partition', function() {
    return p.then(function(graph) {
      return graph.session.analyst.scc(graph, {variant: algorithmHelper.connectedComponentsVariant.TARJAN});
    }).then(function(partition) {
      assert(partition.propertyName.startsWith('vertex_prop_long'));
    });
  });
  it('sccTarjan with name should return a Partition', function() {
    return p.then(function(graph) {
      return graph.session.analyst.scc(graph, {
        variant: algorithmHelper.connectedComponentsVariant.TARJAN,
        partitionDistributionName: 'sccTarjan'
      });
    }).then(function(partition) {
      assert(partition.propertyName === 'sccTarjan');
    });
  });
  it('sccTarjan with object should return a Partition', function() {
    return p.then(function(graph) {
      return graph.getVertexProperty('sccTarjan');
    }).then(function(property) {
      return property.graph.session.analyst.scc(property.graph, {
        variant: algorithmHelper.connectedComponentsVariant.TARJAN,
        partitionDistribution: property
      });
    }).then(function(partition) {
      assert(partition.propertyName === 'sccTarjan');
    });
  });
  it('wcc with default should return a Partition', function() {
    return p.then(function(graph) {
      return graph.session.analyst.wcc(graph);
    }).then(function(partition) {
      assert(partition.propertyName.startsWith('vertex_prop_long'));
    });
  });
  it('wcc with name should return a Partition', function() {
    return p.then(function(graph) {
      return graph.session.analyst.wcc(graph, {partitionDistributionName: 'wcc'});
    }).then(function(partition) {
      assert(partition.propertyName === 'wcc');
    });
  });
  it('wcc with object should return a Partition', function() {
    return p.then(function(graph) {
      return graph.getVertexProperty('wcc');
    }).then(function(property) {
      return property.graph.session.analyst.wcc(property.graph, {partitionDistribution: property});
    }).then(function(partition) {
      assert(partition.propertyName === 'wcc');
    });
  });
  it('communitiesConductanceMinimization with default should return a Partition', function() {
    return p.then(function(graph) {
      return graph.session.analyst.communities(graph);
    }).then(function(partition) {
      assert(partition.propertyName.startsWith('vertex_prop_long'));
    });
  });
  it('communitiesConductanceMinimization with name should return a Partition', function() {
    return p.then(function(graph) {
      return graph.session.analyst.communities(graph, {
        variant: algorithmHelper.communitiesVariant.CONDUCTANCE_MINIMIZATION,
        maxIterations: 90,
        name: 'communitiesConductanceMinimization'
      });
    }).then(function(partition) {
      assert(partition.propertyName === 'communitiesConductanceMinimization');
    });
  });
  it('communitiesConductanceMinimization with prop should return a Partition', function() {
    return p.then(function(graph) {
      return graph.getVertexProperty('communitiesConductanceMinimization');
    }).then(function(property) {
      return property.graph.session.analyst.communities(property.graph, {
        variant: algorithmHelper.communitiesVariant.CONDUCTANCE_MINIMIZATION,
        maxIterations: 90,
        partitonDistribution: property
      });
    }).then(function(partition) {
      assert(partition.propertyName === 'communitiesConductanceMinimization');
    });
  });
  it('communitiesLabelPropagation with default should return a Partition', function() {
    return p.then(function(graph) {
      return graph.session.analyst.communities(graph, {variant: algorithmHelper.communitiesVariant.LABEL_PROPAGATION});
    }).then(function(partition) {
      assert(partition.propertyName.startsWith('vertex_prop_long'));
    });
  });
  it('communitiesLabelPropagation with name should return a Partition', function() {
    return p.then(function(graph) {
      return graph.session.analyst.communities(graph, {
        variant: algorithmHelper.communitiesVariant.LABEL_PROPAGATION,
        maxIterations: 90,
        name: 'communitiesLabelPropagation'
      });
    }).then(function(partition) {
      assert(partition.propertyName === 'communitiesLabelPropagation');
    });
  });
  it('communitiesLabelPropagation with prop should return a Partition', function() {
    return p.then(function(graph) {
      return graph.getVertexProperty('communitiesLabelPropagation');
    }).then(function(property) {
      return property.graph.session.analyst.communities(property.graph, {
        variant: algorithmHelper.communitiesVariant.LABEL_PROPAGATION,
        maxIterations: 90,
        partitonDistribution: property
      });
    }).then(function(partition) {
      assert(partition.propertyName === 'communitiesLabelPropagation');
    });
  });

  it('communitiesInfomap with default should return a Partition', function() {
    return p.then(function(graph) {
      return graph.session.analyst.pagerank(graph);
    }).then(function(property) {
      return property.graph.session.analyst.communities(property.graph, {
        rank: property,
        weight: e1,
        variant: algorithmHelper.communitiesVariant.INFOMAP
      });
    }).then(function(partition) {
      assert(partition.propertyName.startsWith('vertex_prop_long'));
    });
  });
  it('communitiesInfomap with name should return a Partition', function() {
    return p.then(function(graph) {
      return graph.session.analyst.pagerank(graph);
    }).then(function(property) {
      return property.graph.session.analyst.communities(property.graph, {
        rank: property,
        weight: e1,
        tau: 0.15,
        tol: 0.0001,
        maxIter: 10,
        name: 'infomapLabel',
        variant: algorithmHelper.communitiesVariant.INFOMAP
      });
    }).then(function(partition) {
      assert(partition.propertyName === 'infomapLabel');
    });
  });
  it('communitiesInfomap with prop should return a Partition', function() {
    let ranking;
    let labelProp;
    return p.then(function(graph) {
      return graph.session.analyst.pagerank(graph);
    }).then(function(property) {
      ranking = property;
      return property.graph.getVertexProperty('infomapLabel');
    }).then(function(property2) {
      return property2.graph.session.analyst.communities(property2.graph, {
        rank: ranking,
        weight: e1,
        tau: 0.15,
        tol: 0.0001,
        maxIter: 10,
        partitonDistribution: property2,
        variant: algorithmHelper.communitiesVariant.INFOMAP
      });
    }).then(function(partition) {
      assert(partition.propertyName === 'infomapLabel');
    });
  });

  it('diameter with default should return a Pair', function() {
    return p.then(function(graph) {
      return graph.session.analyst.diameter(graph);
    }).then(function(pair) {
      assert(pair.first.name.startsWith('scalar_integer') && pair.second.name.startsWith('vertex_prop_integer'));
    });
  });
  it('diameter with name should return a Pair', function() {
    return p.then(function(graph) {
      return graph.session.analyst.diameter(graph, {
        diameterName: 'diameter',
        eccentricityName: 'eccentricity'
      });
    }).then(function(pair) {
      assert((pair.first.name === 'diameter') && (pair.second.name === 'eccentricity'));
    });
  });
  it('diameter with objects should return a Pair', function() {
    let localProperty;
    return p.then(function(graph) {
      return graph.getVertexProperty('eccentricity');
    }).then(function(property) {
      localProperty = property;
      return localProperty.graph.createScalar('integer', 'newDiameter');
    }).then(function(scalar) {
      return scalar.graph.session.analyst.diameter(scalar.graph, {
        diameter: scalar,
        eccentricity: localProperty
      });
    }).then(function(pair) {
      assert((pair.first.name === 'newDiameter') && (pair.second.name === 'eccentricity'));
    });
  });

  it('radius with default should return a Pair', function() {
    return p.then(function(graph) {
      return graph.session.analyst.radius(graph);
    }).then(function(pair) {
      assert(pair.first.name.startsWith('scalar_integer') && pair.second.name.startsWith('vertex_prop_integer'));
    });
  });
  it('radius with name should return a Pair', function() {
    return p.then(function(graph) {
      return graph.session.analyst.radius(graph, {
        diameterName: 'radius',
        eccentricityName: 'newEccentricity'
      });
    }).then(function(pair) {
      assert((pair.first.name === 'radius') && (pair.second.name === 'newEccentricity'));
    });
  });
  it('radius with objects should return a Pair', function() {
    let localProperty;
    return p.then(function(graph) {
      return graph.getVertexProperty('newEccentricity');
    }).then(function(property) {
      localProperty = property;
      return localProperty.graph.createScalar('integer', 'newRadius');
    }).then(function(scalar) {
      return scalar.graph.session.analyst.radius(scalar.graph, {
        diameter: scalar,
        eccentricity: localProperty
      });
    }).then(function(pair) {
      assert((pair.first.name === 'newRadius') && (pair.second.name === 'newEccentricity'));
    });
  });

  it('periphery with default return a Vertex Set', function() {
    let collection;
    return p.then(function(graph) {
      return graph.session.analyst.periphery(graph);
    }).then(function(collection) {
      assert(collection.name.startsWith('vertex_collection_set'));
    });
  });
  it('periphery with name should return a Vertx Set', function() {
    return p.then(function(graph) {
      return graph.session.analyst.periphery(graph, {
        peripheryName: 'periphery'
      });
    }).then(function(collection) {
      assert(collection.name === 'periphery');
    });
  });
  it('periphery with objects should return a Vertex Set', function() {
    return p.then(function(graph) {
      return graph.createVertexSet('newPeriphery');
    }).then(function(collection) {
      return collection.graph.session.analyst.periphery(collection.graph, {
        periphery: collection
      });
    }).then(function(collection) {
      assert(collection.name === 'newPeriphery');
    });
  });

  it('center with default return a Vertex Set', function() {
    let collection;
    return p.then(function(graph) {
      return graph.session.analyst.center(graph);
    }).then(function(collection) {
      assert(collection.name.startsWith('vertex_collection_set'));
    });
  });
  it('center with name should return a Vertx Set', function() {
    return p.then(function(graph) {
      return graph.session.analyst.center(graph, {
        peripheryName: 'center'
      });
    }).then(function(collection) {
      assert(collection.name === 'center');
    });
  });
  it('center with objects should return a Vertex Set', function() {
    return p.then(function(graph) {
      return graph.createVertexSet('newcenter');
    }).then(function(collection) {
      return collection.graph.session.analyst.center(collection.graph, {
        periphery: collection
      });
    }).then(function(collection) {
      assert(collection.name === 'newcenter');
    });
  });

  it('local clustering coefficient with default should return a Property', function() {
    return p.then(function(graph) {
      return graph.session.analyst.localClusteringCoefficient(graph);
    }).then(function(property) {
      assert((property.name.startsWith('vertex_prop_double')) && (property.entityType === 'vertex'));
    });
  });
  it('local clustering coefficient with name should return a Property', function() {
    return p.then(function(graph) {
      return graph.session.analyst.localClusteringCoefficient(graph, {
        lccName: 'lcc'
      });
    }).then(function(property) {
      assert((property.name === 'lcc') && (property.entityType === 'vertex'));
    });
  });
  it('local clustering coefficient with objects should return a Property', function() {
    let localProperty;
    return p.then(function(graph) {
      return graph.getVertexProperty('lcc');
    }).then(function(property) {
      localProperty = property;
      return property.graph.session.analyst.localClusteringCoefficient(property.graph, {
        lcc: localProperty
      });
    }).then(function(property) {
      assert((localProperty.name === 'lcc') && (localProperty.entityType === 'vertex'));
    });
  });

  it('prim with default should return a Property', function() {
    return p.then(function(graph) {
      return graph.session.analyst.prim(graph, {
        weight: e1
      });
    }).then(function(property) {
      assert((property.name.startsWith('edge_prop_boolean')) && (property.entityType === 'edge'));
    });
  });
  it('prim with name should return a Property', function() {
    return p.then(function(graph) {
      return graph.session.analyst.prim(graph, {
        weight: e1,
        mstName: 'mst'
      });
    }).then(function(property) {
      assert((property.name === 'mst') && (property.entityType === 'edge'));
    });
  });
  it('prim with prop should return a Property', function() {
    return p.then(function(graph) {
      return graph.getEdgeProperty('mst');
    }).then(function(property) {
      return property.graph.session.analyst.prim(property.graph, {
        weight: e1,
        mst: property
      });
    }).then(function(property) {
      assert((property.name === 'mst') && (property.entityType === 'edge'));
    });
  });

  it('find cycle with default should return a Path', function() {
    return p.then(function(graph) {
      return graph.session.analyst.findCycle(graph);
    }).then(function(path) {
      assert((path.source === path.destination));
    });
  });
  it('find cycle with vertex and edge sequences should return a Path', function() {
    let nodeSeq;
    return p.then(function(graph) {
      return graph.createVertexSequence('newNodeSeq');
    }).then(function(collection) {
      nodeSeq = collection;
      return collection.graph.createEdgeSequence('newEdgeSeq');
    }).then(function(edgeSeq) {
      return edgeSeq.graph.session.analyst.findCycle(edgeSeq.graph, {
        nodeSeq: nodeSeq,
        edgeSeq: edgeSeq
      });
    }).then(function(path) {
      assert((path.source === path.destination));
    });
  });
  it('find cycle with vertex should return a Path', function() {
      return p.then(function(graph) {
        return graph.session.analyst.findCycle(graph, {
          vertex: 99
        });
      }).then(function(path) {
        assert((path.source === path.destination));
      });
  });

  it('reachability with ids, integer and boolean should return 1', function() {
    return p.then(function(graph) {
      return graph.session.analyst.reachability(graph, {
        source: 99,
        dest: 333,
        maxHops: 10,
        ignoreEdgeDirection: false
      });
    }).then(function(result) {
      assert.equal(1, result);
    });
  });
  it('reachability with objects, integer and boolean should return 2', function() {
    return p.then(function(graph) {
      return graph.session.analyst.reachability(graph, {
        source: v1,
        dest: v2,
        maxHops: 10,
        ignoreEdgeDirection: false
      });
    }).then(function(result) {
      assert.equal(2, result);
    });
  });
  it('reachability (undirected) with ids, integer and boolean should return 1', function() {
    return p.then(function(graph) {
      return graph.session.analyst.reachability(graph, {
        source: 99,
        dest: 333,
        maxHops: 10,
        ignoreEdgeDirection: true
      });
    }).then(function(result) {
      assert.equal(1, result);
    });
  });
  it('reachability (undirected) with objects, integer and boolean should return 1', function() {
    return p.then(function(graph) {
      return graph.session.analyst.reachability(graph, {
        source: v1,
        dest: v2,
        maxHops: 10,
        ignoreEdgeDirection: true
      });
    }).then(function(result) {
      assert.equal(1, result);
    });
  });

  it('topological sort with default should return a Property', function() {
    return p.then(function(graph) {
      return graph.session.analyst.topologicalSort(graph);
    }).then(function(property) {
      assert((property.name.startsWith('vertex_prop_integer')) && (property.entityType === 'vertex'));
    });
  });
  it('topological sort with name should return a Property', function() {
    return p.then(function(graph) {
      return graph.session.analyst.topologicalSort(graph, {
        topoOrderName: 'topoSort'
      });
    }).then(function(property) {
      assert((property.name === 'topoSort') && (property.entityType === 'vertex'));
    });
  });
  it('topological sort with objects should return a Property', function() {
    let localProperty;
    return p.then(function(graph) {
      return graph.getVertexProperty('topoSort');
    }).then(function(property) {
      localProperty = property;
      return property.graph.session.analyst.topologicalSort(property.graph, {
        topoOrder: localProperty
      });
    }).then(function(property) {
      assert((localProperty.name === 'topoSort') && (localProperty.entityType === 'vertex'));
    });
  });

  it('topological schedule with default should return a Property', function() {
    return p.then(function(graph) {
      return graph.createVertexSet();
    }).then(function(collection) {
      return collection.addAll([128, 333, 99, 1908]);
    }).then(function(collection) {
      return collection.graph.session.analyst.topologicalSort(collection.graph, {
        variant: algorithmHelper.topologicalSortVariant.SCHEDULE,
        source: collection
      });
    }).then(function(property) {
      assert((property.name.startsWith('vertex_prop_integer')) && (property.entityType === 'vertex'));
    });
  });
  it('topological schedule with source as vertexSet and name should return a Property', function() {
    return p.then(function(graph) {
      return graph.createVertexSet();
    }).then(function(collection) {
      return collection.addAll([128, 333, 99, 1908]);
    }).then(function(collection) {
      return collection.graph.session.analyst.topologicalSort(collection.graph, {
        variant: algorithmHelper.topologicalSortVariant.SCHEDULE,
        source: collection,
        topoOrderName: 'topoSched'
      });
    }).then(function(property) {
      assert((property.name === 'topoSched') && (property.entityType === 'vertex'));
    });
  });
  it('topological schedule with source as vertexSet and topoSched should return a Property', function() {
    let localCollection;
    return p.then(function(graph) {
      return graph.createVertexSet();
    }).then(function(collection) {
      return collection.addAll([128, 333, 99, 1908]);
    }).then(function(collection) {
      localCollection = collection;
      return collection.graph.getVertexProperty('topoSched');
    }).then(function(property) {
      return property.graph.session.analyst.topologicalSort(property.graph, {
        variant: algorithmHelper.topologicalSortVariant.SCHEDULE,
        source: localCollection,
        topoOrder: property
      });
    }).then(function(property) {
      assert((property.name === 'topoSched') && (property.entityType === 'vertex'));
    });
  });
});

after(function() {
  localSession.destroy().then(function(result) {
    p = null;
    vf = null;
    v1 = null;
    v2 = null;
    e1 = null;
    localSession = null;
  });
});