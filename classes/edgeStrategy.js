'use strict'

class KeepAllStrategy {
  constructor(noSelfEdges){
    this.strategyType = 'KEEP_ALL';
    this.noSelfEdges = noSelfEdges || true;
  }
}

module.exports =
{
MergingStrategy: class MergingStrategy {
  constructor(mergingStrategies, labelMergingStrategy, keepUserDefinedEdgeKeys, noSelfEdges){
    this.mergingStrategies = mergingStrategies;
    this.keepUserDefinedEdgeKeys = keepUserDefinedEdgeKeys;
    this.labelMergingStrategy = labelMergingStrategy;
    this.strategyType = 'MERGE';
    this.noSelfEdges = noSelfEdges || true;
  }
},
PickAnyStrategy : class PickAnyStrategy {
  constructor(noSelfEdges){
    this.strategyType = 'PICK_ANY';
    this.noSelfEdges = noSelfEdges || true;
  }
},
KeepAllStrategy: KeepAllStrategy,
PickByEdgeId: class PickByEdgeId {
  constructor(pickingStrategyFunction, noSelfEdges){
    this.pickingStrategyFunction = pickingStrategyFunction || 'MAX';
    this.strategyType = 'PICK_BY_EDGE_ID';
    this.noSelfEdges = noSelfEdges || true;
  }
},
PickByProperty: class PickByProperty {
  constructor(edgePropertyIndex, pickingStrategyFunction, noSelfEdges) {
    this.edgePropertyIndex = edgePropertyIndex;
    this.pickingStrategyFunction = pickingStrategyFunction;
    this.strategyType = 'PICK_BY_PROPERTY';
    this.noSelfEdges = noSelfEdges || true;
  }
}
}