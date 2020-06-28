/**
 * Copyright (c) 2019 Oracle and/or its affiliates. All rights reserved.
 *
 * Licensed under the Universal Permissive License v 1.0 as shown at
 * http://oss.oracle.com/licenses/upl.
 */
'use strict'

// modules installed
var request = require('request');

// services
const futureService = require('../services/future.js');
const common = require('../services/common.js');

// classes
const graphClass = require('../classes/graph.js');

module.exports.delGraph = function (graph) {
  let url = graph.session.baseUrl + '/core/v1/graphs/x-graph-id?_csrf_token=' +
    encodeURIComponent(graph.session.tokenId) + '&ignoreNotFound=false&retention=DESTROY_IF_NOT_USED';
  let headers = {
    'x-graph-id': graph.id
  }
  return common.doDel(url, graph.session, graph, true, headers);
}

module.exports.delProperty = function (property) {
  let url = property.graph.session.baseUrl + '/core/v1/graphs/x-graph-id/properties/x-property-name?_csrf_token=' +
    encodeURIComponent(property.graph.session.tokenId) + '&entityType=' +
    encodeURIComponent(property.entityType.toUpperCase()); 

  let headers = {
    'x-graph-id': property.graph.id,
    'x-property-name': property.id
  }
  return common.doDel(url, property.graph.session, property, true, headers);
}

module.exports.delCollection = function (collection) {
  let url = collection.graph.session.baseUrl + '/core/v1/collections/x-collection-name' +
    '?_csrf_token=' + encodeURIComponent(collection.graph.session.tokenId) + '&ignoreNotFound=false';
  let headers = {
    'x-collection-name': collection.name
  }
  return common.doDel(url, collection.graph.session, collection, true, headers);
}

module.exports.delPartition = function (partition) {
  let url = partition.graph.session.baseUrl + '/core/wrappedCollection/' + encodeURIComponent(partition.componentNamespace) +
    '?_csrf_token=' + encodeURIComponent(partition.graph.session.tokenId) + '&ignoreNotFound=false';
  return common.doDel(url, partition.graph.session, partition.componentNamespace, true);
}

module.exports.delMap = function (map) {
  let url = map.graph.session.baseUrl + '/core/v1/maps/x-map-name?_csrf_token=' +
    encodeURIComponent(map.graph.session.tokenId) + '&ignoreNotFound=false';
  let headers = {
    'x-map-name': map.name
  }
  return common.doDel(url, map.graph.session, map, true, headers);
}

module.exports.delScalar = function (scalar) {
  let url = scalar.graph.session.baseUrl + '/core/v1/scalars/x-scalar-name?_csrf_token=' +
    encodeURIComponent(scalar.graph.session.tokenId) + '&ignoreNotFound=false';
  let headers = {
    'x-scalar-name': scalar.name
  }
  return common.doDel(url, scalar.graph.session, scalar, true, headers);
}

module.exports.postMap = function (graph, mapJson) {
  let url = graph.session.baseUrl + '/core/v1/maps';

  return common.doPost(url, graph.session, mapJson);
}

module.exports.postMapEntry = function (graph, mapName, mapJson) {
  let url = graph.session.baseUrl + '/core/v1/maps/x-map-name/entries/x-map-key';

  let headers = {
    'x-map-name': map.name,
    'x-map-key': mapJson['key']
  }
  return common.doPut(url, graph.session, mapJson, headers);
}

module.exports.postMapEntryDelete = function (graph, mapName, mapJson) {
  let url = graph.session.baseUrl + '/core/v1/maps/' + encodeURIComponent(mapName) + '/entry/delete';
  return common.doPost(url, graph.session, mapJson);
}

module.exports.postProperty = function (graph, propertyJson) {
  let url = graph.session.baseUrl + '/core/v1/graphs/x-graph-id/properties';
  let headers = {
    'x-graph-id': graph.id
  }

  return common.doPost(url, graph.session, propertyJson, headers);
}

