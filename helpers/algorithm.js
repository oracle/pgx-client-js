'use strict'

// services
const coreService = require('../services/core.js');

// classes
const graphClass = require('../classes/graph.js');
const propertyClass = require('../classes/property.js');
const mapClass = require('../classes/map.js');
const collectionClass = require('../classes/collection.js');
const pathClass = require('../classes/path.js');
const allPathsClass = require('../classes/allPaths.js');
const pairClass = require('../classes/pair.js');
const scalarClass = require('../classes/scalar.js');
const argumentBuilderClass = require('../classes/argumentBuilder.js');
const matrixFactorizationModelClass = require('../classes/matrixFactorizationModel.js');
const partitionClass = require('../classes/partition.js');
const vertexClass = require('../classes/vertex.js');
const vertexFilter = require('../classes/filters/vertexFilter.js');
const edgeStrategy = require('../classes/edgeStrategy.js')

// helpers
const common = require('../helpers/common.js');

const algorithms = {
  closenessCentralityUnit: 'pgx_builtin_k4a_closeness_centrality_unit_length',
  closenessCentralityDouble: 'pgx_builtin_k4b_closeness_centrality_double_length',
  outDegreeCentrality: 'pgx_builtin_k7a_outdegree_centrality',
  inDegreeCentrality: 'pgx_builtin_k7b_indegree_centrality',
  degreeCentrality: 'pgx_builtin_k7c_degree_centrality',
  outDegreeDistribution: 'pgx_builtin_s6_out_degree_distribution',
  inDegreeDistribution: 'pgx_builtin_s7_in_degree_distribution',
  dijkstra: 'pgx_builtin_p1a_single_source_single_destination_dijkstra',
  dijkstraFiltered: 'pgx_builtin_p1b_single_source_single_destination_filtered_dijkstra',
  bidirectionalDijkstra: 'pgx_builtin_p2_single_source_single_destination_bidirectional_dijkstra',
  bidirectionalDijkstraFiltered: 'pgx_builtin_p2b_single_source_single_destination_filtered_bidirectional_dijkstra',
  eigenvectorCentrality: 'pgx_builtin_k6_eigenvector_centrality',
  fattestPath: 'pgx_builtin_p5_fattest_path',
  filteredBfs: 'pgx_builtin_o1_filtered_bfs',
  hits: 'pgx_builtin_k5_hits',
  kcore: 'pgx_builtin_s9_kcore',
  matrixFactorizationTraining: 'pgx_builtin_r2a_matrix_factorization_training',
  matrixFactorizationRecommendations: 'pgx_builtin_r2b_matrix_factorization_recommendations',
  pagerank: 'pgx_builtin_k1a_pagerank',
  weightedPagerank: 'pgx_builtin_k1c_pagerank_weighted',
  pagerankApproximate: 'pgx_builtin_k1b_pagerank_approximate',
  personalizedPagerank: 'pgx_builtin_k2_personalized_pagerank',
  personalizedPagerankFromSet: 'pgx_builtin_k2b_personalized_pagerank_from_set',
  personalizedWeightedPagerank: 'pgx_builtin_k2c_personalized_weighted_pagerank',
  personalizedWeightedPagerankFromSet: 'pgx_builtin_k2d_personalized_weighted_pagerank_from_set',
  bellmanFord: 'pgx_builtin_p3_single_source_all_destinations_bellman_ford',
  bellmanFordReverse: 'pgx_builtin_p3r_single_source_all_destinations_bellman_ford_reverse',
  hopDistance: 'pgx_builtin_p4_single_source_all_destinations_hop_distance',
  hopDistanceReverse: 'pgx_builtin_p4r_single_source_all_destinations_hop_distance_reverse',
  stronglyConnectedComponentsKosaraju: 'pgx_builtin_g2a_strongly_connected_components_kosaraju',
  stronglyConnectedComponentsTarjan: 'pgx_builtin_g2b_strongly_connected_components_tarjan',
  triangleCounting: 'pgx_builtin_s1_triangle_counting',
  betweennessCentrality: 'pgx_builtin_k3a_node_betweenness_centrality',
  approxBetweennessCentrality: 'pgx_builtin_k3b_approx_node_betweenness_centrality',
  betweennessCentralityFromSeeds : 'pgx_builtin_k3c_approx_node_betweenness_centrality_from_seeds',
  weaklyConnectedComponents: 'pgx_builtin_g3_weakly_connected_components',
  adamicAdarCounting: 'pgx_builtin_s2_adamic_adar_counting',
  communityConductanceMinimization: 'pgx_builtin_c2_community_detection_conductance_minimization',
  communityLabelPropagation: 'pgx_builtin_c1_community_detection_label_propagation',
  communityInfomap: 'pgx_builtin_c3_infomap',
  conductance: 'pgx_builtin_s3_conductance',
  partitionConductance: 'pgx_builtin_s5_partition_conductance',
  partitionModularity: 'pgx_builtin_s4_partition_modularity',
  randomWalkWithRestart: 'pgx_builtin_k8_random_walk_with_restart',
  salsa: 'pgx_builtin_r1b_salsa',
  personalizedSalsa: 'pgx_builtin_r2_personalized_salsa',
  personalizedSalsaFromSet: 'pgx_builtin_r3_personalized_salsa_from_set',
  bipartiteCheck: 'pgx_builtin_s10_bipartite_check',
  diameter: 'pgx_builtin_s11_diameter',
  periphery: 'pgx_builtin_s12_periphery',
  localClusteringCoefficient: 'pgx_builtin_s13_local_clustering_coefficient',
  prim: 'pgx_builtin_a1_prim',
  whomToFollow: 'pgx_builtin_l1_whom_to_follow',
  findCycle: 'pgx_builtin_s14a_find_cycle',
  findCycleFromNode: 'pgx_builtin_s14b_find_cycle_from_node',
  reachability: 'pgx_builtin_s15a_reachability',
  reachabilityUndirected: 'pgx_builtin_s15b_reachability_undirected',
  topologicalSort: 'pgx_builtin_s16a_topological_sort',
  topologicalSchedule: 'pgx_builtin_s16b_topological_schedule'
};

const matrixFactorizationDefault = {
  weight: null,
  learningRate: 0.1,
  changePerStep: 0.9,
  lambda: 0.1,
  maxStep: 100,
  vectorLength: 20,
  features: null,
  featuresName: null
};

const salsaVariant = {
  DEFAULT: 'salsa',
  PERSONALIZED: 'personalizedSalsa'
};

const salsaDefault = {
  variant: salsaVariant.DEFAULT,
  vertices: null,
  d: 0.85,
  maxIterations: 100,
  maxDiff: 0.001,
  salsaRank: null,
  salsaRankName: null
};

const whomToFollowDefault = {
  vertex: null,
  topK: 100,
  sizeCircleOfTrust: 500,
  maxIterations: 100,
  tolerance: 0.001,
  dampingFactor: 0.85,
  salsaMaxIterations: 100,
  salsaTolerance: 0.001,
  hubs: null,
  authorities: null,
  hubsName: null,
  authoritiesName: null
};

const pagerankVariant = {
  DEFAULT: 'pagerank',
  APPROXIMATE: 'pagerankApproximate',
  WEIGHTED: 'weightedPagerank',
  PERSONALIZED: 'personalizedPagerank',
  PERSONALIZED_WEIGHTED: 'personalizedWeightedPagerank'
};

