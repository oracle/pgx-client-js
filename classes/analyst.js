'use strict'

const algorithm = require('../helpers/algorithm.js');

/**
 * The Analyst gives access to all built-in algorithms of PGX.
 * @module classes/analyst
 */
module.exports = class Analyst {

  /**
   * Compute closeness centrality
   * @function closenessCentrality
   * @memberof module:classes/analyst
   * @instance
   * @param {module:classes/graph} graph - graph
   * @param {Object} options - algorithm options
   * @param {module:classes/property} [options.cc] - vertex property
   * @param {string} [options.name] - vertex property name
   * @param {(DEFAULT|WEIGHTED)} [options.variant=DEFAULT] - variant
   * @param {(string|module:classes/property)} options.cost - edge name or property, required if variant = WEIGHTED
   * @returns {module:classes/property} The vertex property holding the result
   */
  closenessCentrality(graph, options) {
    return algorithm.closenessCentrality(graph, options);
  }

  /**
   * Compute vertex centrality
   * @function degreeCentrality
   * @memberof module:classes/analyst
   * @instance
   * @param {module:classes/graph} graph - graph
   * @param {Object} [options] - algorithm options
   * @param {(BOTH|IN|OUT)} [options.direction=BOTH] - variant
   * @param {module:classes/property} [options.dc] - vertex property
   * @param {string} [options.name] - vertex property name
   * @returns {module:classes/property} The vertex property holding the result
   */
  degreeCentrality(graph, options) {
    return algorithm.degreeCentrality(graph, options);
  }

  /**
   * Compute degree distribution
   * @function degreeDistribution
   * @memberof module:classes/analyst
   * @instance
   * @param {module:classes/graph} graph - graph
   * @param {Object} [options] - algorithm options
   * @param {(IN|OUT)} [options.degree=IN] - variant
   * @param {module:classes/map} [options.distribution] - map
   * @param {string} [options.distributionName] - map name
   * @returns {module:classes/map} The map holding the result
   */
  degreeDistribution(graph, options) {
    return algorithm.degreeDistribution(graph, options);
  }

  /**
   * Compute shortest path using Dijkstra's algorithm
   * @function shortestPathDijkstra
   * @memberof module:classes/analyst
   * @instance
   * @param {module:classes/graph} graph - graph
   * @param {Object} options - algorithm options
   * @param {(number|module:classes/vertex)} options.src - id or source vertex
   * @param {(number|module:classes/vertex)} options.dst - id or destination vertex
   * @param {(string|module:classes/property)} options.cost - edge name or property
   * @param {(CLASSICAL|BIDIRECTIONAL)} [options.variant=BIDIRECTIONAL] - variant
   * @param {module:classes/property} [options.parent] - parent vertex property
   * @param {module:classes/property} [options.parentEdge] - parent edge vertex property
   * @param {string} [options.parentName] - parent name
   * @param {string} [options.parentEdgeName] - parent edge name
   * @param {module:classes/filters/graphFilterWithExpression} [options.filterExpr] - if given, runs filtered variant
   * @returns {module:classes/path} The path holding the result
   */
  shortestPathDijkstra(graph, options) {
    return algorithm.shortestPathDijkstra(graph, options);
  }

  /**
   * Compute eigenvector centrality using power iteration
   * @function eigenvectorCentrality
   * @memberof module:classes/analyst
   * @instance
   * @param {module:classes/graph} graph - graph
   * @param {Object} [options] - algorithm options
   * @param {number} [options.max=100] - maximum number of iterations
   * @param {number} [options.maxDiff=0.001] - maximum error for terminating the iteration
   * @param {boolean} [options.useL2Norm=false] - true- use L2Norm for normalization. false - use L1Norm
   * @param {boolean} [options.useInEdge=false] - true- compute 'left' eigenvector, false - compute 'right' eigenvector
   * @param {module:classes/property} [options.ec] - vertex property
   * @param {string} [options.name] - vertex property name
   * @returns {module:classes/property} The vertex property holding the result
   */
  eigenvectorCentrality(graph, options) {
    return algorithm.eigenvectorCentrality(graph, options);
  }

  /**
   * Compute the fattest path from a source vertex to all vertices in the graph
   * @function fattestPath
   * @memberof module:classes/analyst
   * @instance
   * @param {module:classes/graph} graph - graph
   * @param {Object} options - algorithm options
   * @param {(number|module:classes/vertex)} options.root - id or starting vertex
   * @param {(string|module:classes/property)} options.capacity - edge name or property
   * @param {module:classes/property} [options.distance] - distance vertex property
   * @param {module:classes/property} [options.parent] - parent vertex property
   * @param {module:classes/property} [options.parentEdge] - parent edge vertex property
   * @param {string} [options.distanceName] - distance name
   * @param {string} [options.parentName] - parent name
   * @param {string} [options.parentEdgeName] - parent edge name
   * @returns {module:classes/allPaths} The allPaths holding the result
   */
  fattestPath(graph, options) {
    return algorithm.fattestPath(graph, options);
  }

  /**
   * An algorithm to traverse a graph, breadth-first
   * @function filteredBfs
   * @memberof module:classes/analyst
   * @instance
   * @param {module:classes/graph} graph - graph
   * @param {Object} options - algorithm options
   * @param {(number|module:classes/vertex)} options.root - id or source vertex
   * @param {boolean} [options.initWithInfinity=true] - initialize the dist property
   * @param {module:classes/filters/vertexFilter} [options.filter=new vertexFilter('true')] - filter expression
   * @param {module:classes/filters/vertexFilter} [options.navigator=new vertexFilter('true')] - filter expression
   * @param {module:classes/property} [options.distance] - distance vertex property
   * @param {module:classes/property} [options.parent] - parent vertex property
   * @param {string} [options.distanceName] - distance name
   * @param {string} [options.parentName] - parent name
   * @returns {module:classes/pair} The pair of properties holding the result
   */
  filteredBfs(graph, options) {
    return algorithm.filteredBfs(graph, options);
  }

  /**
   * This is the Hyperlink-Induced Topic Search (HITS) algorithm, also known as Hubs and Authorities
   * @function hits
   * @memberof module:classes/analyst
   * @instance
   * @param {module:classes/graph} graph - graph
   * @param {Object} [options] - algorithm options
   * @param {number} [options.max=100] - maximum number of iterations
   * @param {module:classes/property} [options.hubs] - hubs vertex property
   * @param {module:classes/property} [options.auth] - auth vertex property
   * @param {string} [options.hubsName] - hubs name
   * @param {string} [options.authName] - auth name
   * @returns {module:classes/pair} The pair of properties holding the result
   */
  hits(graph, options) {
    return algorithm.hits(graph, options);
  }

  /**
   * Computes the k-core decomposition of the graph
   * @function kcore
   * @memberof module:classes/analyst
   * @instance
   * @param {module:classes/graph} graph - graph
   * @param {Object} [options] - algorithm options
   * @param {number} [options.minCore=0] - the minimum core ID
   * @param {number} [options.max=2147483647] - the maximum k-core
   * @param {module:classes/scalar} [options.maxKCore] - scalar
   * @param {module:classes/property} [options.kcore] - vertex property
   * @param {string} [options.maxKCoreName] - scalar name
   * @param {string} [options.kcoreName] - vertex property name
   * @returns {module:classes/pair} The pair of {scalar, property} holding the result
   */
  kcore(graph, options) {
    return algorithm.kcore(graph, options);
  }

  /**
   * Performs the training step of generating recommendations using matrix factorization
   * @function matrixFactorizationGradientDescent
   * @memberof module:classes/analyst
   * @instance
   * @param {module:classes/graph} graph - graph
   * @param {Object} options - algorithm options
   * @param {(string|module:classes/property)} options.weight - edge name or property
   * @param {number} [options.learningRate=0.1] - the learning rate
   * @param {number} [options.changePerStep=0.9] - the change per step
   * @param {number} [options.lambda=0.1] - the lambda
   * @param {number} [options.maxStep=100] - the maximum steps
   * @param {number} [options.vectorLength=20] - the vector length
   * @param {module:classes/property} [options.features] - vertex property
   * @param {string} [options.featuresName] - features name
   * @returns {module:classes/matrixFactorizationModel} The matrixFactorizationModel holding the result
   */
  matrixFactorizationGradientDescent(graph, options) {
    return algorithm.matrixFactorizationGradientDescent(graph, options);
  }

  /**
   * pagerank algorithm
   * @function pagerank
   * @memberof module:classes/analyst
   * @instance
   * @param {module:classes/graph} graph - graph
   * @param {Object} options - algorithm options
   * @param {(string|module:classes/property)} options.weight - edge name or property, required if variant = WEIGHTED
   * @param {(number|module:classes/vertex|module:classes/collection)} options.vertices - id, vertex or collection,
   *   required if variant = PERSONALIZED
   * @param {number} [options.e=0.001] - maximum error for terminating the iteration
   * @param {number} [options.d=0.85] - damping factor
   * @param {number} [options.max=100] - maximum number of iterations
   * @param {boolean} [options.norm=false] - boolean flag to take into account dangling nodes
   * @param {module:classes/property} [options.rank] - vertex property
   * @param {string} [options.name] - rank name
   * @param {(DEFAULT|APPROXIMATE|WEIGHTED|PERSONALIZED)} [options.variant=DEFAULT] - variant
   * @returns {module:classes/property} The vertex property holding the result
   */
  pagerank(graph, options) {
    return algorithm.pagerank(graph, options);
  }

  /**
   * Compute single source shortest paths using Bellman & Ford algorithm
   * @function shortestPathBellmanFord
   * @memberof module:classes/analyst
   * @instance
   * @param {module:classes/graph} graph - graph
   * @param {Object} options - algorithm options
   * @param {(number|module:classes/vertex)} options.src - id or source vertex
   * @param {(string|module:classes/property)} options.cost - edge name or property
   * @param {(FORWARD|REVERSE)} [options.traversalDirection=FORWARD] - traversal direction
   * @param {module:classes/property} [options.distance] - distance vertex property
   * @param {module:classes/property} [options.parent] - parent vertex property
   * @param {module:classes/property} [options.parentEdge] - parent edge vertex property
   * @param {string} [options.distanceName] - distance name
   * @param {string} [options.parentName] - parent name
   * @param {string} [options.parentEdgeName] - parent edge name
   * @returns {module:classes/allPaths} The allPaths holding the result
   */
  shortestPathBellmanFord(graph, options) {
    return algorithm.shortestPath('bellmanFord', graph, options);
  }

  /**
   * Compute hop-distance from given vertex to every other vertex
   * @function shortestPathHopDist
   * @memberof module:classes/analyst
   * @instance
   * @param {module:classes/graph} graph - graph
   * @param {Object} options - algorithm options
   * @param {(number|module:classes/vertex)} options.src - id or source vertex
   * @param {(FORWARD|REVERSE)} [options.traversalDirection=FORWARD] - traversal direction
   * @param {module:classes/property} [options.distance] - distance vertex property
   * @param {module:classes/property} [options.parent] - parent vertex property
   * @param {module:classes/property} [options.parentEdge] - parent edge vertex property
   * @param {string} [options.distanceName] - distance name
   * @param {string} [options.parentName] - parent name
   * @param {string} [options.parentEdgeName] - parent edge name
   * @returns {module:classes/allPaths} The allPaths holding the result
   */
  shortestPathHopDist(graph, options) {
    return algorithm.shortestPath('hopDistance', graph, options);
  }

  /**
   * Counts the number of 'triads' in the given undirected graph
   * @function countTriangles
   * @memberof module:classes/analyst
   * @instance
   * @param {module:classes/graph} graph - graph
   * @param {boolean} sortByDegree - if true, the undirected copy of the graph will be sorted by degree
   * @returns {number} number of triangles
   */
  countTriangles(graph, sortByDegree) {
    return algorithm.countTriangles(graph, sortByDegree);
  }

  /**
   * Compute vertex betweenness centrality (without considering edge length)
   * @function vertexBetweennessCentrality
   * @memberof module:classes/analyst
   * @instance
   * @param {module:classes/graph} graph - graph
   * @param {Object} options - algorithm options
   * @param {module:classes/property} [options.bc] - vertex property
   * @param {string} [options.name] - vertex property name
   * @param {(FULL|APPROXIMATE)} [options.variant=FULL] - variant
   * @param {number} [options.numRandomSeeds=5] - if variant = APPROXIMATE
   * @param {(number[]|module:class/vertex[])} options.seeds - if variant = APPROXIMATE,
   *   can't be combined with numRandomSeeds
   * @returns {module:classes/property} The vertex property holding the result
   */
  vertexBetweennessCentrality(graph, options) {
    return algorithm.vertexBetweennessCentrality(graph, options);
  }

  /**
   * Computes 'Adamic-Adar measure' for each edge in the graph
   * @function adamicAdarCounting
   * @memberof module:classes/analyst
   * @instance
   * @param {module:classes/graph} graph - graph
   * @param {Object} [options] - algorithm options
   * @param {module:classes/property} [options.aa] - edge property
   * @param {string} [options.name] - edge property name
   * @returns {module:classes/property} The edge property holding the result
   */
  adamicAdarCounting(graph, options) {
    return algorithm.adamicAdarCounting(graph, options);
  }

  /**
   * Compute the conductance or the partition conductance
   * @function conductance
   * @memberof module:classes/analyst
   * @instance
   * @param {module:classes/graph} graph - graph
   * @param {Object} options - algorithm options
   * @param {module:classes/partition} options.partition - the graph partition
   * @param {number} [options.partitionIndex] - if NULL, computes conductance of all partitions, single partition
   *   otherwise
   * @param {module:classes/scalar} [options.conductance] - avg conductance if all partitions, actual conductance if
   *   single partition, generated if NULL
   * @param {module:classes/scalar} [options.minConductance] - minimum conductance if all partitions, NULL if single
   *   partition, generated if NULL
   * @param {string} [options.conductanceName] - conductance scalar name
   * @param {string} [options.minConductanceName] - min conductance scalar name
   * @returns {module:classes/scalar|module:classes/pair} scalar or pair of scalar holding the result
   */
  conductance(graph, options) {
    return algorithm.conductance(graph, options);
  }

  /**
   * Compute the modularity of a partition
   * @function partitionModularity
   * @memberof module:classes/analyst
   * @instance
   * @param {module:classes/graph} graph - graph
   * @param {Object} options - algorithm options
   * @param {module:classes/partition} options.partition - the partition to analyze
   * @param {module:classes/scalar} [options.modularity] - modularity scalar
   * @param {string} [options.modularityName] - modularity scalar name
   * @returns {module:classes/scalar} The scalar holding the result
   */
  partitionModularity(graph, options) {
    return algorithm.partitionModularity(graph, options);
  }

  /**
   * Computes a hub or an authority score for each node in the graph
   * @function salsa
   * @memberof module:classes/analyst
   * @instance
   * @param {module:classes/graph} graph - graph
   * @param {Object} options - algorithm options
   * @param {DEFAULT|PERSONALIZED} [options.variant=DEFAULT] - variant
   * @param {(number|module:classes/vertex|module:classes/collection)} options.vertices - id, vertex or collection,
   *   required if variant = PERSONALIZED
   * @param {number} [options.d=0.85] - damping factor
   * @param {number} [options.maxIterations=100] - maximum number of iterations
   * @param {number} [options.maxDiff=0.001] - maximum error for terminating the iteration
   * @param {module:classes/property} [options.salsaRank] - vertex property
   * @param {string} [options.salsaRankName] - rank name
   * @returns {module:classes/property} The property holding the result
   */
  salsa(graph, options) {
    return algorithm.salsa(graph, options);
  }

  whomToFollow(graph, options) {
    return algorithm.whomToFollow(graph, options);
  }

  /**
   * Find strongly connected components using Kosaraju's or Tarjan's algorithm
   * @function scc
   * @memberof module:classes/analyst
   * @instance
   * @param {module:classes/graph} graph - graph
   * @param {Object} [options] - algorithm options
   * @param {KOSARAJU|TARJAN} [options.variant=KOSARAJU] - variant
   * @param {module:classes/property} [options.partitionDistribution] - vertex property
   * @param {string} [options.partitionDistributionName] - vertex property name
   * @returns {module:classes/partition} The partition holding the result
   */
  scc(graph, options) {
    return algorithm.scc(graph, options);
  }

  /**
   * Find weakly connected components through label propagation
   * @function wcc
   * @memberof module:classes/analyst
   * @instance
   * @param {module:classes/graph} graph - graph
   * @param {Object} [options] - algorithm options
   * @param {module:classes/property} [options.partitionDistribution] - vertex property
   * @param {string} [options.partitionDistributionName] - vertex property name
   * @returns {module:classes/partition} The partition holding the result
   */
  wcc(graph, options) {
    return algorithm.wcc(graph, options);
  }

  /**
   * Detect communities using Infomap, parallel label propagation or greedy conductance minimization
   * @function communities
   * @memberof module:classes/analyst
   * @instance
   * @param {module:classes/graph} graph - graph
   * @param {Object} [options] - algorithm options
   * @param {CONDUCTANCE_MINIMIZATION|LABEL_PROPAGATION|INFOMAP} [options.variant=CONDUCTANCE_MINIMIZATION] - variant
   * @param {module:classes/property} options.rank - vertex property
   * @param {module:classes/property} options.weight - edge property
   * @param {number} [options.tau = 0.15] - damping factor
   * @param {number} [options.tol = 0.0001] - maximum tolerated error value
   * @param {number} [options.maxIterations = 100] - maximum number of iterations
   * @param {module:classes/property} [options.partitionDistribution] - vertex property
   * @param {string} [options.name] - vertex property name
   * @returns {module:classes/partition} The partition holding the result
   */
  communities(graph, options) {
    return algorithm.communities(graph, options);
  }

  bipartiteCheck(graph, propertyName) {
    return algorithm.bipartiteCheck(graph, propertyName);
  }

  /**
   * Computes the diameter of the graph
   * @function diameter
   * @memberof module:classes/analyst
   * @instance
   * @param {module:classes/graph} graph - graph
   * @param {Object} [options] - algorithm options
   * @param {module:classes/scalar} [options.diameter] - scalar
   * @param {module:classes/property} [options.eccentricity] - vertex property
   * @param {string} [options.diameterName] - scalar name
   * @param {string} [options.eccentricityName] - vertex property name
   * @returns {module:classes/pair} The pair of {scalar, property} holding the result
   */
  diameter(graph, options) {
    return algorithm.diameter(graph, options);
  }

  /**
   * Computes the radius of the graph
   * @function radius
   * @memberof module:classes/analyst
   * @instance
   * @param {module:classes/graph} graph - graph
   * @param {Object} [options] - algorithm options
   * @param {module:classes/scalar} [options.radius] - scalar
   * @param {module:classes/property} [options.eccentricity] - vertex property
   * @param {string} [options.radiusName] - scalar name
   * @param {string} [options.eccentricityName] - vertex property name
   * @returns {module:classes/pair} The pair of {scalar, property} holding the result
   */
  radius(graph, options) {
    let localOptions = Object.assign({}, options);
    localOptions.diameterOn = false;
    return algorithm.diameter(graph, options);
  }

  /**
   * Computes the periphery of the graph
   * @function periphery
   * @memberof module:classes/analyst
   * @instance
   * @param {module:classes/graph} graph - graph
   * @param {Object} [options] - algorithm options
   * @param {module:classes/nodeSet} [options.periphery] - node set
   * @param {string} [options.peripheryName] - node set name
   * @returns {module:classes/nodeSet} The node set holding the result
   */
  periphery(graph, options) {
    return algorithm.periphery(graph, options);
  }

  /**
   * Computes the center of the graph
   * @function center
   * @memberof module:classes/analyst
   * @instance
   * @param {module:classes/graph} graph - graph
   * @param {Object} [options] - algorithm options
   * @param {module:classes/nodeSet} [options.center] - node set
   * @param {string} [options.peripheryName] - node set name
   * @returns {module:classes/nodeSet} The node set holding the result
   */
  center(graph, options) {
    let localOptions = Object.assign({}, options);
    localOptions.peripheryOn = false;
    return algorithm.periphery(graph, options);
  }

  /**
   * Computes the lcc of the vertices in the graph
   * @function localClusteringCoefficient
   * @memberof module:classes/analyst
   * @instance
   * @param {module:classes/graph} graph - graph
   * @param {Object} [options] - algorithm options
   * @param {module:classes/property} [options.lcc] - vertex property
   * @param {string} [options.lccName] - vertex property name
   * @returns {module:classes/property} The vertex property holding the result
   */
  localClusteringCoefficient(graph, options) {
    return algorithm.localClusteringCoefficient(graph, options);
  }

  /**
   * Computes a minimum spanning tree using Prim's Algorithm
   * @function prim
   * @memberof module:classes/analyst
   * @instance
   * @param {module:classes/graph} graph - graph
   * @param {Object} [options] - algorithm options
   * @param {module:classes/property} [options.mst] - edge property
   * @param {string} [options.mstName] - edge property name
   * @returns {module:classes/property} The edge property holding the result
   */
  prim(graph, options) {
    return algorithm.prim(graph, options);
  }

  /**
   * The algorithm tries to find a cycle in a directed graph
   * @function findCycle
   * @memberof module:classes/analyst
   * @instance
   * @param {module:classes/graph} graph - graph
   * @param {Object} [options] - algorithm options
   * @param {DEFAULT|FROM_NODE} [options.variant=DEFAULT] - variant
   * @param {(number|module:classes/vertex)} options.vertices - id or vertex, required if variant = FROM_NODE
   * @param {module:classes/nodeSequence} [options.nodeSequence] - vertex sequence
   * @param {string} [options.nodeSequenceName] - vertex sequence name
   * @param {module:classes/edgeSequence} [options.edgeSequence] - edge sequence
   * @param {string} [options.edgeSequenceName] - edge sequence name
   * @returns {module:classes/path} The path holding the result
   */
  findCycle(graph, options) {
    return algorithm.findCycle(graph, options);
  }

  /**
   * The algorithm tries to find whether two nodes in a graph are reachable 
   * @function reachability
   * @memberof module:classes/analyst
   * @instance
   * @param {module:classes/graph} graph - graph
   * @param {Object} [options] - algorithm options
   * @param {(number|module:classes/vertex)} options.source - id or vertex
   * @param {(number|module:classes/vertex)} options.dest - id or vertex
   * @param {number} options.maxHops - maximum hop distance allowed between the source and dest nodes
   * @param {boolean} options.ignoreEdgeDirection - boolean flag for ignoring the direction of the edges during the search
   * @returns {number} hop distance between the nodes, if there is no path it will return -1
   */
  reachability(graph, options) {
    return algorithm.reachability(graph, options);
  }

  /**
   * The algorithm tries to find an order of visit for the nodes in a graph
   * @function topologicalSort
   * @memberof module:classes/analyst
   * @instance
   * @param {module:classes/graph} graph - graph
   * @param {Object} options - algorithm options
   * @param {module:classes/collection} options.source - vertex or collection,
   *   required if variant = SCHEDULE
   * @param {module:classes/property} [options.topoOrder] - vertex property
   * @param {string} [options.name] - topoOrder name
   * @param {(DEFAULT|SCHEDULE)} [options.variant=DEFAULT] - variant
   * @returns {module:classes/property} The vertex property holding the result
   */
  topologicalSort(graph, options) {
    return algorithm.topologicalSort(graph, options);
  }
}