module.exports.postPropertyClone = function (graph, property, propJson) {
  let url = graph.session.baseUrl + '/core/v1/graphs/x-graph-id/properties/x-property-name/clone';
  let headers = {
    'x-graph-id': graph.id,
    'x-property-name': property.id
  }
  return common.doPost(url, graph.session, propJson, headers);
}

module.exports.postPath = function (graph, pathJson) {
  let url = graph.session.baseUrl + '/core/v1/graphs/x-graph-id/computePath';
  let headers = {
    'x-graph-id': graph.id
  };
  console.log(headers);
  return common.doPost(url, graph.session, pathJson, headers);
}

module.exports.postPathFromSequences = function (graph, pathJson) {
  let url = graph.session.baseUrl + '/core/v1/graphs/' + encodeURIComponent(graph.name) + '/path/fromSequences';
  return common.doPost(url, graph.session, pathJson);
}

module.exports.postAllPaths = function (graph, pathJson) {
  pathJson.graphName = graph.name;
  let url = graph.session.baseUrl + '/core/v1/pathProxies/';
  return common.doPost(url, graph.session, pathJson);
}

module.exports.postScalar = function (graph, scalarJson) {
  let url = graph.session.baseUrl + '/core/v1/graphs/' + encodeURIComponent(graph.name) + '/scalar';
  return common.doPost(url, graph.session, scalarJson);
}

module.exports.postScalarName = function (graph, scalarName, scalarJson) {
  let url = graph.session.baseUrl + '/core/v1/scalars/' + encodeURIComponent(scalarName);
  return common.doPost(url, graph.session, scalarJson);
}

module.exports.postCollection = function (graph, collectionJson) {
  let url = graph.session.baseUrl + '/core/v1/graphs/' + encodeURIComponent(graph.name) + '/collection';
  return common.doPost(url, graph.session, collectionJson);
}

module.exports.postAddAllCollection = function (graph, collectionName, collectionJson) {
  let url = graph.session.baseUrl + '/core/v1/collections/' + encodeURIComponent(collectionName) + '/addAll';
  return common.doPost(url, graph.session, collectionJson);
}

module.exports.postRemoveAllCollection = function (graph, collectionName, collectionJson) {
  let url = graph.session.baseUrl + '/core/v1/collections/' + encodeURIComponent(collectionName) + '/removeAll';
  return common.doPost(url, graph.session, collectionJson);
}

module.exports.postClearCollection = function (graph, collectionName) {
  let url = graph.session.baseUrl + '/core/v1/collections/' + encodeURIComponent(collectionName) + '/clear';
  return common.doPost(url, graph.session);
}

module.exports.postCollectionFromFilter = function (graph, filterJson) {
  let url = graph.session.baseUrl + '/core/v1/collections/';

  return common.doPost(url, graph.session, filterJson);
}

module.exports.postCollectionClone = function (graph, collName) {
  let url = graph.session.baseUrl + '/core/v1/collections/' + encodeURIComponent(collName) + '/clone';
  return common.doPost(url, graph.session);
}

module.exports.postContainsCollection = function (graph, collectionName, collectionJson) {
  let url = graph.session.baseUrl + '/core/v1/collections/' + encodeURIComponent(collectionName) + '/contains';
  return common.doPost(url, graph.session, collectionJson);
}


module.exports.postCreateSubgraphFromFilter = function (graph, filterJson) {
  let url = graph.session.baseUrl + '/core/v1/graphs/' + encodeURIComponent(graph.name) + '/createSubgraphFromFilter';
  return common.doPost(url, graph.session, filterJson);
}

module.exports.postAnalysis = function (graph, analysisJson, analysisName) {
  let url = graph.session.baseUrl + '/core/v1/analyses/x-aid/run';
  let headers = {
    'x-aid': analysisName
  }
  return common.doPost(url, graph.session, analysisJson, headers);
}

module.exports.postExtractTopK = function (graph, mapName, topJson) {
  let url = graph.session.baseUrl + '/core/v1/maps/' + encodeURIComponent(mapName) + '/extractTopK';
  return common.doPost(url, graph.session, topJson);
}