const pagerankDefault = {
  e: 0.001,
  d: 0.85,
  max: 100,
  norm: false,
  rank: null,
  name: null,
  variant: pagerankVariant.DEFAULT,
  weight: null,
  vertices: null
};

const betweennessCentralityVariant = {
  FULL: 'betweennessCentrality',
  APPROXIMATE: 'approxBetweennessCentrality'
};

const betweennessCentralityDefault = {
  bc: null,
  name: null,
  variant: betweennessCentralityVariant.FULL,
  numRandomSeeds: 5,
  seeds: null
};

const closenessCentralityVariant = {
  DEFAULT: 'closenessCentralityUnit',
  WEIGHTED: 'closenessCentralityDouble'
};

const closenessCentralityDefault = {
  cc: null,
  name: null,
  variant: closenessCentralityVariant.DEFAULT,
  cost: null
};

const hitsDefault = {
  max: 100,
  hubs: null,
  auth: null,
  hubsName: null,
  authName: null
};

const eigenvectorDefault = {
  max: 100,
  maxDiff: 0.001,
  useL2Norm: false,
  useInEdge: false,
  ec: null,
  name: null
};

const degreeCentralityVariant = {
  BOTH: 'degreeCentrality',
  IN: 'inDegreeCentrality',
  OUT: 'outDegreeCentrality'
};

const degreeCentralityDefault = {
  direction: degreeCentralityVariant.BOTH,
  dc: null,
  name: null
};

const adamicAdarCountingDefault = {
  aa: null,
  name: null
};

const communitiesVariant = {
  CONDUCTANCE_MINIMIZATION: 'communityConductanceMinimization',
  LABEL_PROPAGATION: 'communityLabelPropagation',
  INFOMAP: 'communityInfomap'
};

const communitiesDefault = {
  variant: communitiesVariant.CONDUCTANCE_MINIMIZATION,
  rank: null,
  weight: null,
  tau: 0.15,
  tol: 0.0001,
  maxIterations: 100,
  partitonDistribution: null,
  name: null
};

const conductanceDefault = {
  partition: null,
  partitionIndex: null,
  conductance: null,
  minConductance: null,
  conductanceName: null,
  minConductanceName: null
};

const partitionModularityDefault = {
  partition: null,
  modularity: null,
  modularityName: null
};

const connectedComponentsVariant = {
  KOSARAJU: 'stronglyConnectedComponentsKosaraju',
  TARJAN: 'stronglyConnectedComponentsTarjan'
};

const connectedComponentsDefault = {
  variant: connectedComponentsVariant.KOSARAJU,
  partitionDistribution: null,
  partitionDistributionName: null
};

const wccDefault = {
  partitionDistribution: null,
  partitionDistributionName: null
};

const shortestPathVariant = {
  FORWARD: 0,
  REVERSE: 1
};

const shortestPathDefault = {
  src: null,
  cost: null,
  traversalDirection: shortestPathVariant.FORWARD,
  distance: null,
  parent: null,
  parentEdge: null,
  distanceName: null,
  parentName: null,
  parentEdgeName: null
};

const fattestDefault = {
  root: null,
  capacity: null,
  distance: null,
  parent: null,
  parentEdge: null,
  distanceName: null,
  parentName: null,
  parentEdgeName: null
};

const dijkstraVariant = {
  CLASSICAL: 'dijkstra',
  BIDIRECTIONAL: 'bidirectionalDijkstra'
};

const dijkstraDefault = {
  src: null,
  dst: null,
  cost: null,
  variant: dijkstraVariant.BIDIRECTIONAL,
  parent: null,
  parentEdge: null,
  parentName: null,
  parentEdgeName: null,
  filterExpr: null
};

const kcoreDefault = {
  minCore: 0,
  maxCore: 2147483647, // in java is Integer.MAX_VALUE
  maxKCore: null,
  kcore: null,
  maxKCoreName: null,
  kcoreName: null
};

const degreeDistributionVariant = {
  IN: 'inDegreeDistribution',
  OUT: 'outDegreeDistribution'
};

const degreeDistributionDefault = {
  degree: degreeDistributionVariant.IN,
  distribution: null,
  distributionName: null
};

const filteredBfsDefault = {
  initWithInfinity: true,
  root: null,
  filter: new vertexFilter('true'),
  navigator: new vertexFilter('true'),
  distance: null,
  parent: null,
  distanceName: null,
  parentName: null
};

const diameterDefault = {
  diameter: null,
  eccentricity: null,
  diameterName: null,
  eccentricityName: null,
  diameterOn: true
};

const peripheryDefault = {
  periphery: null,
  peripheryName: null,
  peripheryOn: true
};

const localClusteringCoefficientDefault = {
  lcc: null,
  lccName: null,
};

const primDefault = {
  mst: null,
  mstName: null,
  weight: null
}

const findCycleVariant = {
  DEFAULT: 'findCycle',
  FROM_NODE: 'findCycleFromNode'
};

const findCycleDefault = {
  variant: findCycleVariant.DEFAULT,
  vertex: null,
  nodeSequence: null,
  nodeSequenceName: null,
  edgeSequence: null,
  edgeSequenceName: null
};

const reachabilityDefault = {
  source: null,
  dest: null
};

const topologicalSortVariant = {
  DEFAULT: 'topologicalSort',
  SCHEDULE: 'topologicalSchedule'
};

const topologicalSortDefault = {
  variant: topologicalSortVariant.DEFAULT,
  source: null,
  topoOrder: null,
  topoOrderName: null
};

module.exports.closenessCentrality = function (graph, options) {
  let finalOptions = common.getOptions(closenessCentralityDefault, options);
  let propertyJson = {
    'entityType': 'vertex',
    'type': 'double',
    'name': finalOptions.name,
    'hardName': finalOptions.name === null ? true : false,
    'dimension': 0
  };
  let doubleJson = {
    'type': 'EDGE_PROPERTY',
    'value': finalOptions.cost instanceof propertyClass ? finalOptions.cost.name : finalOptions.cost
  };
  let localProperty;
  return getDefaultProperty(graph, propertyJson, finalOptions.cc).then(function(property) {
    localProperty = property;
     let analysisJson = new argumentBuilderClass('ANALYSIS_POOL', 'boolean')
       .addGraphArg(graph.name)
       .addNodePropertyArg(localProperty.name).build();
     if (finalOptions.variant === closenessCentralityVariant.WEIGHTED) {
       analysisJson.args.splice(1, 0, doubleJson);
     }
    return coreService.postAnalysis(graph, analysisJson, algorithms[finalOptions.variant]);
  }).then(function(result) {
    return localProperty;
  });
}

module.exports.degreeCentrality = function (graph, options) {
  let finalOptions = common.getOptions(degreeCentralityDefault, options);
  let propertyJson = {
    'entityType': 'vertex',
    'type': 'integer',
    'name': finalOptions.name,
    'hardName': finalOptions.name === null ? true : false,
    'dimension': 0
  };
  let localProperty;
  return getDefaultProperty(graph, propertyJson, finalOptions.dc).then(function(property) {
    localProperty = property;
    let analysisJson = new argumentBuilderClass('ANALYSIS_POOL', 'void')
      .addGraphArg(graph.name)
      .addNodePropertyArg(localProperty.name).build();
    return coreService.postAnalysis(graph, analysisJson, algorithms[finalOptions.direction]);
  }).then(function(result) {
    return localProperty;
  });
}

