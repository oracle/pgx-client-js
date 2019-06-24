'use strict'

const common = require('./common.js');
const argumentBuilder = require(common.pgxDir + '/classes/argumentBuilder.js');
const assert = require('assert');

let analysisJson = {};
let objTest = {};

beforeEach(function() {
  analysisJson = new argumentBuilder('ANALYSIS_POOL', 'boolean');
  objTest = {};
});

describe('argumentBuilder', function () {
  it('analysisJson should have targetPool and expectedReturnType', function() {
    assert(analysisJson.jsonContent.targetPool === 'ANALYSIS_POOL' &&
      analysisJson.jsonContent.expectedReturnType === 'boolean');
  });
  it('setElement should have foo', function() {
    assert(analysisJson.setElement('foo','bar').build().foo);
  });
  it('setElementArg should have 1 args element', function() {
    assert.equal(1, analysisJson.setElementArg('foo').build().args.length);
  });
  it('setType should have type', function() {
    assert(analysisJson.setType('foo').build().type);
  });
  it('setValue should have value', function() {
    assert(analysisJson.setValue('foo').build().value);
  });
  it('isVector should be true', function() {
    assert.equal('true', analysisJson.isVector('true').build().isVector);
  });
  it('addGraphArg should have type and value', function() {
    objTest = analysisJson.addGraphArg('foo').build().args[0];
    assert((objTest.type === 'GRAPH') && (objTest.value === 'foo'));
  });
  it('addNodePropertyArg should have type and value', function() {
    objTest = analysisJson.addNodePropertyArg('foo').build().args[0];
    assert((objTest.type === 'NODE_PROPERTY') && (objTest.value === 'foo'));
  });
  it('addMapArg should have type and value', function() {
    objTest = analysisJson.addMapArg('foo').build().args[0];
    assert((objTest.type === 'MAP') && (objTest.value === 'foo'));
  });
  it('addEdgePropertyArg should have type and value', function() {
    objTest = analysisJson.addEdgePropertyArg('foo').build().args[0];
    assert((objTest.type === 'EDGE_PROPERTY') && (objTest.value === 'foo'));
  });
  it('addNodeIdInArg should have type and value', function() {
    objTest = analysisJson.addNodeIdInArg('foo').build().args[0];
    assert((objTest.type === 'NODE_ID_IN') && (objTest.value === 'foo'));
  });
  it('addIntInArg should have type and value', function() {
    objTest = analysisJson.addIntInArg('foo').build().args[0];
    assert((objTest.type === 'INT_IN') && (objTest.value === 'foo'));
  });
  it('addDoubleInArg should have type and value', function() {
    objTest = analysisJson.addDoubleInArg('foo').build().args[0];
    assert((objTest.type === 'DOUBLE_IN') && (objTest.value === 'foo'));
  });
  it('addBoolInArg should have type and value', function() {
    objTest = analysisJson.addBoolInArg('foo').build().args[0];
    assert((objTest.type === 'BOOL_IN') && (objTest.value === 'foo'));
  });
  it('addLongInArg should have type and value', function() {
    objTest = analysisJson.addLongInArg('foo').build().args[0];
    assert((objTest.type === 'LONG_IN') && (objTest.value === 'foo'));
  });
  it('addCollectionArg should have type and value', function() {
    objTest = analysisJson.addCollectionArg('foo').build().args[0];
    assert((objTest.type === 'COLLECTION') && (objTest.value === 'foo'));
  });
  it('addDoubleOutArg should have type and value', function() {
    objTest = analysisJson.addDoubleOutArg('foo').build().args[0];
    assert((objTest.type === 'DOUBLE_OUT') && (objTest.value === 'foo'));
  });
  it('build should have targetPool and expectedReturnType', function() {
    assert(analysisJson.jsonContent.targetPool === 'ANALYSIS_POOL' &&
      analysisJson.jsonContent.expectedReturnType === 'boolean');
  });
});
