'use strict'

const assert = require('assert');
const common = require('./common.js');
const pgx = common.pgx;

let p = null;
let localSession = null;

before(function() {
  p = pgx.connect(common.baseUrl, common.options).then(function(session) {
    localSession = session;
    return session.readGraphWithProperties(common.graphJson);
  }).then(function(graph) {
    return graph.session.analyst.pagerank(graph, 0.001, 0.85, 100);
  });
});

describe('property', function () {
  it('should have a name', function() {
    return p.then(function(property) {
      assert(property.name);
    });
  });
  it('should have entityType', function() {
    return p.then(function(property) {
      assert(property.entityType === 'vertex');
    });
  });
  it('should have transient', function() {
    return p.then(function(property) {
      assert(property.transient);
    });
  });
  it('should have type', function() {
    return p.then(function(property) {
      assert(property.type);
    });
  });
  it('should have dimension', function() {
    return p.then(function(property) {
      assert.equal(0, property.dimension);
    });
  });
  it('get should have a number', function() {
    return p.then(function(property) {
      return property.get(128);
    }).then(function(result) {
      assert(typeof result === 'number');
    });
  });
  it('getValues should have 4 elements', function() {
    return p.then(function(property) {
      return property.getValues();
    }).then(function(result) {
      assert.equal(4, result.length);
    });
  });
  it('getValues should includes [128, 1908, 99, 333]', function() {
    return p.then(function(property) {
      return property.getValues();
    }).then(function(result) {
      result.forEach(function(row) {
          assert([128, 1908, 99, 333].indexOf(row.key) > -1);
      });
    });
  });
  it('getValues in page 1 should have 2 elements', function() {
    return p.then(function(property) {
      return property.getValues(0, 2);
    }).then(function(result) {
      assert.equal(2, result.length);
    });
  });
  it('getValues in page 2 should have 2 elements', function() {
    return p.then(function(property) {
      return property.getValues(2, 2);
    }).then(function(result) {
      assert.equal(2, result.length);
    });
  });
  it('getTopKValues should have 4 elements', function() {
    return p.then(function(property) {
      return property.getTopKValues(4);
    }).then(function(result) {
      assert.equal(4, result.length);
    });
  });
  it('getTopKValues should have 128, 333 at top', function() {
    return p.then(function(property) {
      return property.getTopKValues(4);
    }).then(function(result) {
      let count = 0;
      result.forEach(function(row) {
        count++;
        if (count === 1) {
          assert.equal(128, row.key);
        } else if (count === 2) {
          assert.equal(333, row.key);
        }
      });
    });
  });
  it('getTopKValues in page 1 should have 2 elements', function() {
    return p.then(function(property) {
      return property.getTopKValues(4, 0, 2);
    }).then(function(result) {
      assert.equal(2, result.length);
    });
  });
  it('getTopKValues in page 2 should have 2 elements', function() {
    return p.then(function(property) {
      return property.getTopKValues(4, 2, 2);
    }).then(function(result) {
      assert.equal(2, result.length);
    });
  });
  it('getBottomKValues should have 4 elements', function() {
    return p.then(function(property) {
      return property.getBottomKValues(4);
    }).then(function(result) {
      assert.equal(4, result.length);
    });
  });
  it('getBottomKValues should have 333, 128 at bottom', function() {
    return p.then(function(property) {
      return property.getBottomKValues(4);
    }).then(function(result) {
      let count = 0;
      result.forEach(function(row) {
        count++;
        if (count === 3) {
          assert.equal(333, row.key);
        } else if (count === 4) {
          assert.equal(128, row.key);
        }
      });
    });
  });
  it('getBottomKValues in page 1 should have 2 elements', function() {
    return p.then(function(property) {
      return property.getBottomKValues(4, 0, 2);
    }).then(function(result) {
      assert.equal(2, result.length);
    });
  });
  it('getBottomKValues in page 2 should have 2 elements', function() {
    return p.then(function(property) {
      return property.getBottomKValues(4, 2, 2);
    }).then(function(result) {
      assert.equal(2, result.length);
    });
  });
  it('iterateValues row should have key and value', function() {
    return p.then(function(property) {
      return property.iterateValues(function(row) {
        assert((typeof row.key === 'number') && (typeof row.value === 'number'));
      });
    });
  });
  it('iterate(cb, \'values\') row should have key and value', function() {
    return p.then(function(property) {
      return property.iterate(function(row) {
        assert((typeof row.key === 'number') && (typeof row.value === 'number'));
      }, 'values');
    });
  });
  it('iterateTopKValues row should have key and value', function() {
    return p.then(function(property) {
      return property.iterateTopKValues(4, function(row) {
        assert((typeof row.key === 'number') && (typeof row.value === 'number'));
      });
    });
  });
  it('iterate(cb, \'top\', k) row should have key and value', function() {
    return p.then(function(property) {
      return property.iterate(function(row) {
        assert((typeof row.key === 'number') && (typeof row.value === 'number'));
      }, 'top', 4);
    });
  });
  it('iterateBottomKValues row should have key and value', function() {
    return p.then(function(property) {
      return property.iterateBottomKValues(4, function(row) {
        assert((typeof row.key === 'number') && (typeof row.value === 'number'));
      });
    });
  });
  it('iterate(cb, \'bottom\', 4) row should have key and value', function() {
    return p.then(function(property) {
      return property.iterate(function(row) {
        assert((typeof row.key === 'number') && (typeof row.value === 'number'));
      }, 'bottom', 4);
    });
  });
  it('size should be 4', function() {
    return p.then(function(property) {
      return property.size();
    }).then(function(size) {
      assert.equal(4, size);
    });
  });
  it('fill should set all values', function() {
    return p.then(function(property) {
      return property.fill(2);
    }).then(function(property) {
      return property.getValues();
    }).then(function(result) {
      result.forEach(function(row) {
        assert.equal(2, row.value);
      });
    });
  });
  it('rename should have a value', function() {
    return p.then(function(property) {
      return property.rename('myGraph');
    }).then(function(property) {
      assert.equal('myGraph', property.name);
    });
  });
  it('set should have a value', function() {
    return p.then(function(property) {
      return property.set(128, 5);
    }).then(function(property) {
      return property.get(128);
    }).then(function(result) {
      assert.equal(5, result);
    });
  });
  it('setValues should have a value', function() {
    let map = new Map();
    map.set(128, 1);
    map.set(333, 3);
    return p.then(function(property) {
      return property.setValues(map);
    }).then(function(property) {
      return property.getValues();
    }).then(function(result) {
      result.forEach(function(row) {
        if (row.key === 128) {
          assert.equal(1, row.value);
        } else if (row.key === 333) {
          assert.equal(3, row.value);
        }
      });
    });
  });
  it('clone should have a property', function() {
    return p.then(function(property) {
      return property.clone();
    }).then(function(property) {
      assert(property.name.startsWith('vertex_prop_double'));
    });
  });
  it('clone(name) should have a property', function() {
    return p.then(function(property) {
      return property.clone('newCloneProperty');
    }).then(function(property) {
      assert(property.name === 'newCloneProperty');
    });
  });
  it('publish should be true', function() {
    let localGraph;
    return p.then(function(property) {
      return property.graph.clone();
    }).then(function(graph) {
      return graph.publish();
    }).then(function(graph) {
      localGraph = graph;
      return graph.getVertexProperty('prop1');
    }).then(function(property) {
      return property.publish();
    }).then(function(property) {
      return property.isPublished();
    }).then(function(result) {
      assert.equal(true, result);
      return localGraph.getEdgeProperty("cost");
    }).then(function(property) {
      return property.publish();
    }).then(function(property) {
      return property.isPublished();
    }).then(function(result) {
      assert.equal(true, result);
    });
  });
  it('isPublished should be false', function() {
    let localGraph;
    return p.then(function(property) {
      return property.graph;
    }).then(function(graph) {
      localGraph = graph;
      return graph.getVertexProperty('prop1');
    }).then(function(property) {
      return property.isPublished();
    }).then(function(result) {
      assert.equal(false, result);
      return localGraph.getEdgeProperty("cost");
    }).then(function(property) {
      return property.isPublished();
    }).then(function(result) {
      assert.equal(false, result);
    });
  });
  it('destroy should remove property', function() {
    return p.then(function(property) {
      return property.destroy();
    }).then(function(result) {
      assert.equal(null, result);
    });
  });
});

after(function() {
  localSession.destroy().then(function(result) {
    p = null;
    localSession = null;
  });
});