module.exports.degreeDistribution = function (graph, options) {
  let finalOptions = common.getOptions(degreeDistributionDefault, options);
  let mapJson = {
    'keyType': 'integer',
    'valType': 'long',
    'mapName': finalOptions.distributionName
  };
  let distribution;
  return getDefaultMap(graph, mapJson, finalOptions.distribution).then(function(map) {
    distribution = map;
    let analysisJson = new argumentBuilderClass('FAST_TRACK_ANALYSIS_POOL', 'void')
      .addGraphArg(graph.name)
      .addMapArg(distribution.name).build();
    return coreService.postAnalysis(graph, analysisJson, algorithms[finalOptions.degree]);
  }).then(function(result) {
    return distribution;
  });
}

module.exports.shortestPathDijkstra = function (graph, options) {
  let finalOptions = common.getOptions(dijkstraDefault, options);
  let type = finalOptions.variant;
  let rootId = finalOptions.src instanceof vertexClass ? finalOptions.src.id : finalOptions.src;
  let destId = finalOptions.dst instanceof vertexClass ? finalOptions.dst.id : finalOptions.dst;
  let costName = finalOptions.cost instanceof propertyClass ? finalOptions.cost.name : finalOptions.cost;
  let parentJson = {
    'entityType': 'vertex',
    'type': 'vertex',
    'name': finalOptions.parentName,
    'hardName': finalOptions.parentName === null ? true : false,
    'dimension': 0
  };
  let parentEdgeJson = {
    'entityType': 'vertex',
    'type': 'edge',
    'name': finalOptions.parentEdgeName,
    'hardName': finalOptions.parentEdgeName === null ? true : false,
    'dimension': 0
  };
  let parent;
  let parentEdge;
  return getDefaultProperty(graph, parentJson, finalOptions.parent).then(function(property) {
    parent = property;
    return getDefaultProperty(graph, parentEdgeJson, finalOptions.parentEdge);
  }).then(function(property) {
    parentEdge = property;
    let analysisJson = new argumentBuilderClass('FAST_TRACK_ANALYSIS_POOL', 'boolean')
      .addGraphArg(graph.name)
      .addEdgePropertyArg(costName)
      .addNodeIdInArg(rootId)
      .addNodeIdInArg(destId)
      .addNodePropertyArg(parent.name)
      .addNodePropertyArg(parentEdge.name).build();
    if (finalOptions.filterExpr != null) {
      let filterJson = {
        'type': 'PATH_FINDING_FILTER',
        'value': {
          'type': finalOptions.filterExpr.type,
          'filterExpression': finalOptions.filterExpr.filterExpression,
          'binaryOperation': finalOptions.filterExpr.binaryOperation
        }
      };
      analysisJson.args.splice(4, 0, filterJson);
      type = type + 'Filtered';
    }
    return coreService.postAnalysis(graph, analysisJson, algorithms[type]);
  }).then(function(result) {
    let pathJson = {
      'src': new argumentBuilderClass().setType('integer').setValue(rootId).build(),
      'costName': costName,
      'parentName': parent.name,
      'parentEdgeName': parentEdge.name,
      'dst': new argumentBuilderClass().setType('integer').setValue(destId).build()
    };
    return coreService.postPath(graph, pathJson);
  }).then(function(result) {
    return new pathClass(rootId, destId, result, graph);
  });
}

module.exports.eigenvectorCentrality = function (graph, options) {
  let finalOptions = common.getOptions(eigenvectorDefault, options);
  let propertyJson = {
    'entityType': 'vertex',
    'type': 'double',
    'name': finalOptions.name,
    'hardName': finalOptions.name === null ? true : false,
    'dimension': 0
  };
  let localProperty;
  return getDefaultProperty(graph, propertyJson, finalOptions.ec).then(function(property) {
    localProperty = property;
    let analysisJson = new argumentBuilderClass('ANALYSIS_POOL', 'void')
      .addGraphArg(graph.name)
      .addIntInArg(finalOptions.max)
      .addDoubleInArg(finalOptions.maxDiff)
      .addBoolInArg(finalOptions.useL2Norm)
      .addBoolInArg(finalOptions.useInEdge)
      .addNodePropertyArg(localProperty.name).build();
    return coreService.postAnalysis(graph, analysisJson, algorithms.eigenvectorCentrality);
  }).then(function(result) {
    return localProperty;
  });
}

module.exports.fattestPath = function (graph, options) {
  let finalOptions = common.getOptions(fattestDefault, options);
  let rootId = finalOptions.root instanceof vertexClass ? finalOptions.root.id : finalOptions.root;
  let capName = finalOptions.capacity instanceof propertyClass ? finalOptions.capacity.name : finalOptions.capacity;
  let distJson = {
    'entityType': 'vertex',
    'type': 'double',
    'name': finalOptions.distanceName,
    'hardName': finalOptions.distanceName === null ? true : false,
    'dimension': 0
  };
  let parentJson = {
    'entityType': 'vertex',
    'type': 'vertex',
    'name': finalOptions.parentName,
    'hardName': finalOptions.parentName === null ? true : false,
    'dimension': 0
  };
  let parentEdgeJson = {
    'entityType': 'vertex',
    'type': 'edge',
    'name': finalOptions.parentEdgeName,
    'hardName': finalOptions.parentEdgeName === null ? true : false,
    'dimension': 0
  };
  let dist;
  let parent;
  let parentEdge;
  return getDefaultProperty(graph, distJson, finalOptions.distance).then(function(property) {
    dist = property;
    return getDefaultProperty(graph, parentJson, finalOptions.parent);
  }).then(function(property) {
    parent = property;
    return getDefaultProperty(graph, parentEdgeJson, finalOptions.parentEdge);
  }).then(function(property) {
    parentEdge = property;
    let analysisJson = new argumentBuilderClass('FAST_TRACK_ANALYSIS_POOL', 'void')
      .addGraphArg(graph.name)
      .addEdgePropertyArg(capName)
      .addNodeIdInArg(rootId)
      .addNodePropertyArg(parent.name)
      .addNodePropertyArg(parentEdge.name)
      .addNodePropertyArg(dist.name).build();
    return coreService.postAnalysis(graph, analysisJson, algorithms.fattestPath);
  }).then(function(result) {
    let allPathsJson = {
      'src': new argumentBuilderClass().setType('integer').setValue(rootId).build(),
      'costName': capName,
      'parentName': parent.name,
      'parentEdgeName': parentEdge.name
    };
    return coreService.postAllPaths(graph, allPathsJson);
  }).then(function(result) {
    return new allPathsClass(rootId, result.proxyId, graph);
  });
}

module.exports.filteredBfs = function (graph, options) {
  let finalOptions = common.getOptions(filteredBfsDefault, options);
  let rootId = finalOptions.root instanceof vertexClass ? finalOptions.root.id : finalOptions.root;
  let distJson = {
    'entityType': 'vertex',
    'type': 'integer',
    'name': finalOptions.distanceName,
    'hardName': finalOptions.distanceName === null ? true : false,
    'dimension': 0
  };
  let parentJson = {
    'entityType': 'vertex',
    'type': 'vertex',
    'name': finalOptions.parentName,
    'hardName': finalOptions.parentName === null ? true : false,
    'dimension': 0
  };
  let filterJson = {
    "type": "GENERIC_FILTER",
    "value": {
      "type": finalOptions.filter.type,
      "filterExpression": finalOptions.filter.filterExpression,
      "binaryOperation": finalOptions.filter.binaryOperation
    }
  };
  let navigatorJson = {
    "type": "GENERIC_FILTER",
    "value": {
      "type": finalOptions.navigator.type,
      "filterExpression": finalOptions.navigator.filterExpression,
      "binaryOperation": finalOptions.navigator.binaryOperation
    }
  };
  let dist;
  let parent;
  return getDefaultProperty(graph, distJson, finalOptions.distance).then(function(property) {
    dist = property;
    return getDefaultProperty(graph, parentJson, finalOptions.parent);
  }).then(function(property) {
    parent = property;
    let analysisJson = new argumentBuilderClass('ANALYSIS_POOL', 'void')
      .addGraphArg(graph.name)
      .addNodeIdInArg(rootId)
      .addBoolInArg(finalOptions.initWithInfinity)
      .addNodePropertyArg(dist.name)
      .addNodePropertyArg(parent.name).build();
    analysisJson.args.splice(3, 0, filterJson);
    analysisJson.args.splice(4, 0, navigatorJson);
    return coreService.postAnalysis(graph, analysisJson, algorithms.filteredBfs);
  }).then(function(result) {
    return new pairClass(dist, parent);
  });
}

