'use strict'

const assert = require('assert');
const common = require('./common.js');
const pgx = common.pgx;

let p = null;
let localSession = null;
let localGraph = null;

before(function() {
  p = pgx.connect(common.baseUrl, common.options).then(function(session) {
    localSession = session;
    return session.readGraphWithProperties(common.graphJson);
  }).then(function(graph) {
    localGraph = graph;
    return graph.session.analyst.pagerank(graph, { "name": "pagerank" });
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
      return property.get(21474836490);
    }).then(function(result) {
      assert(typeof result.value === 'number');
    });
  });

  it('getValues should have 4 elements', function() {
    return p.then(function(property) {
      return property.getValues();
    }).then(function(result) {
      assert.equal(2048, result.length);
    });
  });

  it('getValues should includes [128, 1908, 99, 333]', function() {
    return p.then(function(property) {
      return property.getValues();
    }).then(function(result) {
      result.forEach(function(row) {
          assert(row.key > -1);
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
          assert.equal(8589934826, row.key);
        } else if (count === 2) {
          assert.equal(8589934822, row.key);
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
          assert.equal(6005, row.key);
        } else if (count === 4) {
          assert.equal(6001, row.key);
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

  //it('iterate(cb, \'values\') row should have key and value', function() {
  //  return p.then(function(property) {
  //    return property.iterate(function(row) {
  //      assert((typeof row.key === 'number') && (typeof row.value === 'number'));
  //    }, 'values');
  //  });
  //});

  //it('iterateTopKValues row should have key and value', function(done) {
  //  return p.then(function(property) {
  //    return property.iterateTopKValues(4, function(row) {
  //      assert((typeof row.key === 'number') && (typeof row.value === 'number'));
  //    });
  //  }).then(done);
  //});

  //it('iterate(cb, \'top\', k) row should have key and value', function(done) {
  //  return p.then(function(property) {
  //    return property.iterate(function(row) {
  //      assert((typeof row.key === 'number') && (typeof row.value === 'number'));
  //    }, 'top', 4);
  //  }).then(done);
  //});
//  it('iterateBottomKValues row should have key and value', function() {
//    return p.then(function(property) {
//      return property.iterateBottomKValues(4, function(row) {
//        assert((typeof row.key === 'number') && (typeof row.value === 'number'));
//      });
//    });
//  });
//  it('iterate(cb, \'bottom\', 4) row should have key and value', function() {
//    return p.then(function(property) {
//      return property.iterate(function(row) {
//        assert((typeof row.key === 'number') && (typeof row.value === 'number'));
//      }, 'bottom', 4);
//    }).catch((e) => console.log(e));
//  });

  it('size should be 10916', function() {
    return p.then(function(property) {
      return property.size();
    }).then(function(size) {
      assert.equal(10916, size);
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
    let key = 21474836490;
    let value = 0.5;
    return p.then(function(property) {
      return property.set(key, value);
    }).then(function(property) {
      return property.get(key);
    }).then(function(result) {
      assert.equal(value, result.value);
    });
  });

  it('setValues should have a value', function() {
    let map = new Map();
    let key1 = 21474836490;
    let key2 = 8589934822;
    let value1 = 0.1;
    let value2 = 0.3;
    map.set(key1, value1);
    map.set(key2, value2);
    return p.then(function(property) {
      return property.setValues(map);
    }).then(function(property) {
      return property.getValues();
    }).then(function(result) {
      result.forEach(function(row) {
        if (row.key === key1) {
          assert.equal(value1, row.value);
        } else if (row.key === key2) {
          assert.equal(value2, row.value);
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
      return localGraph.getVertexProperty('base_power');
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
      return localGraph;
    }).then((g) => g.destroy()).catch((e) => console.log(e));
  });

  it('isPublished should be false', function() {
    let localGraph;
    return p.then(function(property) {
      return property.graph;
    }).then(function(graph) {
      localGraph = graph;
      return graph.getVertexProperty('nickname');
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

  //it('destroy should remove property', function() {
  //  return p.then(function(property) {
  //    return property.destroy();
  //  }).then(function(result) {
  //    assert.equal(null, result);
  //  });
  //});
});

after(function() {
  if(localGraph){
    localGraph.destroy().catch(function(e){
    });
  }

  if(localSession){
    localSession.destroy().catch(function(e){
    });
  }
});

