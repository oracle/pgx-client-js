'use strict'

// modules installed
var request = require('request');

// services
const futureService = require('../services/future.js');
const common = require('../services/common.js');

// classes
const graphClass = require('../classes/graph.js');

module.exports.delGraph = function (graph) {
  let url = graph.session.baseUrl + '/core/graph/' + encodeURIComponent(graph.name) + '?_csrf_token=' +
    encodeURIComponent(graph.session.tokenId) + '&ignoreNotFound=false';
  return common.doDel(url, graph.session, graph, true);
}

module.exports.delProperty = function (property) {
  let url = property.graph.session.baseUrl + '/core/graph/' + encodeURIComponent(property.graph.name) +
    '/property/' + encodeURIComponent(property.name) + '?_csrf_token=' +
    encodeURIComponent(property.graph.session.tokenId) + '&entityType=' +
    encodeURIComponent(property.entityType.toUpperCase()) + '&ignoreNotFound=false';
  return common.doDel(url, property.graph.session, property, true);
}

module.exports.delCollection = function (collection) {
  let url = collection.graph.session.baseUrl + '/core/collection/' + encodeURIComponent(collection.name) +
    '?_csrf_token=' + encodeURIComponent(collection.graph.session.tokenId) + '&ignoreNotFound=false';
  return common.doDel(url, collection.graph.session, collection, true);
}

module.exports.delPartition = function (partition) {
  let url = partition.graph.session.baseUrl + '/core/wrappedCollection/' + encodeURIComponent(partition.componentNamespace) +
    '?_csrf_token=' + encodeURIComponent(partition.graph.session.tokenId) + '&ignoreNotFound=false';
  return common.doDel(url, partition.graph.session, partition.componentNamespace, true);
}

module.exports.delMap = function (map) {
  let url = map.graph.session.baseUrl + '/core/map/' + encodeURIComponent(map.name) + '?_csrf_token=' +
    encodeURIComponent(map.graph.session.tokenId) + '&ignoreNotFound=false';
  return common.doDel(url, map.graph.session, map, true);
}

module.exports.delScalar = function (scalar) {
  let url = scalar.graph.session.baseUrl + '/core/scalar/' + encodeURIComponent(scalar.name) + '?_csrf_token=' +
    encodeURIComponent(scalar.graph.session.tokenId) + '&ignoreNotFound=false';
  return common.doDel(url, scalar.graph.session, scalar, true);
}

module.exports.postMap = function (graph, mapJson) {
  let url = graph.session.baseUrl + '/core/graph/' + encodeURIComponent(graph.name) + '/map';
  return common.doPost(url, graph.session, mapJson);
}

module.exports.postMapEntry = function (graph, mapName, mapJson) {
  let url = graph.session.baseUrl + '/core/map/' + encodeURIComponent(mapName) + '/entry';
  return common.doPost(url, graph.session, mapJson);
}

module.exports.postMapEntryDelete = function (graph, mapName, mapJson) {
  let url = graph.session.baseUrl + '/core/map/' + encodeURIComponent(mapName) + '/entry/delete';
  return common.doPost(url, graph.session, mapJson);
}

module.exports.postProperty = function (graph, propertyJson) {
  let url = graph.session.baseUrl + '/core/graph/' + encodeURIComponent(graph.name) + '/property';
  return common.doPost(url, graph.session, propertyJson);
}

module.exports.postPropertyClone = function (graph, propName, propJson) {
  let url = graph.session.baseUrl + '/core/graph/' + encodeURIComponent(graph.name) + '/property/' +
    encodeURIComponent(propName) + '/clone';
  return common.doPost(url, graph.session, propJson);
}

module.exports.postPath = function (graph, pathJson) {
  let url = graph.session.baseUrl + '/core/graph/' + encodeURIComponent(graph.name) + '/path';
  return common.doPost(url, graph.session, pathJson);
}

module.exports.postPathFromSequences = function (graph, pathJson) {
  let url = graph.session.baseUrl + '/core/graph/' + encodeURIComponent(graph.name) + '/path/fromSequences';
  return common.doPost(url, graph.session, pathJson);
}

module.exports.postAllPaths = function (graph, pathJson) {
  let url = graph.session.baseUrl + '/core/graph/' + encodeURIComponent(graph.name) + '/allPaths';
  return common.doPost(url, graph.session, pathJson);
}