module.exports.hits = function (graph, options) {
  let finalOptions = common.getOptions(hitsDefault, options);
  let authJson = {
    'entityType': 'vertex',
    'type': 'double',
    'name': finalOptions.authName,
    'hardName': finalOptions.authName === null ? true : false,
    'dimension': 0
  };
  let hubsJson = {
    'entityType': 'vertex',
    'type': 'double',
    'name': finalOptions.hubsName,
    'hardName': finalOptions.hubsName === null ? true : false,
    'dimension': 0
  };
  let auth;
  let hubs;
  return getDefaultProperty(graph, authJson, finalOptions.auth).then(function(property) {
    auth = property;
    return getDefaultProperty(graph, hubsJson, finalOptions.hubs);
  }).then(function(property) {
    hubs = property;
    let analysisJson = new argumentBuilderClass('ANALYSIS_POOL', 'void')
      .addGraphArg(hubs.graph.name)
      .addIntInArg(finalOptions.max)
      .addNodePropertyArg(auth.name)
      .addNodePropertyArg(hubs.name).build();
    return coreService.postAnalysis(hubs.graph, analysisJson, algorithms.hits);
  }).then(function(result) {
    return new pairClass(auth, hubs);
  });
}

module.exports.kcore = function (graph, options) {
  let finalOptions = common.getOptions(kcoreDefault, options);
  let kcoreJson = {
    'entityType': 'vertex',
    'type': 'long',
    'name': finalOptions.kcoreName,
    'hardName': finalOptions.kcoreName === null ? true : false,
    'dimension': 0
  };
  let maxKCoreJson = {
    'type': 'long',
    'scalarName': finalOptions.maxKCoreName,
    'dimension': 0
  };
  let kcoreProperty;
  let maxKCore;
  return getDefaultProperty(graph, kcoreJson, finalOptions.kcore).then(function(property) {
    kcoreProperty = property;
    return getDefaultScalar(graph, maxKCoreJson, finalOptions.maxKCore);
  }).then(function(scalar) {
    maxKCore = scalar;
    let analysisJson = new argumentBuilderClass('ANALYSIS_POOL', 'long')
      .addGraphArg(graph.name)
      .addLongInArg(finalOptions.minCore)
      .addLongInArg(finalOptions.maxCore)
      .addNodePropertyArg(kcoreProperty.name).build();
    return coreService.postAnalysis(graph, analysisJson, algorithms.kcore);
  }).then(function(result) {
    return maxKCore.set(result.returnValue);
  }).then(function(scalar) {
    return new pairClass(scalar, kcoreProperty);
  });
}

module.exports.matrixFactorizationGradientDescent = function (graph, options) {
  let finalOptions = common.getOptions(matrixFactorizationDefault, options);
  let weightPropertyName = finalOptions.weight instanceof propertyClass ? finalOptions.weight.name :
    finalOptions.weight;
  let featuresJson = {
    'entityType': 'vertex',
    'type': 'double',
    'name': finalOptions.featuresName,
    'hardName': finalOptions.featuresName === null ? true : false,
    'dimension': finalOptions.vectorLength
  };
  let leftProperty;
  let featuresProperty;
  return graph.isLeftProperty.then(function(property) {
    leftProperty = property;
    return getDefaultProperty(graph, featuresJson, finalOptions.features);
  }).then(function(property) {
    featuresProperty = property;
    let analysisJson = new argumentBuilderClass('ANALYSIS_POOL', 'double')
      .addGraphArg(graph.name)
      .addNodePropertyArg(leftProperty.name)
      .addEdgePropertyArg(weightPropertyName)
      .addDoubleInArg(finalOptions.learningRate)
      .addDoubleInArg(finalOptions.changePerStep)
      .addDoubleInArg(finalOptions.lambda)
      .addIntInArg(finalOptions.maxStep)
      .addIntInArg(finalOptions.vectorLength)
      .addNodePropertyArg(featuresProperty.name).build();
    return coreService.postAnalysis(graph, analysisJson, algorithms.matrixFactorizationTraining);
  }).then(function(result) {
    return new matrixFactorizationModelClass(featuresProperty, result.returnValue, graph);
  });
}

module.exports.matrixFactorizationRecommendations = function (graph, features, vertex) {
  let propertyJson = {
    'entityType': 'vertex',
    'type': 'double',
    'name': null,
    'hardName': true,
    'dimension': 0
  };
  let leftProperty;
  let rating;
  return graph.isLeftProperty.then(function(property) {
    leftProperty = property;
    return coreService.postProperty(graph, propertyJson);
  }).then(function(property) {
    rating = new propertyClass(property, graph);
    let analysisJson = new argumentBuilderClass('ANALYSIS_POOL', 'void')
      .addGraphArg(graph.name)
      .addNodeIdInArg(vertex.id)
      .addNodePropertyArg(leftProperty.name)
      .addIntInArg(features.dimension)
      .addNodePropertyArg(features.name)
      .addNodePropertyArg(rating.name).build();
    return coreService.postAnalysis(graph, analysisJson, algorithms.matrixFactorizationRecommendations);
  }).then(function(result) {
    return rating;
  });
}

function getDefaultProperty(graph, propertyJson, property) {
  return new Promise(
    function(resolve, reject) {
      if (property == null) {
        coreService.postProperty(graph, propertyJson).then(function(property) {
          resolve(new propertyClass(property, graph));
        }, function(err) {
          reject(err);
        });
      } else if (property instanceof propertyClass) {
        resolve(property);
      }
  });
}

function getDefaultScalar(graph, scalarJson, scalar) {
  return new Promise(
    function(resolve, reject) {
      if (scalar == null) {
        coreService.postScalar(graph, scalarJson).then(function(scalarName) {
          resolve(new scalarClass(scalarName, scalarJson.type, scalarJson.dimension, graph));
        }, function(err) {
          reject(err);
        });
      } else if (scalar instanceof scalarClass) {
        resolve(scalar);
      }
  });
}

function getDefaultMap(graph, mapJson, map) {
  return new Promise(
    function(resolve, reject) {
      if (map == null) {
        coreService.postMap(graph, mapJson).then(function(mapName) {
          resolve(new mapClass(mapName, mapJson.keyType, mapJson.valType, graph));
        }, function(err) {
          reject(err);
        });
      } else if (map instanceof mapClass) {
        resolve(map);
      }
  });
}