module.exports.postCreateBipartiteSubgraphFromLeftSet = function (graph, graphJson) {
  let url = graph.session.baseUrl + '/core/v1/graphs/' + encodeURIComponent(graph.name) + '/createBipartiteSubgraphFromLeftSet';
  return common.doPost(url, graph.session, graphJson);
}

module.exports.postCreateBipartiteSubgraphFromInDegree = function (graph, graphJson) {
  let url = graph.session.baseUrl + '/core/v1/graphs/' + encodeURIComponent(graph.name) + '/createBipartiteSubgraphFromInDegree';
  return common.doPost(url, graph.session, graphJson);
}

module.exports.postCreateUndirectedGraph = function (graph, graphJson) {
  let url = graph.session.baseUrl + '/core/v1/graphs/x-graph-id/undirect';
  let headers = {
    'x-graph-id': graph.id
  }
  return common.doPost(url, graph.session, graphJson, headers);
}

module.exports.postCreateTransposedGraph = function (graph, graphJson) {
  let url = graph.session.baseUrl + '/core/v1/graphs/x-graph-id/transpose';
  let headers = {
    'x-graph-id': graph.id
  };
  return common.doPost(url, graph.session, graphJson, headers);
}

module.exports.postSortByDegree = function (graph, graphJson) {
  let url = graph.session.baseUrl + '/core/v1/graphs/' + encodeURIComponent(graph.name) + '/sortByDegree';
  return common.doPost(url, graph.session, graphJson);
}

module.exports.postSimplifyGraph = function (graph, graphJson) {
  let url = graph.session.baseUrl + '/core/v1/graphs/' + encodeURIComponent(graph.name) + '/simplifyGraph';
  return common.doPost(url, graph.session, graphJson);
}

module.exports.createSparsifiedSubgraph = function (graph, graphJson) {
  let url = graph.session.baseUrl + '/core/v1/graphs/' + encodeURIComponent(graph.name) + '/createSparsifiedSubgraph';
  return common.doPost(url, graph.session, graphJson);
}

module.exports.putFill = function (graph, property, propJson) {
  let url = graph.session.baseUrl + '/core/v1/graphs/x-graph-id/properties/x-property-name/fillValue';
  let headers = {
    'x-graph-id': graph.id,
    'x-property-name': property.id
  };
  return common.doPut(url, graph.session, propJson, headers);
}

module.exports.putRename = function (graph, property, propJson) {
  let url = graph.session.baseUrl + '/core/v1/graphs/x-graph-id/properties/x-property-name/name';
  let headers = {
    'x-graph-id': graph.id,
    'x-property-name': property.id
  }
  return common.doPut(url, graph.session, propJson, headers);
}

module.exports.postRenameGraph = function (graph, graphJson) {
  let url = graph.session.baseUrl + '/core/v1/graphs/x-graph-id/name';
  let headers = {
    'x-graph-id': graph.id
  }
  return common.doPut(url, graph.session, graphJson, headers);
}

module.exports.getPropertyValue = function (graph, property, key, idType) {
  let url = graph.session.baseUrl + '/core/v1/graphs/x-graph-id/properties/x-property-name/values/x-property-key?entityType=' + property.entityType.toUpperCase() + '&idType=' + idType.toUpperCase();

  let headers = {
    'x-graph-id': graph.id,
    'x-property-name': property.id,
    'x-property-key': key
  };

  return common.doGet(url, graph.session, true, headers);
}

module.exports.patchPropertySet = function (graph, property, propJson) {
  let url = graph.session.baseUrl + '/core/v1/graphs/x-graph-id/properties/x-property-name/values'; 
  let headers = {
    'x-graph-id': graph.id,
    'x-property-name': property.id
  }
  return common.doPatch(url, graph.session, propJson, headers);
}

module.exports.postCombine = function (graph, propJson) {
  let url = graph.session.baseUrl + '/core/v1/graphs/' + encodeURIComponent(graph.name) + '/properties/combine';
  return common.doPost(url, graph.session, propJson);
}

