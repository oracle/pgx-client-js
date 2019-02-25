'use strict'

// services
const core = require('../services/core.js');

// classes
const edge = require('../classes/edge.js');

/**
 * A vertex of a graph
 * @module classes/vertex
 */
module.exports = class Vertex {

  /**
   * Creates a vertex
   * @param {number} id - vertex id
   * @param {module:classes/graph} graph - graph
   * @param {number} [partitionIndex] - partition index
   */
  constructor(id, graph, partitionIndex) {
    this.id = id;
    this.type = graph.vertexIdType;
    this.graph = graph;
    this.partitionIndex = partitionIndex;
  }

  /**
   * Returns all incoming edges of this vertex
   * @member {module:classes/edge[]} inEdges
   * @memberof module:classes/vertex
   * @instance
   */
  get inEdges() {
    let self = this;
    let collection = [];
    return core.getEdges(self.graph, self.id, 'INCOMING', self.graph.edgeIdType).then(function(result) {
      for(var i=0; i<result.length; i++) {
        collection.push(new edge(result[i], self.graph));
      }
      return collection;
    });
  }

  /**
   * Returns all incoming neighbors of this vertex
   * @member {module:classes/vertex[]} inNeighbors
   * @memberof module:classes/vertex
   * @instance
   */
  get inNeighbors() {
    let self = this;
    let collection = [];
    return core.getNeighbors(self.graph, self.id, 'INCOMING', self.type).then(function(result) {
      for(var i=0; i<result.length; i++) {
        collection.push(new Vertex(result[i], self.graph));
      }
      return collection;
    });
  }

  /**
   * Returns all outgoing edges of this vertex
   * @member {module:classes/edge[]} outEdges
   * @memberof module:classes/vertex
   * @instance
   */
  get outEdges() {
    let self = this;
    let collection = [];
    return core.getEdges(self.graph, self.id, 'OUTGOING', self.graph.edgeIdType).then(function(result) {
      for(var i=0; i<result.length; i++) {
        collection.push(new edge(result[i], self.graph));
      }
      return collection;
    });
  }

  /**
   * Returns all outgoing neighbors of this vertex
   * @member {module:classes/vertex[]} outNeighbors
   * @memberof module:classes/vertex
   * @instance
   */
  get outNeighbors() {
    let self = this;
    let collection = [];
    return core.getNeighbors(self.graph, self.id, 'OUTGOING', self.type).then(function(result) {
      for(var i=0; i<result.length; i++) {
        collection.push(new Vertex(result[i], self.graph));
      }
      return collection;
    });
  }

  /**
   * Gets the value of a property
   * @function getProperty
   * @memberof module:classes/vertex
   * @instance
   * @param {string} name - The property name
   * @returns {number} The value
   */
  getProperty(name) {
    let self = this;
    let propJson = {
      'key': {
        'type': self.type,
        'value': self.id
      },
      'entityType': 'vertex'
    };
    return core.postPropertyGet(self.graph, name, propJson).then(function(result) {
      return result.value;
    });
  }

  /**
   * Sets the value of a property
   * @function setProperty
   * @memberof module:classes/vertex
   * @instance
   * @param {string} name - The property name
   * @param {number} value - The value of the property
   * @returns {number} The value
   */
  setProperty(name, value) {
    let self = this;
    let mapValues = {};
    mapValues[self.id] = value;
    return self.graph.getVertexProperty(name).then(function(property) {
      let propJson = {
        'entityType': 'vertex',
        'keyType': self.type,
        'valueType': property.type,
        'defaultValue': null,
        'values': JSON.stringify(mapValues),
        'isVector': false
      };
      return core.postPropertySet(self.graph, name, propJson).then(function(result) {
        return self.getProperty(name);
      });
    });
  }

  /**
   * Checks whether this vertex is null
   * @function isNil
   * @memberof module:classes/vertex
   * @instance
   * @returns {boolean} true, if is null
   */
  isNil() {
    return this.id == null;
  }

}