function getDefaultCollection(graph, collJson, coll) {
  return new Promise(
    function(resolve, reject) {
      if (coll == null) {
        coreService.postCollection(graph, collJson).then(function(collName) {
          resolve(new collectionClass(collName, collJson.elementType, collJson.type, graph));
        }, function(err) {
          reject(err);
        });
      } else if (coll instanceof collectionClass) {
        resolve(coll);
      }
  });
}

module.exports.pagerank = function (graph, options) {
  let finalOptions = common.getOptions(pagerankDefault, options);
  let type = finalOptions.variant;
  let obj;
  let obj2;
  if (type === pagerankVariant.WEIGHTED) {
    obj = finalOptions.weight;
  } else if (type === pagerankVariant.PERSONALIZED) {
    obj = finalOptions.vertices;
  } else if (type === pagerankVariant.PERSONALIZED_WEIGHTED) {
    obj = finalOptions.vertices;
    obj2 = finalOptions.weight;
  }
  let objId = obj;
  if ((obj instanceof propertyClass) || (obj instanceof collectionClass)) {
    objId = obj.name;
  } else if (obj instanceof vertexClass) {
    objId = obj.id;
  }
  let obj2Id = obj2;
  if ((obj2 instanceof propertyClass) || (obj2 instanceof collectionClass)) {
    obj2Id = obj2.name;
  } else if (obj2 instanceof vertexClass) {
    obj2Id = obj2.id;
  }
  let propertyJson = {
    'entityType': 'vertex',
    'type': 'double',
    'name': finalOptions.name,
    'hardName': finalOptions.name === null ? true : false,
    'dimension': 0
  };
  let localProperty;
  return getDefaultProperty(graph, propertyJson, finalOptions.rank).then(function(property) {
    localProperty = property;
    let analysisJson = new argumentBuilderClass('ANALYSIS_POOL', 'void')
      .addGraphArg(graph.name)
      .addDoubleInArg(finalOptions.e)
      .addDoubleInArg(finalOptions.d)
      .addIntInArg(finalOptions.max)
      .addNodePropertyArg(localProperty.name).build();
    if (type !== pagerankVariant.APPROXIMATE) {
      analysisJson.args.splice(4, 0, new argumentBuilderClass().setType("BOOL_IN").setValue(finalOptions.norm).build());
    }
    if (type === pagerankVariant.PERSONALIZED) {
      if (obj instanceof collectionClass) {
        analysisJson.args.splice(1, 0, new argumentBuilderClass().setType("COLLECTION").setValue(objId).build());
        type = type + 'FromSet';
      } else {
        analysisJson.args.splice(1, 0, new argumentBuilderClass().setType("NODE_ID_IN").setValue(objId).build());
      }
    }
    if (type === pagerankVariant.WEIGHTED) {
      analysisJson.args.splice(5, 0, new argumentBuilderClass().setType("EDGE_PROPERTY").setValue(objId).build());
    }
    if (type === pagerankVariant.PERSONALIZED_WEIGHTED) {
      if (obj instanceof collectionClass) {
        analysisJson.args.splice(1, 0, new argumentBuilderClass().setType("COLLECTION").setValue(objId).build());
        type = type + 'FromSet';
      } else {
        analysisJson.args.splice(1, 0, new argumentBuilderClass().setType("NODE_ID_IN").setValue(objId).build());
      }
      analysisJson.args.splice(6, 0, new argumentBuilderClass().setType("EDGE_PROPERTY").setValue(obj2Id).build());
    }
    return coreService.postAnalysis(graph, analysisJson, algorithms[type]);
  }).then(function(result) {
    return localProperty;
  });
}

module.exports.shortestPath = function (type, graph, options) {
  let finalOptions = common.getOptions(shortestPathDefault, options);
  let localType = type;
  if (finalOptions.variant === shortestPathVariant.REVERSE) {
    localType = localType + 'Reverse';
  }
  let rootId = finalOptions.src instanceof vertexClass ? finalOptions.src.id : finalOptions.src;
  let costName = null; // null is used by hopDist
  let distJson = {
    'entityType': 'vertex',
    'type': 'double',
    'name': finalOptions.distanceName,
    'hardName': finalOptions.distanceName === null ? true : false,
    'dimension': 0
  };
  let parentJson = {
    'entityType': 'vertex',
    'type': 'vertex',
    'name': finalOptions.parentName,
    'hardName': finalOptions.parentName === null ? true : false,
    'dimension': 0
  };
  let parentEdgeJson = {
    'entityType': 'vertex',
    'type': 'edge',
    'name': finalOptions.parentEdgeName,
    'hardName': finalOptions.parentEdgeName === null ? true : false,
    'dimension': 0
  };
  let dist;
  let parent;
  let parentEdge;
  return getDefaultProperty(graph, distJson, finalOptions.distance).then(function(property) {
    dist = property;
    return getDefaultProperty(graph, parentJson, finalOptions.parent);
  }).then(function(property) {
    parent = property;
    return getDefaultProperty(graph, parentEdgeJson, finalOptions.parentEdge);
  }).then(function(property) {
    parentEdge = property;
    let analysisJson = new argumentBuilderClass('ANALYSIS_POOL', 'void')
      .addGraphArg(graph.name)
      .addNodeIdInArg(rootId)
      .addNodePropertyArg(dist.name)
      .addNodePropertyArg(parent.name)
      .addNodePropertyArg(parentEdge.name).build();
    if (localType.startsWith('bellmanFord')) {
      costName = finalOptions.cost instanceof propertyClass ? finalOptions.cost.name : finalOptions.cost;
      analysisJson.args.splice(1, 0, {'type': 'EDGE_PROPERTY', 'value': costName});
    }
    return coreService.postAnalysis(graph, analysisJson, algorithms[localType]);
  }).then(function(result) {
    let allPathsJson = {
      'src': new argumentBuilderClass().setType('integer').setValue(rootId).build(),
      'costName': costName,
      'distName': dist.name,
      'parentName': parent.name,
      'parentEdgeName': parentEdge.name
    };
    return coreService.postAllPaths(graph, allPathsJson);
  }).then(function(result) {
    return new allPathsClass(rootId, result.proxyId, graph);
  });
}

module.exports.countTriangles = function (graph, sortByDegree) {
  let undirectStrategy = {
      'vertexPropNames': [],
      'edgePropNames': [],
      'inPlace': false,
      'newGraphName': null,
      'noTrivialVertices': false,
      'edgeStrategy': new edgeStrategy.PickAnyStrategy(true)
  };
  let sortJson = {
    "nodePropNames": [],
    "edgePropNames": [],
    "newGraphName": null,
    "ascending": true,
    "useOutDegree": true,
    "inPlace": true
  };
  let localGraph = {};
  return coreService.postCreateUndirectedGraph(graph, undirectStrategy).then(function(result) {
    localGraph = new graphClass(result, graph.session);
    let analysisJson = new argumentBuilderClass('ANALYSIS_POOL', 'long').addGraphArg(result.graphName).build();
    // the return is needed twice to wait until the promise finishes.
    if (sortByDegree) {
      return coreService.postSortByDegree(localGraph, sortJson).then(function(result) {
        localGraph = new graphClass(result, graph.session);
        return analysisJson;
      });
    } else {
      return analysisJson;
    }
  }).then(function(analysisJson) {
    return coreService.postAnalysis(graph, analysisJson, algorithms.triangleCounting).then(function(result) {
      localGraph.destroy();
      return result.returnValue;
    });
  });
}