module.exports.postGraphClone = function (graph, graphJson) {
  let url = graph.session.baseUrl + '/core/v1/graphs/x-graph-id/clone';

  let headers = {
    'x-graph-id': graph.id
  }
  return common.doPost(url, graph.session, graphJson, headers);
}

module.exports.postStoreGraph = function (graph, graphJson) {
  let url = graph.session.baseUrl + '/core/v1/graphs/' + encodeURIComponent(graph.name) + '/storeGraph';
  return common.doPost(url, graph.session, graphJson);
}

module.exports.postPublishGraph = function (graph, graphJson) {
  let url = graph.session.baseUrl + '/core/v1/graphs/x-graph-id/publish';
  let headers = {
    'x-graph-id': graph.id
  }

  return common.doPost(url, graph.session, graphJson, headers);
}

module.exports.postPublishProperty = function (property) {
  let url = property.graph.session.baseUrl + '/core/v1/graphs/x-graph-id/properties/x-property-name/publish?entityType=' + encodeURIComponent(property.entityType.toUpperCase());

  let headers = {
    'x-graph-id': property.graph.id,
    'x-property-name': property.id
  }

  return common.doPost(url, property.graph.session, null, headers);
}

module.exports.readGraphWithProperties = function (session, jsonContent) {
  let url = session.baseUrl + '/core/v1/loadGraph';
  if (typeof jsonContent === 'string' || jsonContent instanceof String) {
    jsonContent = JSON.parse(jsonContent);
  }
  let json = {'graphConfig': jsonContent};
  return common.doPost(url, session, json).then(function(result) {
    return new graphClass(result, session);
  });
}

module.exports.getEdgeLabel = function (graph, edgeKey, keyType) {
  let url = graph.session.baseUrl + '/core/v1/graphs/' + encodeURIComponent(graph.name) + '/edge/label/' +
   encodeURIComponent(edgeKey) + '?keyType=' + encodeURIComponent(keyType.toUpperCase());
  return common.doGet(url, graph.session, true);
}

module.exports.queryPgql = function (graph, queryJson) {
  let url = graph.session.baseUrl + '/core/v1/pgql/run';
  return common.doPost(url, graph.session, queryJson);
}

module.exports.getComponentsProxy = function (graph, propName, num) {
  let url = graph.session.baseUrl + '/core/v1/graphs/' + encodeURIComponent(graph.name) + '/properties/' +
    encodeURIComponent(propName) + '/componentsProxy/' + encodeURIComponent(num);
  return common.doGet(url, graph.session, true);
}

module.exports.postPropertyProxy = function(graph, property, labelFlag = false) {
  let url = graph.session.baseUrl + '/core/v1/propertyProxies';
  let body = {
    'graphId': graph.id,
    'propertyId': property.id,
    'entityType': property.entityType,
    'labelFlag': labelFlag 
  }

  return common.doPost(url, graph.session, body)
}

module.exports.getPropertyProxy = function (graph, proxyId) {
  let url = graph.session.baseUrl + '/core/v1/propertyProxies/x-proxy-id';

  let headers = {
    'x-proxy-id': proxyId
  }

  return common.doGet(url, graph.session, true, headers);
}

module.exports.getMapProxy = function (graph, mapName) {
  let url = graph.session.baseUrl + '/core/v1/maps/' + encodeURIComponent(mapName) + '/proxy';
  return common.doGet(url, graph.session, true);
}

module.exports.getCollection = function(graph, collection){
  let url = graph.session.baseUrl + '/core/v1/collections/x-collection-name?graphId=' + encodeURIComponent(graph.id);
  let headers = { 
    'x-collection-name': encodeURIComponent(collection.name),
  }
  
  return common.doGet(url, graph.session, true, headers);
}

