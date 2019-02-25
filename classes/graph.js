'use strict'

// services
const core = require('../services/core.js');
const future = require('../services/future.js');
const resultSetService = require('../services/resultSet.js');
const collectionProxy = require('../services/collectionProxy.js');

// classes
const collectionClass = require('../classes/collection.js');
const resultSet = require('../classes/resultSet.js');
const vertex = require('../classes/vertex.js');
const edge = require('../classes/edge.js');
const property = require('../classes/property.js');
const resultElement = require('../classes/resultElement.js');
const scalar = require('../classes/scalar.js');
const map = require('../classes/map.js');
const iterator = require('../classes/iterator.js');
const edgeStrategy = require('../classes/edgeStrategy.js')


// helpers
const common = require('../helpers/common.js');

/**
 * A PGX Graph
 * @module classes/graph
 */
module.exports = class Graph {

  /**
   * Creates a graph
   * @param {object} result - The result of creating a graph from the ws
   * @param {module:classes/session} session - session
   * @param {module:classes/graph} graph - graph
   */
  constructor(result, session) {
    this.name = result.graphName;
    this.transient = result.transient;
    this.numVertices = result.metaData.numVertices;
    this.numEdges = result.metaData.numEdges;
    this.vertexIdType = result.metaData.vertexIdType;
    this.edgeIdType = result.metaData.edgeIdType;
    this.memoryMb = result.metaData.memoryMb;
    this.dataSourceVersion = result.metaData.dataSourceVersion;
    this.creationTimestamp = result.metaData.creationTimestamp;
    this.creationRequestTimestamp = result.metaData.creationRequestTimestamp;
    this.config = result.metaData.config;
    this.session = session;
  }

  /**
   * Get the set of vertex properties belonging to this graph
   * @member {module:classes/property[]} vertexProperties
   * @memberof module:classes/graph
   * @instance
   */
  get vertexProperties() {
    let self = this;
    return core.getGraph(self.session, self.name).then(function(graph) {
      let nodeProperties = graph.nodeProperties;
      let keys = Object.keys(nodeProperties);
      let collection = [];
      for(var i=0; i<keys.length; i++) {
        collection.push(new property(nodeProperties[keys[i]], self));
      }
      return collection;
    });
  }

  /**
   * Get the set of edge properties belonging to this graph
   * @member {module:classes/property[]} edgeProperties
   * @memberof module:classes/graph
   * @instance
   */
  get edgeProperties() {
    let self = this;
    return core.getGraph(self.session, self.name).then(function(graph) {
      let edgeProperties = graph.edgeProperties;
      let keys = Object.keys(edgeProperties);
      let collection = [];
      for(var i=0; i<keys.length; i++) {
        collection.push(new property(edgeProperties[keys[i]], self));
      }
      return collection;
    });
  }

  /**
   * Gets a vertex property of this graph
   * @function getVertexProperty
   * @memberof module:classes/graph
   * @instance
   * @param {string} name - The property name
   * @returns {module:classes/property} The vertex property
   */
  getVertexProperty(name) {
    return this.vertexProperties.then(function(properties) {
      for(var i=0; i<properties.length; i++) {
        if (properties[i].name === name) {
          return properties[i];
        }
      }
    });
  }

  /**
   * Gets an edge property of this graph
   * @function getEdgeProperty
   * @memberof module:classes/graph
   * @instance
   * @param {string} name - The property name
   * @returns {module:classes/property} The edge property
   */
  getEdgeProperty(name) {
    return this.edgeProperties.then(function(properties) {
      for(var i=0; i<properties.length; i++) {
        if (properties[i].name === name) {
          return properties[i];
        }
      }
    });
  }

  /**
   * Gets the 'is Left' vertex property of the graph
   * @member {module:classes/property} isLeftProperty
   * @memberof module:classes/graph
   * @instance
   */
  get isLeftProperty() {
    return this.vertexProperties.then(function(properties) {
      for(var i=0; i<properties.length; i++) {
        if (properties[i].type === 'boolean') {
          return properties[i];
        }
      }
    });
  }

  getCollectionProxy(type) {
    let self = this;
    let filterJson = {
      'type': 'set',
      'filter': {
        'type': type,
        'filterExpression': 'true',
        'binaryOperation': false
      },
      'collectionName': null
    };
    return core.postCollectionFromFilter(self, filterJson).then(function(collectionName) {
      return core.getCollectionProxy(self, collectionName);
    });
  }

  getElements(start, size, type) {
    let self = this;
    return self.getCollectionProxy(type).then(function(proxy) {
      return collectionProxy.getElements(self.session, proxy.proxyId, start, size);
    }).then(function(elements) {
      let collection = [];
      for(let i=0; i<elements.length; i++) {
        if (type === 'VERTEX') {
          collection.push(new vertex(elements[i], self));
        } else if (type === 'EDGE') {
          collection.push(new edge(elements[i], self));
        }
      }
      return collection;
    });
  }

  getVertices(start, size) {
    return this.getElements(start, size, 'VERTEX');
  }

  getEdges(start, size) {
    return this.getElements(start, size, 'EDGE');
  }

  /**
   * Iterates over the vertices
   * @function iterateVertices
   * @memberof module:classes/graph
   * @instance
   * @param {function} callback - the function to be used over each element
   * @returns {module:classes/vertex} each vertex
   */
  iterateVertices(callback) {
    return this.iterate(callback, 'VERTEX');
  }

  /**
   * Iterates over the edges
   * @function iterateEdges
   * @memberof module:classes/graph
   * @instance
   * @param {function} callback - the function to be used over each element
   * @returns {module:classes/edge} each edge
   */
  iterateEdges(callback) {
    return this.iterate(callback, 'EDGE');
  }

  iterate(callback, type) {
    let self = this;
    let f = null;
    return self.getCollectionProxy(type).then(function(proxy) {
      return proxy.size;
    }).then(function(numResults) {
      if (type === 'VERTEX') {
        f = function(start, size, iterate) {return self.getVertices(start, size).then(iterate)};
      } else if (type === 'EDGE') {
        f = function(start, size, iterate) {return self.getEdges(start, size).then(iterate)};
      }
      return iterator.iterate(callback, self.session.prefetchSize, numResults, f);
    });
  }

  /**
   * Check whether an in-memory representation of a graph is fresh
   * @member {boolean} fresh
   * @memberof module:classes/graph
   * @instance
   */
  get fresh() {
    return core.isFresh(this);
  }

  /**
   * Create a transposed version of a graph
   * @function transpose
   * @memberof module:classes/graph
   * @instance
   * @param {Array.string} [options.vertexPropNames] - vertex properties
   * @param {Array.string} [options.edgePropNames] - edge properties
   * @param {Object.<string, string>} [options.edgeLabelMapping] - edge labels renaming
   * @param {boolean} [options.inPlace=false] - mutate source graph or create a copy
   * @param {string} [options.newGraphName] - new graph name
   * @returns {module:classes/graph} graph
   */
  transpose(options) {
    let self = this;
    let defaultOptions = {
      'vertexPropNames': null,
      'edgePropNames': null,
      'inPlace': false,
      'newGraphName': null,
      'edgeLabelMapping': null
    };
    let finalOptions = common.getOptions(defaultOptions, options);
    return core.postCreateTransposedGraph(self, finalOptions).then(function(result) {
      return new Graph(result, self.session);
    });
  }

  /**
   * Create an undirected version of a graph
   * @function undirect
   * @memberof module:classes/graph
   * @instance
   * @param {Array.string} [options.vertexPropNames] - vertex properties
   * @param {Array.string} [options.edgePropNames] - edge properties
   * @param {boolean} [options.inPlace=false] - create new graph?
   * @param {string} [options.newGraphName] - new graph name
   * @param {boolean} [options.noSelfEdges=true] - remove self edges?
   * @param {boolean} [options.noTrivialVertices=false] - remove trivial vertices?
   * @param {EdgeStrategy} [edgeStrategy] - edgeStrategy
   * @returns {module:classes/graph} graph
   */
  undirect(options) {
    let self = this;
    let defaultOptions = {
      'vertexPropNames': null,
      'edgePropNames': null,
      'inPlace': false,
      'newGraphName': null,
      'noTrivialVertices': false,
      'edgeStrategy': new edgeStrategy.PickAnyStrategy(true)
    };
    let finalOptions = common.getOptions(defaultOptions, options);
    return core.postCreateUndirectedGraph(self, finalOptions).then(function(result) {
      return new Graph(result, self.session);
      });
  }

  /**
   * Create a sorted version of a graph
   * @function sortByDegree
   * @memberof module:classes/graph
   * @instance
   * @param {object} [options] - options
   * @param {Array.string} [options.nodePropNames] - vertex properties
   * @param {Array.string} [options.edgePropNames] - edge properties
   * @param {string} [options.newGraphName] - new graph name
   * @param {boolean} [options.ascending=false] - sort order
   * @param {boolean} [options.useOutDegree=false] - degree sorting mode
   * @param {boolean} [options.inPlace=false] - it specifies if the graph should be mutated in place or a new one
   *   should be created
   * @returns {module:classes/graph} graph
   */
  sortByDegree(options) {
    let self = this;
    let defaultOptions = {
      'nodePropNames': null,
      'edgePropNames': null,
      'newGraphName': null,
      'ascending': false,
      'useOutDegree': false,
      'inPlace': false
    };
    let finalOptions = common.getOptions(defaultOptions, options);
    return core.postSortByDegree(self, finalOptions).then(function(result) {
      return new Graph(result, self.session);
    });
  }

  /**
   * Create a simplified version of a graph
   * @function simplify
   * @memberof module:classes/graph
   * @instance
   * @param {Array.string} [options.vertexPropNames] - vertex properties
   * @param {Array.string} [options.edgePropNames] - edge properties
   * @param {boolean} [options.inPlace=false] - create new graph?
   * @param {string} [options.newGraphName] - new graph name
   * @param {boolean} [options.noSelfEdges=true] - remove self edges?
   * @param {boolean} [options.noTrivialVertices=false] - remove trivial vertices?
   * @param {EdgeStrategy} [edgeStrategy] - edgeStrategy
   * @returns {module:classes/graph} graph
   */
  simplify(options) {
    let self = this;
    let defaultOptions = {
      'vertexPropNames': null,
      'edgePropNames': null,
      'inPlace': false,
      'newGraphName': null,
      'noTrivialVertices': true,
      'edgeStrategy': new edgeStrategy.PickAnyStrategy(true)
    };
    let finalOptions = common.getOptions(defaultOptions, options);
    return core.postSimplifyGraph(self, finalOptions).then(function(result) {
      return new Graph(result, self.session);
    });
  }

  /**
   * Sparsifies the given graph and returns a new graph with less edges
   * @function sparsify
   * @memberof module:classes/graph
   * @instance
   * @param {object} [options] - options
   * @param {number} options.e - the sparsification coefficient
   * @param {Array.string} [options.nodePropNames] - vertex properties
   * @param {Array.string} [options.edgePropNames] - edge properties
   * @param {string} [options.newGraphName] - new graph name
   * @returns {module:classes/graph} graph
   */
  sparsify(e, options) {
    let self = this;
    let defaultOptions = {
      "nodePropNames": null,
      "edgePropNames": null,
      "newGraphName": null
    };
    let finalOptions = common.getOptions(defaultOptions, options);
    finalOptions.e = e;
    return core.createSparsifiedSubgraph(self, finalOptions).then(function(result) {
      return new Graph(result, self.session);
    });
  }

  /**
   * Picks a random vertex in the graph
   * @function pickRandomVertex
   * @memberof module:classes/graph
   * @instance
   * @returns {module:classes/vertex} a random vertex
   */
  pickRandomVertex() {
    let self = this;
    return core.getRandomNode(self).then(function(result) {
      return new vertex(result.value, self);
    });
  }

  /**
   * Checks whether a given graph is a bipartite graph
   * @function isBipartiteGraph
   * @memberof module:classes/graph
   * @instance
   * @param {string} propertyName - boolean vertex property name
   * @returns {boolean} true if the graph is a bipartite graph, false otherwise
   */
  isBipartiteGraph(propertyName) {
    return this.session.analyst.bipartiteCheck(this, propertyName);
  }

  /**
   * Submits a pattern matching query
   * @function queryPgql
   * @memberof module:classes/graph
   * @instance
   * @param {string} query - query string in PGQL
   * @returns {module:classes/resultSet} the query result set
   */
  queryPgql(query) {
    let self = this;
    let queryJson = {
      'pgqlQuery': query
    };
    return core.queryPgql(self, queryJson).then(function(result) {
      return resultSetService.getResultSetElements(self, result.resultSetId).then(function(elements) {
        let collection = [];
        for(var i=0; i<elements.length; i++) {
          collection.push(new resultElement(elements[i].elementType, elements[i].varName, elements[i].vertexEdgeIdType));
        }
        return new resultSet(result, collection, self);
      });
    });
  }

  createCollection(type, elementType, name) {
    let self = this;
    let localName = typeof name !== 'undefined' ? name : null;
    let collectionJson = {
      'type': type,
      'elementType': elementType,
      'collectionName': localName
    };
    return core.postCollection(self, collectionJson).then(function(collectionName) {
      return new collectionClass(collectionName, collectionJson.elementType, collectionJson.type, self);
    })
  }

  /**
   * Creates a new vertex set
   * @function createVertexSet
   * @memberof module:classes/graph
   * @instance
   * @param {string} [name] - vertex set name
   * @returns {module:classes/collection} the newly created vertex set
   */
  createVertexSet(name) {
    return this.createCollection('set', 'vertex', name);
  }

  /**
   * Creates a new vertex sequence
   * @function createVertexSequence
   * @memberof module:classes/graph
   * @instance
   * @param {string} [name] - vertex sequence name
   * @returns {module:classes/collection} the newly created vertex sequence
   */
  createVertexSequence(name) {
    return this.createCollection('sequence', 'vertex', name);
  }

  /**
   * Creates a new edge set
   * @function createEdgeSet
   * @memberof module:classes/graph
   * @instance
   * @param {string} [name] - edge set name
   * @returns {module:classes/collection} the newly created edge set
   */
  createEdgeSet(name) {
    return this.createCollection('set', 'edge', name);
  }

  /**
   * Creates a new edge sequence
   * @function createEdgeSequence
   * @memberof module:classes/graph
   * @instance
   * @param {string} [name] - edge sequence name
   * @returns {module:classes/collection} the newly created edge sequence
   */
  createEdgeSequence(name) {
    return this.createCollection('sequence', 'edge', name);
  }

  createProperty(type, entityType, dimension, name) {
    let self = this;
    let propertyJson = {
      'entityType': entityType,
      'type': type,
      'name': typeof name !== 'undefined' ? name : null,
      'hardName': true,
      'dimension': dimension
    };
    return core.postProperty(self, propertyJson).then(function(result) {
      return new property(result, self);
    })
  }

  /**
   * Creates a vertex property
   * @function createVertexProperty
   * @memberof module:classes/graph
   * @instance
   * @param {string} type - property type
   * @param {string} [name] - property name
   * @returns {module:classes/property} the newly created vertex property
   */
  createVertexProperty(type, name) {
    return this.createProperty(type, 'vertex', 0, name);
  }

  /**
   * Creates an edge property
   * @function createEdgeProperty
   * @memberof module:classes/graph
   * @instance
   * @param {string} type - property type
   * @param {string} [name] - property name
   * @returns {module:classes/property} the newly created edge property
   */
  createEdgeProperty(type, name) {
    return this.createProperty(type, 'edge', 0, name);
  }

  /**
   * Creates a vertex vector property
   * @function createVertexVectorProperty
   * @memberof module:classes/graph
   * @instance
   * @param {string} type - property type
   * @param {number} dimension - property dimension
   * @param {string} [name] - property name
   * @returns {module:classes/property} the newly created vertex vector property
   */
  createVertexVectorProperty(type, dimension, name) {
    return this.createProperty(type, 'vertex', dimension, name);
  }

  /**
   * Creates an edge vector property
   * @function createEdgeVectorProperty
   * @memberof module:classes/graph
   * @instance
   * @param {string} type - property type
   * @param {number} dimension - property dimension
   * @param {string} [name] - property name
   * @returns {module:classes/property} the newly created edge vector property
   */
  createEdgeVectorProperty(type, dimension, name) {
    return this.createProperty(type, 'edge', dimension, name);
  }

  createScalar_(type, dimension, name) {
    let self = this;
    let localName = typeof name !== 'undefined' ? name : null;
    let scalarJson = {
      'type': type,
      'scalarName': localName,
      'dimension': dimension
    };
    return core.postScalar(self, scalarJson).then(function(scalarName) {
      return new scalar(scalarName, scalarJson.type, scalarJson.dimension, self);
    })
  }

  /**
   * Create a scalar
   * @function createScalar
   * @memberof module:classes/graph
   * @instance
   * @param {string} type - scalar type
   * @param {string} [name] - scalar name
   * @returns {module:classes/scalar} the newly created scalar
   */
  createScalar(type, name) {
    return this.createScalar_(type, 0, name);
  }

  /**
   * Create a vector scalar
   * @function createVectorScalar
   * @memberof module:classes/graph
   * @instance
   * @param {string} type - scalar type
   * @param {number} dimension - scalar dimension
   * @param {string} [name] - scalar name
   * @returns {module:classes/scalar} the newly created vector scalar
   */
  createVectorScalar(type, dimension, name) {
    return this.createScalar_(type, dimension, name);
  }

  combinePropertiesIntoVectorProperty(propertyNames, entityType, name) {
    let self = this;
    let localName = typeof name !== 'undefined' ? name : null;
    let propJson = {
      'entityType': entityType,
      'name': localName,
      'propertyNames': propertyNames
    };
    return core.postCombine(self, propJson).then(function(result) {
      return new property(result, self);
    })
  }

  /**
   * Creates a new vertex vector property by combining properties list.
   * @function combineVertexPropertiesIntoVectorProperty
   * @memberof module:classes/graph
   * @instance
   * @param {string[]} propertyNames - property names
   * @param {string} [name] - new property name
   * @returns {module:classes/property} the newly created property
   */
  combineVertexPropertiesIntoVectorProperty(propertyNames, name) {
    return this.combinePropertiesIntoVectorProperty(propertyNames, "vertex", name);
  }

  /**
   * Creates a new edge vector property by combining properties list.
   * @function combineEdgePropertiesIntoVectorProperty
   * @memberof module:classes/graph
   * @instance
   * @param {string[]} propertyNames - property names
   * @param {string} [name] - new property name
   * @returns {module:classes/property} the newly created property
   */
  combineEdgePropertiesIntoVectorProperty(propertyNames, name) {
    return this.combinePropertiesIntoVectorProperty(propertyNames, "edge", name);
  }

  /**
   * Create a map
   * @function createMap
   * @memberof module:classes/graph
   * @instance
   * @param {string} keyType - type of the keys
   * @param {string} valType - type of the values
   * @param {string} [name] - map name
   * @returns {module:classes/map} the newly created map
   */
  createMap(keyType, valType, name) {
    let self = this;
    let localName = typeof name !== 'undefined' ? name : null;
    let mapJson = {
      'keyType': keyType,
      'valType': valType,
      'mapName': localName
    };
    return core.postMap(self, mapJson).then(function(mapName) {
      return new map(mapName, mapJson.keyType, mapJson.valType, self);
    })
  }

  /**
   * Looks up a vertex by id
   * @function getVertex
   * @memberof module:classes/graph
   * @instance
   * @param {number} id - vertex id
   * @returns {module:classes/vertex} a vertex
   */
  getVertex(id) {
    let self = this;
    return self.hasVertex(id).then(function(result) {
      if (result) {
        return new vertex(id, self);
      }
    });
  }

  /**
   * Looks up an edge by id
   * @function getEdge
   * @memberof module:classes/graph
   * @instance
   * @param {number} id - edge id
   * @returns {module:classes/edge} an edge
   */
  getEdge(id) {
    let self = this;
    return self.hasEdge(id).then(function(result) {
      if (result) {
        return new edge(id, self);
      }
    });
  }

  /**
   * Looks up whether the graph has a vertex with the given id
   * @function hasVertex
   * @memberof module:classes/graph
   * @instance
   * @param {number} id - vertex id
   * @returns {boolean} true if the graph has a vertex with the given id
   */
  hasVertex(id) {
    return core.exists(this, id, 'vertex', this.vertexIdType);
  }

  /**
   * Looks up whether the graph has an edge with the given id
   * @function hasEdge
   * @memberof module:classes/graph
   * @instance
   * @param {number} id - edge id
   * @returns {boolean} true if the graph has an edge with the given id
   */
  hasEdge(id) {
    return core.exists(this, id, 'edge', this.edgeIdType);
  }

  /**
   * Create a subgraph of this graph
   * @function filter
   * @memberof module:classes/graph
   * @instance
   * @param {module:classes/filters/graphFilterWithExpression} filter - filter expression
   * @param {object} [options] - options
   * @param {Array.string} [options.nodePropNames] - vertex properties
   * @param {Array.string} [options.edgePropNames] - edge properties
   * @param {string} [options.newGraphName] - new graph name
   * @returns {module:classes/graph} resulting graph
   */
  filter(filter, options) {
    let self = this;
    let defaultOptions = {
      'nodePropNames': null,
      'edgePropNames': null,
      'newGraphName': null
    };
    let graphFilter = {
      'type': filter.type,
      'filterExpression': filter.filterExpression,
      'binaryOperation': filter.binaryOperation
    };
    let finalOptions = common.getOptions(defaultOptions, options);
    finalOptions.graphFilter = graphFilter;
    return core.postCreateSubgraphFromFilter(self, finalOptions).then(function(newGraph) {
      return new Graph(newGraph, self.session);
    });
  }

  /**
   * Create a bipartite version of this graph from a set of vertices as left set
   * @function bipartiteSubGraphFromLeftSet
   * @memberof module:classes/graph
   * @instance
   * @param {module:classes/collection} collection - vertex set representing the left side
   * @param {object} [options] - options
   * @param {Array.string} [options.nodePropNames] - vertex properties
   * @param {Array.string} [options.edgePropNames] - edge properties
   * @param {string} [options.newGraphName] - new graph name
   * @param {string} [options.isLeftPropName] - boolean property name
   * @returns {module:classes/graph} resulting graph
   */
  bipartiteSubGraphFromLeftSet(collection, options) {
    let self = this;
    let defaultOptions = {
      'nodePropNames': null,
      'edgePropNames': null,
      'newGraphName': null,
      'isLeftPropName': null
    };
    let finalOptions = common.getOptions(defaultOptions, options);
    finalOptions.nodeSetName = collection.name;
    return core.postCreateBipartiteSubgraphFromLeftSet(self, finalOptions).then(function(newGraph) {
      return new Graph(newGraph, self.session);
    })
  }

  /**
   * Create a bipartite version of this graph from vertices with in-degree = 0
   * @function bipartiteSubGraphFromLeftSet
   * @memberof module:classes/graph
   * @instance
   * @param {object} [options] - options
   * @param {Array.string} [options.nodePropNames] - vertex properties
   * @param {Array.string} [options.edgePropNames] - edge properties
   * @param {string} [options.newGraphName] - new graph name
   * @param {string} [options.isLeftPropName] - boolean property name
   * @returns {module:classes/graph} resulting graph
   */
  bipartiteSubGraphFromInDegree(options) {
    let self = this;
    let defaultOptions = {
      'nodePropNames': null,
      'edgePropNames': null,
      'newGraphName': null,
      'isLeftPropName': null
    };
    let finalOptions = common.getOptions(defaultOptions, options);
    return core.postCreateBipartiteSubgraphFromInDegree(self, finalOptions).then(function(newGraph) {
      return new Graph(newGraph, self.session);
    })
  }

  /**
   * Stores this graph in a given file format on a file system
   * @function store
   * @memberof module:classes/graph
   * @instance
   * @param {object} options - options
   * @param {object} options.graphConfig - graph configuration, if set this variable replaces the other variables
   *   except options.overwrite
   * @param {boolean} [options.overwrite=false] - overwrite any existing file?
   * @param {(PGB|EDGE_LIST|ADJ_LIST|GRAPHML)} [options.format=ADJ_LIST] - single file format
   * @param {string} options.targetPath - the path the graph should be written to
   * @param {module:classes/property[]} [options.vertexProps] - vertex properties collection
   * @param {module:classes/property[]} [options.edgeProps] - edge properties collection
   * @returns {object} resulting graph config
   */
  store(options) {
    let self = this;
    let defaultOptions = {
      graphConfig: null,
      overwrite: false,
      format: common.storeFormat.ADJ_LIST,
      targetPath: null,
      vertexProps: null,
      edgeProps: null
    };
    let finalOptions = common.getOptions(defaultOptions, options);
    let vProps;
    let eProps;
    let cb = function(row) {
      return {type: row.type, name: row.name};
    }
    let graphJson;
    return self.vertexProperties.then(function(properties) {
      vProps = properties.map(cb);
      return self.edgeProperties;
    }).then(function(properties) {
      eProps = properties.map(cb);
      let localGraphConfig;
      if (finalOptions.graphConfig != null) {
        localGraphConfig = finalOptions.graphConfig;
      } else {
        localGraphConfig = {
          'format': finalOptions.format,
          'uri': finalOptions.targetPath,
          'vertex_id_type': self.vertexIdType,
          'error_handling': self.config.error_handling,
          'loading': self.config.loading,
          'vertex_props': finalOptions.vertexProps != null ? finalOptions.vertexProps.map(cb) : vProps,
          'attributes': {},
          'edge_props': finalOptions.edgeProps != null ? finalOptions.edgeProps.map(cb) : eProps
        };
      }
      graphJson = {
        'graphConfig': localGraphConfig,
        'overwrite': finalOptions.overwrite
      };
      return core.postStoreGraph(self, graphJson);
    }).then(function(result) {
      return graphJson.graphConfig;
    });
  }

  /**
   * Creates a copy of this graph
   * @function clone
   * @memberof module:classes/graph
   * @instance
   * @param {object} [options] - options
   * @param {Array.string} [options.nodePropNames] - vertex properties
   * @param {Array.string} [options.edgePropNames] - edge properties
   * @param {string} [options.newGraphName] - new graph name
   * @returns {module:classes/graph} resulting graph
   */
  clone(options) {
    let self = this;
    let defaultOptions = {
      'nodePropNames': null,
      'edgePropNames': null,
      'newGraphName': null
    };
    let finalOptions = common.getOptions(defaultOptions, options);
    return core.postGraphClone(self, finalOptions).then(function(newGraph) {
      return new Graph(newGraph, self.session);
    })
  }

  /**
   * Renames this graph
   * @function rename
   * @memberof module:classes/graph
   * @instance
   * @param {string} name - the new name
   * @returns {module:classes/graph} the resulting graph
   */
  rename(name) {
    let self = this;
    let graphJson = {
      'newGraphName': name
    };
    return core.postRenameGraph(self, graphJson).then(function(result) {
      self.name = name;
      return self;
    });
  }

  /**
   * Publish this graph
   * @function publish
   * @memberof module:classes/graph
   * @instance
   * @param {Array.string} [vertexPropNames] - vertex properties
   * @param {Array.string} [edgePropNames] - edge properties
   * @returns {module:classes/graph} the resulting graph
   */
  publish(nodePropNames, edgePropNames) {
    let self = this;
    let graphJson = {
      'vertexPropNames': nodePropNames === undefined ? property.NONE : nodePropNames,
      'edgePropNames': edgePropNames === undefined ? property.NONE : edgePropNames
    };
    return core.postPublishGraph(self, graphJson).then(function(result) {
      return self;
    });
  }

  /**
   * Checks if this graph is published
   * @function isPublished
   * @memberof module:classes/graph
   * @instance
   * @returns {boolean} true if the graph is published
   */
  isPublished() {
    return core.isPublishedGraph(this);
  }

  /**
   * Destroy a graph with all its properties
   * @function destroy
   * @memberof module:classes/graph
   * @instance
   * @returns {null} null
   */
  destroy() {
    return core.delGraph(this);
  }

}