module.exports.vertexBetweennessCentrality = function (graph, options) {
  let finalOptions = common.getOptions(betweennessCentralityDefault, options);
  let type = finalOptions.variant;
  if ((type === betweennessCentralityVariant.APPROXIMATE) && (finalOptions.seeds !== null)) {
    type = 'betweennessCentralityFromSeeds';
  }
  let propertyJson = {
    'entityType': 'vertex',
    'type': 'double',
    'name': finalOptions.name,
    'hardName': finalOptions.name === null ? true : false,
    'dimension': 0
  };
  let localCollection;
  let localProperty;
  return getDefaultProperty(graph, propertyJson, finalOptions.bc).then(function(property) {
    localProperty = property;
    if (type === 'betweennessCentralityFromSeeds') {
      let ids = [];
      for(let i=0; i<finalOptions.seeds.length; i++) {
        let id = finalOptions.seeds[i] instanceof vertexClass ? finalOptions.seeds[i].id : finalOptions.seeds[i];
        ids.push(id);
      }
      let collectionJson = {
        'type': 'sequence',
        'elementType': 'vertex',
        'collectionName': null
      };
      let collectionItemsJson = {
        'valueType': 'integer',
        'values': '[' + ids.toString() + ']'
      };
      return coreService.postCollection(graph, collectionJson).then(function(collName) {
        localCollection = new collectionClass(collName, collectionJson.elementType, collectionJson.type, graph);
        return coreService.postAddAllCollection(graph, collName, collectionItemsJson);
      }).then(function(collName) {
        return localProperty; // needed to be handle in next level
      });
    } else {
      return localProperty; // needed to be handle in next level
    }
  }).then(function(property) {
    let analysisJson = new argumentBuilderClass('ANALYSIS_POOL', 'void')
      .addGraphArg(graph.name)
      .addNodePropertyArg(localProperty.name).build();
    if (type === betweennessCentralityVariant.APPROXIMATE) {
      analysisJson.args.splice(1, 0, new argumentBuilderClass().setType("INT_IN").setValue(finalOptions.numRandomSeeds).build());
    } else if (type === 'betweennessCentralityFromSeeds') {
      analysisJson.args.splice(1, 0, new argumentBuilderClass().setType("COLLECTION").setValue(localCollection.name).build());
    }
    return coreService.postAnalysis(graph, analysisJson, algorithms[type]);
  }).then(function(result) {
    if (type === 'betweennessCentralityFromSeeds') {
      localCollection.destroy();
    }
    return localProperty;
  });
}

module.exports.adamicAdarCounting = function (graph, options) {
  let finalOptions = common.getOptions(adamicAdarCountingDefault, options);
  let propertyJson = {
    'entityType': 'edge',
    'type': 'double',
    'name': finalOptions.name,
    'hardName': finalOptions.name === null ? true : false,
    'dimension': 0
  };
  let localProperty;
  return getDefaultProperty(graph, propertyJson, finalOptions.aa).then(function(property) {
    localProperty = property;
    let analysisJson = new argumentBuilderClass('ANALYSIS_POOL', 'void')
      .addGraphArg(graph.name)
      .addEdgePropertyArg(localProperty.name).build();
    return coreService.postAnalysis(graph, analysisJson, algorithms.adamicAdarCounting);
  }).then(function(result) {
    return localProperty;
  });
}

function allConductance(graph, options) {
  let finalOptions = common.getOptions(conductanceDefault, options);
  let scalarJson = {
    'type': 'double',
    'scalarName': finalOptions.conductanceName,
    'dimension': 0
  };
  let localScalar;
  return getDefaultScalar(graph, scalarJson, finalOptions.conductance).then(function(scalar) {
    localScalar = scalar;
    let analysisJson = new argumentBuilderClass('ANALYSIS_POOL', 'double')
      .addGraphArg(graph.name)
      .addNodePropertyArg(finalOptions.partition.propertyName)
      .addLongInArg(finalOptions.partitionIndex).build();
    return coreService.postAnalysis(graph, analysisJson, algorithms.conductance);
  }).then(function(result) {
    return localScalar.set(result.returnValue);
  }).then(function(scalar) {
    return scalar;
  });
}

function singleConductance(graph, options) {
  let finalOptions = common.getOptions(conductanceDefault, options);
  let minJson = {
    'type': 'double',
    'scalarName': finalOptions.minConductanceName,
    'dimension': 0
  };
  let avgJson = {
    'type': 'double',
    'scalarName': finalOptions.conductanceName,
    'dimension': 0
  };
  let minCond;
  let avgCond;
  return getDefaultScalar(graph, minJson, finalOptions.minConductance).then(function(scalar) {
    minCond = scalar;
    return getDefaultScalar(graph, avgJson, finalOptions.conductance);
  }).then(function(scalar) {
    avgCond = scalar;
    let analysisJson = new argumentBuilderClass('ANALYSIS_POOL', 'double')
      .addGraphArg(graph.name)
      .addNodePropertyArg(finalOptions.partition.propertyName)
      .addLongInArg(finalOptions.partition.sizeField)
      .addDoubleOutArg(minCond.name).build();
    return coreService.postAnalysis(graph, analysisJson, algorithms.partitionConductance);
  }).then(function(result) {
    return avgCond.set(result.returnValue);
  }).then(function(scalar) {
    return new pairClass(scalar, minCond);
  });
}

module.exports.conductance = function (graph, options) {
  let finalOptions = common.getOptions(conductanceDefault, options);
  if (finalOptions.partitionIndex !== null) {
    return allConductance(graph, options);
  } else {
    return singleConductance(graph, options);
  }
}

module.exports.partitionModularity = function (graph, options) {
  let finalOptions = common.getOptions(partitionModularityDefault, options);
  let scalarJson = {
    'type': 'double',
    'scalarName': finalOptions.modularityName,
    'dimension': 0
  };
  let localScalar;
  return getDefaultScalar(graph, scalarJson, finalOptions.modularity).then(function(scalar) {
    localScalar = scalar;
    let analysisJson = new argumentBuilderClass('ANALYSIS_POOL', 'double')
      .addGraphArg(graph.name)
      .addNodePropertyArg(finalOptions.partition.propertyName)
      .addLongInArg(finalOptions.partition.sizeField).build();
    return coreService.postAnalysis(graph, analysisJson, algorithms.partitionModularity);
  }).then(function(result) {
    return localScalar.set(result.returnValue);
  }).then(function(scalar) {
    return scalar;
  });
}

function salsa(graph, options) {
  let finalOptions = common.getOptions(salsaDefault, options);
  let type = finalOptions.variant;
  let objId = finalOptions.vertices;
  if (objId instanceof collectionClass) {
    objId = objId.name;
  } else if (objId instanceof vertexClass) {
    objId = objId.id;
  }
  let rankJson = {
    'entityType': 'vertex',
    'type': 'double',
    'name': finalOptions.salsaRankName,
    'hardName': finalOptions.salsaRankName === null ? true : false,
    'dimension': 0
  };
  let leftProperty;
  let rank;
  return graph.isLeftProperty.then(function(property) {
    leftProperty = property;
    return getDefaultProperty(graph, rankJson, finalOptions.salsaRank);
  }).then(function(property) {
    rank = property;
    let analysisJson = new argumentBuilderClass('ANALYSIS_POOL', 'void')
      .addGraphArg(graph.name)
      .addNodePropertyArg(leftProperty.name)
      .addDoubleInArg(finalOptions.maxDiff)
      .addIntInArg(finalOptions.maxIterations)
      .addNodePropertyArg(rank.name).build();
    if (type === salsaVariant.PERSONALIZED) {
      if (finalOptions.vertices instanceof collectionClass) {
        analysisJson.args.splice(1, 0, new argumentBuilderClass().setType("COLLECTION").setValue(objId).build());
        type = type + 'FromSet';
      } else {
        analysisJson.args.splice(1, 0, new argumentBuilderClass().setType("NODE_ID_IN").setValue(objId).build());
      }
      analysisJson.args.splice(3, 0, new argumentBuilderClass().setType("DOUBLE_IN").setValue(finalOptions.d).build());
    }
    return coreService.postAnalysis(graph, analysisJson, algorithms[type]);
  }).then(function(result) {
    return rank;
  });
}

