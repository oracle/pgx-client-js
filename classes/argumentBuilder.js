'use strict'

module.exports = class argumentBuilder {

  constructor(targetPool, expectedReturnType) {
    if (targetPool != null) {
      this.jsonContent = {
        args: [],
        targetPool: targetPool,
        expectedReturnType: expectedReturnType
      };
    } else {
      this.jsonContent = {};
    }
  }

  setElement(key, value) {
    this.jsonContent[key] = value;
    return this;
  }

  setElementArg(value) {
    this.jsonContent.args.push(value);
    return this;
  }

  setType(type) {
    return this.setElement('type', type);
  }

  setValue(value) {
    return this.setElement('value', value);
  }

  isVector(isVectorParam) {
    return this.setElement('isVector', isVectorParam);
  }

  addGraphArg(graphName) {
    return this.setElementArg({type: 'GRAPH', value: graphName});
  }

  addNodePropertyArg(nodeProperty) {
    return this.setElementArg({type: 'NODE_PROPERTY', value: nodeProperty});
  }

  addMapArg(map) {
    return this.setElementArg({type: 'MAP', value: map});
  }

  addEdgePropertyArg(edgeName) {
    return this.setElementArg({type: 'EDGE_PROPERTY', value: edgeName});
  }

  addNodeIdInArg(id) {
    return this.setElementArg({type: 'NODE_ID_IN', value: id});
  }

  addIntInArg(int) {
    return this.setElementArg({type: 'INT_IN', value: int});
  }

  addDoubleInArg(double) {
    return this.setElementArg({type: 'DOUBLE_IN', value: double});
  }

  addBoolInArg(bool) {
    return this.setElementArg({type: 'BOOL_IN', value: bool});
  }

  addLongInArg(long) {
    return this.setElementArg({type: 'LONG_IN', value: long});
  }

  addCollectionArg(collection) {
    return this.setElementArg({type: 'COLLECTION', value: collection});
  }

  addDoubleOutArg(double) {
    return this.setElementArg({type: 'DOUBLE_OUT', value: double});
  }

  build() {
    return this.jsonContent;
  }

}