module.exports.postScalar = function (graph, scalarJson) {
  let url = graph.session.baseUrl + '/core/graph/' + encodeURIComponent(graph.name) + '/scalar';
  return common.doPost(url, graph.session, scalarJson);
}

module.exports.postScalarName = function (graph, scalarName, scalarJson) {
  let url = graph.session.baseUrl + '/core/scalar/' + encodeURIComponent(scalarName);
  return common.doPost(url, graph.session, scalarJson);
}

module.exports.postCollection = function (graph, collectionJson) {
  let url = graph.session.baseUrl + '/core/graph/' + encodeURIComponent(graph.name) + '/collection';
  return common.doPost(url, graph.session, collectionJson);
}

module.exports.postAddAllCollection = function (graph, collectionName, collectionJson) {
  let url = graph.session.baseUrl + '/core/collection/' + encodeURIComponent(collectionName) + '/addAll';
  return common.doPost(url, graph.session, collectionJson);
}

module.exports.postRemoveAllCollection = function (graph, collectionName, collectionJson) {
  let url = graph.session.baseUrl + '/core/collection/' + encodeURIComponent(collectionName) + '/removeAll';
  return common.doPost(url, graph.session, collectionJson);
}

module.exports.postClearCollection = function (graph, collectionName) {
  let url = graph.session.baseUrl + '/core/collection/' + encodeURIComponent(collectionName) + '/clear';
  return common.doPost(url, graph.session);
}

module.exports.postCollectionFromFilter = function (graph, filterJson) {
  let url = graph.session.baseUrl + '/core/graph/' + encodeURIComponent(graph.name) + '/collectionFromFilter';
  return common.doPost(url, graph.session, filterJson);
}

module.exports.postCollectionClone = function (graph, collName) {
  let url = graph.session.baseUrl + '/core/collection/' + encodeURIComponent(collName) + '/clone';
  return common.doPost(url, graph.session);
}

module.exports.postContainsCollection = function (graph, collectionName, collectionJson) {
  let url = graph.session.baseUrl + '/core/collection/' + encodeURIComponent(collectionName) + '/contains';
  return common.doPost(url, graph.session, collectionJson);
}

module.exports.postCreateSubgraphFromFilter = function (graph, filterJson) {
  let url = graph.session.baseUrl + '/core/graph/' + encodeURIComponent(graph.name) + '/createSubgraphFromFilter';
  return common.doPost(url, graph.session, filterJson);
}

module.exports.postAnalysis = function (graph, analysisJson, analysisName) {
  let url = graph.session.baseUrl + '/core/analysis/' + encodeURIComponent(analysisName);
  return common.doPost(url, graph.session, analysisJson);
}

module.exports.postExtractTopK = function (graph, mapName, topJson) {
  let url = graph.session.baseUrl + '/core/map/' + encodeURIComponent(mapName) + '/extractTopK';
  return common.doPost(url, graph.session, topJson);
}

module.exports.postCreateBipartiteSubgraphFromLeftSet = function (graph, graphJson) {
  let url = graph.session.baseUrl + '/core/graph/' + encodeURIComponent(graph.name) + '/createBipartiteSubgraphFromLeftSet';
  return common.doPost(url, graph.session, graphJson);
}

module.exports.postCreateBipartiteSubgraphFromInDegree = function (graph, graphJson) {
  let url = graph.session.baseUrl + '/core/graph/' + encodeURIComponent(graph.name) + '/createBipartiteSubgraphFromInDegree';
  return common.doPost(url, graph.session, graphJson);
}

module.exports.postCreateUndirectedGraph = function (graph, graphJson) {
  let url = graph.session.baseUrl + '/core/graph/' + encodeURIComponent(graph.name) + '/createUndirectedGraph';
  return common.doPost(url, graph.session, graphJson);
}

module.exports.postCreateTransposedGraph = function (graph, graphJson) {
  let url = graph.session.baseUrl + '/core/graph/' + encodeURIComponent(graph.name) + '/createTransposedGraph';
  return common.doPost(url, graph.session, graphJson);
}

module.exports.postSortByDegree = function (graph, graphJson) {
  let url = graph.session.baseUrl + '/core/graph/' + encodeURIComponent(graph.name) + '/sortByDegree';
  return common.doPost(url, graph.session, graphJson);
}