module.exports.salsa = function (graph, options) {
  return salsa(graph, options);
}

module.exports.whomToFollow = function (graph, options) {
  let finalOptions = common.getOptions(whomToFollowDefault, options);
  let rootId = finalOptions.vertex instanceof vertexClass ? finalOptions.vertex.id : finalOptions.vertex;
  let hubsJson = {
    'type': 'sequence',
    'elementType': 'vertex',
    'collectionName': finalOptions.hubsName
  };
  let authJson = {
    'type': 'sequence',
    'elementType': 'vertex',
    'collectionName': finalOptions.authoritiesName
  };
  let hubsSeq;
  let authSeq;
  return getDefaultCollection(graph, hubsJson, finalOptions.hubs).then(function(hubCollection) {
    hubsSeq = hubCollection;
    return getDefaultCollection(graph, authJson, finalOptions.authorities);
    }).then(function(authCollection) {
      authSeq = authCollection;
      let analysisJson = new argumentBuilderClass('ANALYSIS_POOL', 'void')
        .addGraphArg(graph.name)
        .addNodeIdInArg(rootId)
        .addIntInArg(finalOptions.topK)
        .addIntInArg(finalOptions.sizeCircleOfTrust)
        .addIntInArg(finalOptions.maxIterations)
        .addDoubleInArg(finalOptions.tolerance)
        .addDoubleInArg(finalOptions.dampingFactor)
        .addIntInArg(finalOptions.salsaMaxIterations)
        .addDoubleInArg(finalOptions.salsaTolerance)
        .addCollectionArg(hubsSeq.name)
        .addCollectionArg(authSeq.name).build();
      return coreService.postAnalysis(graph, analysisJson, algorithms.whomToFollow);
    }).then(function(result) {
    return new pairClass(hubsSeq, authSeq);
  });  
}

function vertexSetAlgorithm (algorithm, property, graph, targetPool, max) {
  let analysisJson = new argumentBuilderClass(targetPool, 'long')
    .addGraphArg(graph.name)
    .addNodePropertyArg(property.name).build();
  if (max != null) {
    let maxJson = new argumentBuilderClass().setType("INT_IN").setValue(max).build();
    analysisJson.args.splice(1, 0, maxJson);
  }
  return coreService.postAnalysis(graph, analysisJson, algorithm).then(function(result) {
    return coreService.getComponentsProxy(graph, property.name, result.returnValue);
  }).then(function(result) {
    return new partitionClass(result, graph);
  });
}

module.exports.scc = function (graph, options) {
  let finalOptions = common.getOptions(connectedComponentsDefault, options);
  let propertyJson = {
    'entityType': 'vertex',
    'type': 'long',
    'name': finalOptions.partitionDistributionName,
    'hardName': finalOptions.partitionDistributionName === null ? true : false,
    'dimension': 0
  };
  let targetPool = finalOptions.variant === connectedComponentsVariant.TARJAN ? 'FAST_TRACK_ANALYSIS_POOL' : 'ANALYSIS_POOL';
  return getDefaultProperty(graph, propertyJson, finalOptions.partitionDistribution).then(function(property) {
    return vertexSetAlgorithm(algorithms[finalOptions.variant], property, graph, targetPool);
  });
}

module.exports.wcc = function (graph, options) {
  let finalOptions = common.getOptions(wccDefault, options);
  let propertyJson = {
    'entityType': 'vertex',
    'type': 'long',
    'name': finalOptions.partitionDistributionName,
    'hardName': finalOptions.partitionDistributionName === null ? true : false,
    'dimension': 0
  };
  return getDefaultProperty(graph, propertyJson, finalOptions.partitionDistribution).then(function(property) {
    return vertexSetAlgorithm(algorithms.weaklyConnectedComponents, property, graph, 'ANALYSIS_POOL');
  });
}

module.exports.communities = function (graph, options) {
  let finalOptions = common.getOptions(communitiesDefault, options);
  let type = finalOptions.variant;
  let rankName = finalOptions.rank != null ? finalOptions.rank.name : null;
  let weightName = finalOptions.weight != null ? finalOptions.weight.name : null;
  let propertyJson = {
    'entityType': 'vertex',
    'type': 'long',
    'name': finalOptions.name,
    'hardName': finalOptions.name === null ? true : false,
    'dimension': 0
  };
  if (type != communitiesVariant.INFOMAP) {
    return getDefaultProperty(graph, propertyJson, finalOptions.partitonDistribution).then(function(property) {
      return vertexSetAlgorithm(algorithms[finalOptions.variant], property, graph, 'ANALYSIS_POOL', finalOptions.maxIterations);
    });
  } else {
    let localProperty;
    return getDefaultProperty(graph, propertyJson, finalOptions.partitonDistribution).then(function(property) {
      localProperty = property;
      let analysisJson = new argumentBuilderClass('ANALYSIS_POOL', 'long')
        .addGraphArg(graph.name)
        .addNodePropertyArg(rankName)
        .addEdgePropertyArg(weightName)
        .addDoubleInArg(finalOptions.tau)
        .addDoubleInArg(finalOptions.tol)
        .addIntInArg(finalOptions.maxIterations)
        .addNodePropertyArg(localProperty.name).build();
      return coreService.postAnalysis(graph, analysisJson, algorithms[finalOptions.variant]);
    }).then(function(result) {
      return coreService.getComponentsProxy(graph, localProperty.name, result.returnValue);
    }).then(function(result) {
      return new partitionClass(result, graph);
    });
  }
}

module.exports.bipartiteCheck = function (graph, propertyName) {
  let analysisJson = new argumentBuilderClass('ANALYSIS_POOL', 'boolean')
    .addGraphArg(graph.name)
    .addNodePropertyArg(propertyName).build();
  return coreService.postAnalysis(graph, analysisJson, algorithms.bipartiteCheck).then(function(result) {
    return result.returnValue;
  });
}

module.exports.diameter = function (graph, options) {
  let finalOptions = common.getOptions(diameterDefault, options);
  let eccentricityJson = {
    'entityType': 'vertex',
    'type': 'integer',
    'name': finalOptions.eccentricityName,
    'hardName': finalOptions.eccentricityName === null ? true : false,
    'dimension': 0
  };
  let diameterJson = {
    'type': 'integer',
    'scalarName': finalOptions.diameterName,
    'dimension': 0
  };
  let eccentricityProperty;
  let diameter;
  return getDefaultProperty(graph, eccentricityJson, finalOptions.eccentricity).then(function(property) {
    eccentricityProperty = property;
    return getDefaultScalar(graph, diameterJson, finalOptions.diameter);
  }).then(function(scalar) {
    diameter = scalar;
    let analysisJson = new argumentBuilderClass('ANALYSIS_POOL', 'integer')
      .addGraphArg(graph.name)
      .addBoolInArg(finalOptions.diameterOn)
      .addNodePropertyArg(eccentricityProperty.name).build();
    return coreService.postAnalysis(graph, analysisJson, algorithms.diameter);
  }).then(function(result) {
    return diameter.set(result.returnValue);
  }).then(function(scalar) {
    return new pairClass(scalar, eccentricityProperty);
  });
}

