'use strict'

const assert = require('assert');
const common = require('./common.js');
const pgx = common.pgx;

let vf = null;
let ef = null;

before(function() {
  vf = pgx.createVertexFilter('true');
  ef = pgx.createEdgeFilter('edge.cost > 5');
});

describe('filter', function () {
  it('vertex filter type is VERTEX', function() {
      assert.equal('VERTEX',vf.type);
  });
  it('vertex filterExpression is \'true\'', function() {
      assert.strictEqual('true',vf.filterExpression);
  });
  it('vertex binaryOperation is false', function() {
      assert.equal(false,vf.binaryOperation);
  });
  it('vertex intersect type is INTERSECT', function() {
      assert.equal('INTERSECT',vf.intersect(vf).type);
  });
  it('vertex intersect leftFilter is VERTEX', function() {
      assert.strictEqual('VERTEX',vf.intersect(vf).leftFilter.type);
  });
  it('vertex intersect rightFilter is VERTEX', function() {
      assert.strictEqual('VERTEX',vf.intersect(vf).rightFilter.type);
  });
  it('vertex intersect binaryOperation is true', function() {
      assert.equal(true,vf.intersect(vf).binaryOperation);
  });
  it('edge filter type is EDGE', function() {
      assert.equal('EDGE',ef.type);
  });
  it('edge filterExpression is \'edge.cost > 5\'', function() {
      assert.strictEqual('edge.cost > 5',ef.filterExpression);
  });
  it('edge binaryOperation is false', function() {
      assert.equal(false,ef.binaryOperation);
  });
  it('edge union type is UNION', function() {
      assert.equal('UNION',ef.union(ef).type);
  });
  it('edge union leftFilter is EDGE', function() {
      assert.strictEqual('EDGE',ef.union(ef).leftFilter.type);
  });
  it('edge union rightFilter is EDGE', function() {
      assert.strictEqual('EDGE',ef.union(ef).rightFilter.type);
  });
  it('edge union binaryOperation is true', function() {
      assert.equal(true,ef.union(ef).binaryOperation);
  });
});

after(function() {
  vf = null;
  ef = null;
});