module.exports.postSimplifyGraph = function (graph, graphJson) {
  let url = graph.session.baseUrl + '/core/graph/' + encodeURIComponent(graph.name) + '/simplifyGraph';
  return common.doPost(url, graph.session, graphJson);
}

module.exports.createSparsifiedSubgraph = function (graph, graphJson) {
  let url = graph.session.baseUrl + '/core/graph/' + encodeURIComponent(graph.name) + '/createSparsifiedSubgraph';
  return common.doPost(url, graph.session, graphJson);
}

module.exports.postFill = function (graph, propName, propJson) {
  let url = graph.session.baseUrl + '/core/graph/' + encodeURIComponent(graph.name) + '/property/' +
    encodeURIComponent(propName) + '/fill';
  return common.doPost(url, graph.session, propJson);
}

module.exports.postRename = function (graph, propName, propJson) {
  let url = graph.session.baseUrl + '/core/graph/' + encodeURIComponent(graph.name) + '/property/' +
    encodeURIComponent(propName) + '/rename';
  return common.doPost(url, graph.session, propJson);
}

module.exports.postRenameGraph = function (graph, graphJson) {
  let url = graph.session.baseUrl + '/core/graph/' + encodeURIComponent(graph.name) + '/rename';
  return common.doPost(url, graph.session, graphJson);
}

module.exports.postPropertyGet = function (graph, propName, propJson) {
  let url = graph.session.baseUrl + '/core/graph/' + encodeURIComponent(graph.name) + '/property/' +
    encodeURIComponent(propName) + '/get';
  return common.doPost(url, graph.session, propJson);
}

module.exports.postPropertySet = function (graph, propName, propJson) {
  let url = graph.session.baseUrl + '/core/graph/' + encodeURIComponent(graph.name) + '/property/' +
    encodeURIComponent(propName) + '/set';
  return common.doPost(url, graph.session, propJson);
}

module.exports.postCombine = function (graph, propJson) {
  let url = graph.session.baseUrl + '/core/graph/' + encodeURIComponent(graph.name) + '/property/combine';
  return common.doPost(url, graph.session, propJson);
}

module.exports.postGraphClone = function (graph, graphJson) {
  let url = graph.session.baseUrl + '/core/graph/' + encodeURIComponent(graph.name) + '/clone';
  return common.doPost(url, graph.session, graphJson);
}

module.exports.postStoreGraph = function (graph, graphJson) {
  let url = graph.session.baseUrl + '/core/graph/' + encodeURIComponent(graph.name) + '/storeGraph';
  return common.doPost(url, graph.session, graphJson);
}

module.exports.postPublishGraph = function (graph, graphJson) {
  let url = graph.session.baseUrl + '/core/graph/' + encodeURIComponent(graph.name) + '/publish';
  return common.doPost(url, graph.session, graphJson);
}

module.exports.postPublishProperty = function (property) {
  let url = property.graph.session.baseUrl + '/core/graph/' + encodeURIComponent(property.graph.name) + '/property/' +
    encodeURIComponent(property.name) + '/publish?entityType=' + encodeURIComponent(property.entityType.toUpperCase());
  return common.doPost(url, property.graph.session);
}

module.exports.readGraphWithProperties = function (session, jsonContent) {
  let url = session.baseUrl + '/core/graph';
  if (typeof jsonContent === 'string' || jsonContent instanceof String) {
    jsonContent = JSON.parse(jsonContent);
  }
  let json = {'graphConfig': jsonContent};
  return common.doPost(url, session, json).then(function(result) {
    return new graphClass(result, session);
  });
}

module.exports.getEdgeLabel = function (graph, edgeKey, keyType) {
  let url = graph.session.baseUrl + '/core/graph/' + encodeURIComponent(graph.name) + '/edge/label/' +
   encodeURIComponent(edgeKey) + '?keyType=' + encodeURIComponent(keyType.toUpperCase());
  return common.doGet(url, graph.session, true);
}

module.exports.queryPgql = function (graph, queryJson) {
  let url = graph.session.baseUrl + '/core/graph/' + encodeURIComponent(graph.name) + '/query';
  return common.doPost(url, graph.session, queryJson);
}

module.exports.getComponentsProxy = function (graph, propName, num) {
  let url = graph.session.baseUrl + '/core/graph/' + encodeURIComponent(graph.name) + '/property/' +
    encodeURIComponent(propName) + '/componentsProxy/' + encodeURIComponent(num);
  return common.doGet(url, graph.session, true);
}