module.exports.postCollectionProxy = function (graph, collection) {
  let url = graph.session.baseUrl + '/core/v1/collectionProxies';
  let body = {
    "collectionName": collection.id,
    "collectionNamespace": null,
    "id": 0,
    "isComponentCollection": false
  }

  return common.doPost(url, graph.session, body);
}

module.exports.getWrappedCollectionProxy = function (graph, componentNamespace, id) {
  let url = graph.session.baseUrl + '/core/wrappedCollection/' + encodeURIComponent(componentNamespace) + '/' +
    encodeURIComponent(id);
  return common.doGet(url, graph.session, true);
}

module.exports.getScalar = function (graph, scalarName) {
  let url = graph.session.baseUrl + '/core/v1/scalars/' + encodeURIComponent(scalarName);
  return common.doGet(url, graph.session, true);
}

module.exports.exists = function (graph, id, entityType, idType) {
  let url = graph.session.baseUrl + '/core/v1/graphs/x-graph-id/exists?entityType=' +
    encodeURIComponent(entityType.toUpperCase()) + '&idType=' + encodeURIComponent(idType.toUpperCase()) + '&key=' +
    encodeURIComponent(id);
  let headers = {
    'x-graph-id': graph.id
  }

  return common.doGet(url, graph.session, true, headers);
}

module.exports.getEdges = function (graph, id, direction, idType) {
  let url = graph.session.baseUrl + '/core/v1/graphs/x-graph-id/vertices/x-vertex-id/connectedEdges?direction=' + encodeURIComponent(direction.toUpperCase()) + '&key=' +
    encodeURIComponent(idType.toUpperCase());

  let headers = {
    'x-graph-id': graph.id,
    'x-vertex-id': id
  }
  return common.doGet(url, graph.session, true, headers);
}

module.exports.getVertexFromEdge = function (graph, id, direction) {
  let url = graph.session.baseUrl + '/core/v1/graphs/x-graph-id/edges/x-edge-id/vertex?direction=' + encodeURIComponent(direction.toUpperCase());

  let headers = {
    'x-graph-id': graph.id,
    'x-edge-id': id
  };

  return common.doGet(url, graph.session, true, headers);
}

module.exports.getNeighbors = function (graph, id, direction, idType) {
  let url = graph.session.baseUrl + '/core/v1/graphs/x-graph-id/vertices/x-vertex-id/neighbors?direction=' + encodeURIComponent(direction.toUpperCase()) + '&idType=' + encodeURIComponent(idType.toUpperCase());

  let headers = {
    'x-graph-id': graph.id,
    'x-vertex-id': id
  };

  return common.doGet(url, graph.session, true, headers);
}

module.exports.isFresh = function (graph) {
  let url = graph.session.baseUrl + '/core/v1/graphs/x-graph-id/isFresh';
  let headers = {
    'x-graph-id': graph.id
  }
  return common.doGet(url, graph.session, true, headers);
}

module.exports.getRandomNode = function (graph) {
  let url = graph.session.baseUrl + '/core/v1/graphs/' + encodeURIComponent(graph.name) + '/randomNode';
  return common.doGet(url, graph.session, true);
}

module.exports.getGraph = function (session, name) {
  let url = session.baseUrl + '/core/v1/getGraphByName';
  let body = {
    name: name,
    namespaceId: null
  };
  return common.doPost(url, session, body);
}

module.exports.getGraphs = function (session) {
  let url = session.baseUrl + '/core/v1/graphs';
  return common.doGet(url, session, true);
}

module.exports.isPublishedGraph = function (graph) {
  let url = graph.session.baseUrl + '/core/v1/graphs/' + encodeURIComponent(graph.name) + '/isPublished';
  return common.doGet(url, graph.session, true);
}

module.exports.isPublishedProperty = function (property) {
  let url = property.graph.session.baseUrl + '/core/v1/graphs/x-graph-id/properties/x-property-name/isPublished?entityType=' + encodeURIComponent(property.entityType.toUpperCase());

  let headers = {
    'x-graph-id': property.graph.id,
    'x-property-name': property.id
  }

  return common.doGet(url, property.graph.session, true, headers);
}