module.exports.periphery = function (graph, options) {
  let finalOptions = common.getOptions(peripheryDefault, options);
  let peripheryJson = {
    'type': 'set',
    'elementType': 'vertex',
    'collectionName': finalOptions.peripheryName
  };
  let peripherySet;
  return getDefaultCollection(graph, peripheryJson, finalOptions.periphery).then(function(collection) {
    peripherySet = collection;
    let analysisJson = new argumentBuilderClass('ANALYSIS_POOL', 'void')
      .addGraphArg(graph.name)
      .addBoolInArg(finalOptions.peripheryOn)
      .addCollectionArg(peripherySet.name).build();
    return coreService.postAnalysis(graph, analysisJson, algorithms.periphery);
  }).then(function(result) {
    return peripherySet;
  });
}

module.exports.localClusteringCoefficient = function (graph, options) {
  let finalOptions = common.getOptions(localClusteringCoefficientDefault, options);
  let lccJson = {
    'entityType': 'vertex',
    'type': 'double',
    'name': finalOptions.lccName,
    'hardName': finalOptions.lccName === null ? true : false,
    'dimension': 0
  };
  let lccProperty;
  return getDefaultProperty(graph, lccJson, finalOptions.lcc).then(function(property) {
    lccProperty = property;
    let analysisJson = new argumentBuilderClass('ANALYSIS_POOL', 'double')
      .addGraphArg(graph.name)
      .addNodePropertyArg(lccProperty.name).build();
    return coreService.postAnalysis(graph, analysisJson, algorithms.localClusteringCoefficient);
  }).then(function(result) {
    return lccProperty;
  });
}

module.exports.prim = function (graph, options) {
  let finalOptions = common.getOptions(primDefault, options);
  let weightName = finalOptions.weight != null ? finalOptions.weight.name : null;
  let propertyJson = {
    'entityType': 'edge',
    'type': 'boolean',
    'name': finalOptions.mstName,
    'hardName': finalOptions.mstName === null ? true : false,
    'dimension': 0
  };
  let localProperty;
  return getDefaultProperty(graph, propertyJson, finalOptions.mst).then(function(property) {
    localProperty = property;
    let analysisJson = new argumentBuilderClass('ANALYSIS_POOL', 'void')
      .addGraphArg(graph.name)
      .addEdgePropertyArg(weightName)
      .addEdgePropertyArg(localProperty.name).build();
    return coreService.postAnalysis(graph, analysisJson, algorithms.prim);
  }).then(function(result) {
    return localProperty;
  });
}

module.exports.findCycle = function (graph, options) {
  let finalOptions = common.getOptions(findCycleDefault, options);
  let type = finalOptions.variant;
  let vertexId = finalOptions.vertex instanceof vertexClass ? finalOptions.vertex.id : finalOptions.vertex;
  if (vertexId != null) {
    type = findCycleVariant.FROM_NODE;
  }
  let nodeSeqJson = {
    'type': 'sequence',
    'elementType': 'vertex',
    'collectionName': finalOptions.nodeSeqName
  };
  let edgeSeqJson = {
    'type': 'sequence',
    'elementType': 'edge',
    'collectionName': finalOptions.edgeSeqName
  };
  let nodeSeq;
  let edgeSeq;
  return getDefaultCollection(graph, nodeSeqJson, finalOptions.nodeSeq).then(function(collection) {
    nodeSeq = collection;
    return getDefaultCollection(graph, edgeSeqJson, finalOptions.edgeSeq);
  }).then(function(collection) {
    edgeSeq = collection;
    let analysisJson = new argumentBuilderClass('ANALYSIS_POOL', 'void')
      .addGraphArg(graph.name)
      .addCollectionArg(nodeSeq.name)
      .addCollectionArg(edgeSeq.name).build();
    if (type === findCycleVariant.FROM_NODE) {
      analysisJson.args.splice(1, 0, new argumentBuilderClass().setType("NODE_ID_IN").setValue(vertexId).build());
    }
    return coreService.postAnalysis(graph, analysisJson, algorithms[type]);
  }).then(function(result) {
    let pathJson = {
      'nodeSeqName': nodeSeq.name,
      'edgeSeqName': edgeSeq.name
    };
    return coreService.postPathFromSequences(graph, pathJson);
  }).then(function(result) {
    var tmp = JSON.parse(result.serializedNodes);
    return new pathClass(tmp[0], tmp[tmp.length-1], result, graph);
  });
}

module.exports.reachability = function (graph, options) {
  let type = options.ignoreEdgeDirection ? 'reachabilityUndirected' : 'reachability';
  let maxHops = options.maxHops;
  let finalOptions = common.getOptions(reachabilityDefault, options);
  let srcId = finalOptions.source instanceof vertexClass ? finalOptions.source.id : finalOptions.source;
  let dstId = finalOptions.dest instanceof vertexClass ? finalOptions.dest.id : finalOptions.dest;
  let analysisJson = new argumentBuilderClass('ANALYSIS_POOL', 'integer')
    .addGraphArg(graph.name)
    .addNodeIdInArg(srcId)
    .addNodeIdInArg(dstId)
    .addIntInArg(maxHops).build();
  return coreService.postAnalysis(graph, analysisJson, algorithms[type]).then(function(result) {
    return result.returnValue;
  });
}

module.exports.topologicalSort = function (graph, options) {
  let finalOptions = common.getOptions(topologicalSortDefault, options);
  let type = finalOptions.variant;
  let topoOrderJson = {
    'entityType': 'vertex',
    'type': 'integer',
    'name': finalOptions.topoOrderName,
    'hardName': finalOptions.topoOrderName === null ? true : false,
    'dimension': 0
  };
  let topoOrderProperty;
  return getDefaultProperty(graph, topoOrderJson, finalOptions.topoOrder).then(function(property) {
    topoOrderProperty = property;

    let analysisJson = new argumentBuilderClass('ANALYSIS_POOL', 'void')
      .addGraphArg(graph.name)
      .addNodePropertyArg(topoOrderProperty.name).build();

    if (type === topologicalSortVariant.SCHEDULE) {
      if (finalOptions.source instanceof collectionClass) {
        analysisJson.args.splice(1, 0,
            new argumentBuilderClass().setType("COLLECTION").setValue(finalOptions.source.name).build());
      }
    }
    return coreService.postAnalysis(graph, analysisJson, algorithms[type]);
  }).then(function(result) {
    return topoOrderProperty;
  });
}

// exporting constants
module.exports.pagerankVariant = pagerankVariant;
module.exports.betweennessCentralityVariant = betweennessCentralityVariant;
module.exports.closenessCentralityVariant = closenessCentralityVariant;
module.exports.degreeCentralityVariant = degreeCentralityVariant;
module.exports.communitiesVariant = communitiesVariant;
module.exports.connectedComponentsVariant = connectedComponentsVariant;
module.exports.salsaVariant = salsaVariant;
module.exports.dijkstraVariant = dijkstraVariant;
module.exports.shortestPathVariant = shortestPathVariant;
module.exports.degreeDistributionVariant = degreeDistributionVariant;
module.exports.findCycleVariant = findCycleVariant;
module.exports.topologicalSortVariant = topologicalSortVariant;