module.exports.getPropertyProxy = function (graph, propName, entityType) {
  let url = graph.session.baseUrl + '/core/graph/' + encodeURIComponent(graph.name) + '/property/' +
    encodeURIComponent(propName) + '/proxy?entityType=' + encodeURIComponent(entityType.toUpperCase());
  return common.doGet(url, graph.session, true);
}

module.exports.getMapProxy = function (graph, mapName) {
  let url = graph.session.baseUrl + '/core/map/' + encodeURIComponent(mapName) + '/proxy';
  return common.doGet(url, graph.session, true);
}

module.exports.getCollectionProxy = function (graph, collectionName) {
  let url = graph.session.baseUrl + '/core/collection/' + encodeURIComponent(collectionName);
  return common.doGet(url, graph.session, true);
}

module.exports.getWrappedCollectionProxy = function (graph, componentNamespace, id) {
  let url = graph.session.baseUrl + '/core/wrappedCollection/' + encodeURIComponent(componentNamespace) + '/' +
    encodeURIComponent(id);
  return common.doGet(url, graph.session, true);
}

module.exports.getScalar = function (graph, scalarName) {
  let url = graph.session.baseUrl + '/core/scalar/' + encodeURIComponent(scalarName);
  return common.doGet(url, graph.session, true);
}

module.exports.exists = function (graph, id, entityType, idType) {
  let url = graph.session.baseUrl + '/core/graph/' + encodeURIComponent(graph.name) + '/exists?entityType=' +
    encodeURIComponent(entityType.toUpperCase()) + '&idType=' + encodeURIComponent(idType.toUpperCase()) + '&key=' +
    encodeURIComponent(id);
  return common.doGet(url, graph.session, true);
}

module.exports.getEdges = function (graph, id, direction, idType) {
  let url = graph.session.baseUrl + '/core/graph/' + encodeURIComponent(graph.name) + '/edges?vertexId=' +
    encodeURIComponent(id) + '&direction=' + encodeURIComponent(direction.toUpperCase()) + '&idType=' +
    encodeURIComponent(idType.toUpperCase());
  return common.doGet(url, graph.session, true);
}

module.exports.getVertexFromEdge = function (graph, id, direction) {
  let url = graph.session.baseUrl + '/core/graph/' + encodeURIComponent(graph.name) + '/vertexFromEdge?edgeId=' +
    encodeURIComponent(id) + '&direction=' + encodeURIComponent(direction.toUpperCase());
  return common.doGet(url, graph.session, true);
}

module.exports.getNeighbors = function (graph, id, direction, idType) {
  let url = graph.session.baseUrl + '/core/graph/' + encodeURIComponent(graph.name) + '/neighbors?vertexId=' +
    encodeURIComponent(id) + '&direction=' + encodeURIComponent(direction.toUpperCase()) + '&idType=' + encodeURIComponent(idType.toUpperCase());
  return common.doGet(url, graph.session, true);
}

module.exports.isFresh = function (graph) {
  let url = graph.session.baseUrl + '/core/graph/' + encodeURIComponent(graph.name) + '/isFresh';
  return common.doGet(url, graph.session, true);
}

module.exports.getRandomNode = function (graph) {
  let url = graph.session.baseUrl + '/core/graph/' + encodeURIComponent(graph.name) + '/randomNode';
  return common.doGet(url, graph.session, true);
}

module.exports.getGraph = function (session, name) {
  let url = session.baseUrl + '/core/graph/' + encodeURIComponent(name) + '?ignoreNotFound=true';
  return common.doGet(url, session, true);
}

module.exports.getGraphs = function (session) {
  let url = session.baseUrl + '/core/graphs';
  return common.doGet(url, session, true);
}

module.exports.isPublishedGraph = function (graph) {
  let url = graph.session.baseUrl + '/core/graph/' + encodeURIComponent(graph.name) + '/isPublished';
  return common.doGet(url, graph.session, true);
}

module.exports.isPublishedProperty = function (property) {
  let url = property.graph.session.baseUrl + '/core/graph/' + encodeURIComponent(property.graph.name) + '/property/' +
    encodeURIComponent(property.name) + '/isPublished?entityType=' + encodeURIComponent(property.entityType.toUpperCase());
  return common.doGet(url, property.graph.session, true);
}
