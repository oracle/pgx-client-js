'use strict'

// services
const core = require('../services/core.js');

// classes
const argumentBuilder = require('../classes/argumentBuilder.js');

/**
 * A scalar value
 * @module classes/scalar
 */
module.exports = class Scalar {

  /**
   * Creates a scalar
   * @param {string} name - scalar name
   * @param {string} type - scalar type
   * @param {number} dimension - scalar dimension
   * @param {module:classes/graph} graph - graph
   */
  constructor(name, type, dimension, graph) {
    this.name = name;
    this.type = type;
    this.dimension = dimension;
    this.graph = graph;
  }

  /**
   * Gets the scalar value
   * @function get
   * @memberof module:classes/scalar
   * @instance
   * @returns {(string|number|Array.number)} scalar value
   */
  get() {
    let self = this;
    return core.getScalar(this.graph, this.name).then(function(result) {
      return self.dimension > 0 ? JSON.parse(result.value).vect : JSON.parse(result.value);
    });
  }

  /**
   * Sets the scalar value
   * @function set
   * @memberof module:classes/scalar
   * @instance
   * @param {(string|number)} value - the value to be assigned
   * @returns {module:classes/scalar} the resulting scalar
   */
  set(value) {
    let self = this;
    let localValue = self.dimension > 0 ? {'vect': value, 'type': self.type} : value;
    let isVector = self.dimension > 0 ? true : false;
    let scalarJson = {
      'value': new argumentBuilder().setType(self.type).setValue(JSON.stringify(localValue)).isVector(isVector).build()
    };
    return core.postScalarName(self.graph, self.name, scalarJson).then(function(result) {
      return self;
    });
  }

  /**
   * Destroy a scalar
   * @function destroy
   * @memberof module:classes/scalar
   * @instance
   * @returns {null} null
   */
  destroy() {
    return core.delScalar(this);
  }

}