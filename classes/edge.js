/**
 * Copyright (c) 2019 Oracle and/or its affiliates. All rights reserved.
 *
 * Licensed under the Universal Permissive License v 1.0 as shown at
 * http://oss.oracle.com/licenses/upl.
 */
'use strict'

// services
const core = require('../services/core.js');

/**
 * An edge of a graph
 * @module classes/edge
 */
module.exports = class Edge {

  /**
   * Creates an edge
   * @param {number} id - edge id
   * @param {string} type - edge type
   * @param {module:classes/graph} graph - graph
   */
  constructor(id, graph) {
    this.id = id;
    this.type = graph.edgeIdType;
    this.graph = graph;
  }

  /**
   * Gets source vertex
   * @member {module:classes/vertex} source
   * @memberof module:classes/edge
   * @instance
   */
  get source() {
    let self = this;
    return core.getVertexFromEdge(self.graph, self.id, 'INCOMING').then(function(result) {
      let vertex = require('../classes/vertex.js'); // to avoid circular reference issue
      return new vertex(result.id, self.graph);
    });
  }

  /**
   * Gets destination vertex
   * @member {module:classes/vertex} destination
   * @memberof module:classes/edge
   * @instance
   */
  get destination() {
    let self = this;
    return core.getVertexFromEdge(self.graph, self.id, 'OUTGOING').then(function(result) {
      let vertex = require('../classes/vertex.js'); // to avoid circular reference issue
      return new vertex(result.id, self.graph);
    });
  }

  /**
   * Gets the value of a property
   * @function getProperty
   * @memberof module:classes/edge
   * @instance
   * @param {string} name - The property name
   * @returns {number} The value
   */
  getProperty(name) {
    let self = this;
    return self.graph.getEdgeProperty(name).then(function(property){
      if(!property){
        throw new Error("edge property: " + name + " is not found.");
      }

      return core.getPropertyValue(self.graph, property, self.id, self.graph.edgeIdType);
    }).then(function(result) {
      return result.value;
    });
  }

  /**
   * Sets the value of a property
   * @function setProperty
   * @memberof module:classes/edge
   * @instance
   * @param {string} name - The property name
   * @param {number} value - The value of the property
   * @returns {number} The value
   */
  setProperty(name, value) {
    let self = this;
    return self.graph.getEdgeProperty(name).then(function(property) {
      if(!property){
        throw new Error("edge property: " + name + " is not found.");
      }

      return property.set(self.id, value).then(function(result) {
        return self.getProperty(name);
      });
    });
  }

  /**
   * Gets the label from an edge
   * @function getEdgeLabel
   * @memberof module:classes/edge
   * @instance
   * @returns {string} The label
   */
  get label() {
    let self = this;

    return core.getEdgeLabel(self.graph, self.id, self.type);
  }

}
