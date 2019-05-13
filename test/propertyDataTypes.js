'use strict'

const assert = require('assert');
const common = require('./common.js');
const pgx = common.pgx;

let p = null;
let localSession = null;
let now = new Date();

// used in LOCAL_DATES
let daysSinceEpoch = Math.floor(now/8.64e7); // found on internet

// used in DATE, TIMESTAMP, TIMESTAMP_WITH_TIMEZONE
let ms = now.getTime();

// used in TIME, TIME_WITH_TIMEZONE
let msOfDay = pgx.util.toMilliOfDay(now);

before(function() {
  p = pgx.connect(common.baseUrl, common.options).then(function(session) {
    localSession = session;
    return session.readGraphWithProperties(common.graphJson);
  });
});

describe('property data types', function () {
  it('createVertexProperty(vertex) should have null values', function() {
    return p.then(function(graph) {
      return graph.createVertexProperty('vertex');
    }).then(function(property) {
      assert.equal(property.type, 'vertex');
      return property.getValues();
    }).then(function(result) {
      result.forEach(function(row) {
        assert.equal(row.value, null);
      });
    });
  });
  it('createVertexProperty(edge) should have null values', function() {
    return p.then(function(graph) {
      return graph.createVertexProperty('edge');
    }).then(function(property) {
      assert.equal(property.type, 'edge');
      return property.getValues();
    }).then(function(result) {
      result.forEach(function(row) {
        assert.equal(row.value, null);
      });
    });
  });
  it('createVertexProperty(integer) should have 0 values', function() {
    return p.then(function(graph) {
      return graph.createVertexProperty('integer');
    }).then(function(property) {
      assert.equal(property.type, 'integer');
      return property.getValues();
    }).then(function(result) {
      result.forEach(function(row) {
        assert.equal(row.value, 0);
      });
    });
  });
  it('createVertexProperty(long) should have 0 values', function() {
    return p.then(function(graph) {
      return graph.createVertexProperty('long');
    }).then(function(property) {
      assert.equal(property.type, 'long');
      return property.getValues();
    }).then(function(result) {
      result.forEach(function(row) {
        assert.equal(row.value, 0);
      });
    });
  });
  it('createVertexProperty(float) should have 0 values', function() {
    return p.then(function(graph) {
      return graph.createVertexProperty('float');
    }).then(function(property) {
      assert.equal(property.type, 'float');
      return property.getValues();
    }).then(function(result) {
      result.forEach(function(row) {
        assert.equal(row.value, 0);
      });
    });
  });
  it('createVertexProperty(double) should have 0 values', function() {
    return p.then(function(graph) {
      return graph.createVertexProperty('double');
    }).then(function(property) {
      assert.equal(property.type, 'double');
      return property.getValues();
    }).then(function(result) {
      result.forEach(function(row) {
        assert.equal(row.value, 0);
      });
    });
  });
  it('createVertexProperty(boolean) should have false values', function() {
    return p.then(function(graph) {
      return graph.createVertexProperty('boolean');
    }).then(function(property) {
      assert.equal(property.type, 'boolean');
      return property.getValues();
    }).then(function(result) {
      result.forEach(function(row) {
        assert.equal(row.value, false);
      });
    });
  });
  it('createVertexProperty(string) should have null values', function() {
    return p.then(function(graph) {
      return graph.createVertexProperty('string');
    }).then(function(property) {
      assert.equal(property.type, 'string');
      return property.getValues();
    }).then(function(result) {
      result.forEach(function(row) {
        assert.equal(row.value, null);
      });
    });
  });
  it('createVertexProperty(date) should have 0 values', function() {
    return p.then(function(graph) {
      return graph.createVertexProperty('date');
    }).then(function(property) {
      assert.equal(property.type, 'date');
      return property.getValues();
    }).then(function(result) {
      result.forEach(function(row) {
        assert.equal(row.value, 0);
      });
    });
  });
  it('createVertexProperty(local_date) should have 0 values', function() {
    return p.then(function(graph) {
      return graph.createVertexProperty('local_date');
    }).then(function(property) {
      assert.equal(property.type, 'local_date');
      return property.getValues();
    }).then(function(result) {
      result.forEach(function(row) {
        assert.equal(row.value, 0);
      });
    });
  });
  it('createVertexProperty(time) should have 0 values', function() {
    return p.then(function(graph) {
      return graph.createVertexProperty('time');
    }).then(function(property) {
      assert.equal(property.type, 'time');
      return property.getValues();
    }).then(function(result) {
      result.forEach(function(row) {
        assert.equal(row.value, 0);
      });
    });
  });
  it('createVertexProperty(timestamp) should have 0 values', function() {
    return p.then(function(graph) {
      return graph.createVertexProperty('timestamp');
    }).then(function(property) {
      assert.equal(property.type, 'timestamp');
      return property.getValues();
    }).then(function(result) {
      result.forEach(function(row) {
        assert.equal(row.value, 0);
      });
    });
  });
  it('createVertexProperty(time_with_timezone) should have 0 values', function() {
    return p.then(function(graph) {
      return graph.createVertexProperty('time_with_timezone');
    }).then(function(property) {
      assert.equal(property.type, 'time_with_timezone');
      return property.getValues();
    }).then(function(result) {
      result.forEach(function(row) {
        assert.equal(row.value, "0:0");
      });
    });
  });
  it('createVertexProperty(timestamp_with_timezone) should have 0 values', function() {
    return p.then(function(graph) {
      return graph.createVertexProperty('timestamp_with_timezone');
    }).then(function(property) {
      assert.equal(property.type, 'timestamp_with_timezone');
      return property.getValues();
    }).then(function(result) {
      result.forEach(function(row) {
        assert.equal(row.value, "0:0");
      });
    });
  });
  it('createEdgeProperty(vertex) should have null values', function() {
    return p.then(function(graph) {
      return graph.createEdgeProperty('vertex');
    }).then(function(property) {
      assert.equal(property.type, 'vertex');
      return property.getValues();
    }).then(function(result) {
      result.forEach(function(row) {
        assert.equal(row.value, null);
      });
    });
  });
  it('createEdgeProperty(edge) should have null values', function() {
    return p.then(function(graph) {
      return graph.createEdgeProperty('edge');
    }).then(function(property) {
      assert.equal(property.type, 'edge');
      return property.getValues();
    }).then(function(result) {
      result.forEach(function(row) {
        assert.equal(row.value, null);
      });
    });
  });
  it('createEdgeProperty(integer) should have 0 values', function() {
    return p.then(function(graph) {
      return graph.createEdgeProperty('integer');
    }).then(function(property) {
      assert.equal(property.type, 'integer');
      return property.getValues();
    }).then(function(result) {
      result.forEach(function(row) {
        assert.equal(row.value, 0);
      });
    });
  });
  it('createEdgeProperty(long) should have 0 values', function() {
    return p.then(function(graph) {
      return graph.createEdgeProperty('long');
    }).then(function(property) {
      assert.equal(property.type, 'long');
      return property.getValues();
    }).then(function(result) {
      result.forEach(function(row) {
        assert.equal(row.value, 0);
      });
    });
  });
  it('createEdgeProperty(float) should have 0 values', function() {
    return p.then(function(graph) {
      return graph.createEdgeProperty('float');
    }).then(function(property) {
      assert.equal(property.type, 'float');
      return property.getValues();
    }).then(function(result) {
      result.forEach(function(row) {
        assert.equal(row.value, 0);
      });
    });
  });
  it('createEdgeProperty(double) should have 0 values', function() {
    return p.then(function(graph) {
      return graph.createEdgeProperty('double');
    }).then(function(property) {
      assert.equal(property.type, 'double');
      return property.getValues();
    }).then(function(result) {
      result.forEach(function(row) {
        assert.equal(row.value, 0);
      });
    });
  });
  it('createEdgeProperty(boolean) should have false values', function() {
    return p.then(function(graph) {
      return graph.createEdgeProperty('boolean');
    }).then(function(property) {
      assert.equal(property.type, 'boolean');
      return property.getValues();
    }).then(function(result) {
      result.forEach(function(row) {
        assert.equal(row.value, false);
      });
    });
  });
  it('createEdgeProperty(string) should have null values', function() {
    return p.then(function(graph) {
      return graph.createEdgeProperty('string');
    }).then(function(property) {
      assert.equal(property.type, 'string');
      return property.getValues();
    }).then(function(result) {
      result.forEach(function(row) {
        assert.equal(row.value, null);
      });
    });
  });
  it('createEdgeProperty(date) should have 0 values', function() {
    return p.then(function(graph) {
      return graph.createEdgeProperty('date');
    }).then(function(property) {
      assert.equal(property.type, 'date');
      return property.getValues();
    }).then(function(result) {
      result.forEach(function(row) {
        assert.equal(row.value, 0);
      });
    });
  });
  it('createEdgeProperty(local_date) should have 0 values', function() {
    return p.then(function(graph) {
      return graph.createEdgeProperty('local_date');
    }).then(function(property) {
      assert.equal(property.type, 'local_date');
      return property.getValues();
    }).then(function(result) {
      result.forEach(function(row) {
        assert.equal(row.value, 0);
      });
    });
  });
  it('createEdgeProperty(time) should have 0 values', function() {
    return p.then(function(graph) {
      return graph.createEdgeProperty('time');
    }).then(function(property) {
      assert.equal(property.type, 'time');
      return property.getValues();
    }).then(function(result) {
      result.forEach(function(row) {
        assert.equal(row.value, 0);
      });
    });
  });
  it('createEdgeProperty(timestamp) should have 0 values', function() {
    return p.then(function(graph) {
      return graph.createEdgeProperty('timestamp');
    }).then(function(property) {
      assert.equal(property.type, 'timestamp');
      return property.getValues();
    }).then(function(result) {
      result.forEach(function(row) {
        assert.equal(row.value, 0);
      });
    });
  });
  it('createEdgeProperty(time_with_timezone) should have 0 values', function() {
    return p.then(function(graph) {
      return graph.createEdgeProperty('time_with_timezone');
    }).then(function(property) {
      assert.equal(property.type, 'time_with_timezone');
      return property.getValues();
    }).then(function(result) {
      result.forEach(function(row) {
        assert.equal(row.value, "0:0");
      });
    });
  });
  it('createEdgeProperty(timestamp_with_timezone) should have 0 values', function() {
    return p.then(function(graph) {
      return graph.createEdgeProperty('timestamp_with_timezone');
    }).then(function(property) {
      assert.equal(property.type, 'timestamp_with_timezone');
      return property.getValues();
    }).then(function(result) {
      result.forEach(function(row) {
        assert.equal(row.value, "0:0");
      });
    });
  });
  it('property.fill(date) should have ms since epoch', function() {
    return p.then(function(graph) {
      return graph.createVertexProperty('date');
    }).then(function(property) {
      return property.fill(ms);
    }).then(function(property) {
      return property.getValues();
    }).then(function(result) {
      result.forEach(function(row) {
        assert.equal(row.value, ms);
      });
    });
  });
  it('property.fill(local_date) should have days since epoch', function() {
    return p.then(function(graph) {
      return graph.createVertexProperty('local_date');
    }).then(function(property) {
      return property.fill(daysSinceEpoch);
    }).then(function(property) {
      return property.getValues();
    }).then(function(result) {
      result.forEach(function(row) {
        assert.equal(row.value, daysSinceEpoch);
      });
    });
  });
  it('property.fill(time) should have ms of day', function() {
    return p.then(function(graph) {
      return graph.createVertexProperty('time');
    }).then(function(property) {
      return property.fill(msOfDay);
    }).then(function(property) {
      return property.getValues();
    }).then(function(result) {
      result.forEach(function(row) {
        assert.equal(row.value, msOfDay);
      });
    });
  });
  it('property.fill(timestamp) should have ms since epoch', function() {
    return p.then(function(graph) {
      return graph.createVertexProperty('timestamp');
    }).then(function(property) {
      return property.fill(ms);
    }).then(function(property) {
      return property.getValues();
    }).then(function(result) {
      result.forEach(function(row) {
        assert.equal(row.value, ms);
      });
    });
  });
  it('property.fill(time_with_timezone) should have ms of day', function() {
    return p.then(function(graph) {
      return graph.createVertexProperty('time_with_timezone');
    }).then(function(property) {
      return property.fill(msOfDay);
    }).then(function(property) {
      return property.getValues();
    }).then(function(result) {
      result.forEach(function(row) {
        assert.equal(row.value, msOfDay + ':0');
      });
    });
  });
  it('property.fill(timestamp_with_timezone) should have ms since epoch', function() {
    return p.then(function(graph) {
      return graph.createVertexProperty('timestamp_with_timezone');
    }).then(function(property) {
      return property.fill(ms);
    }).then(function(property) {
      return property.getValues();
    }).then(function(result) {
      result.forEach(function(row) {
        assert.equal(row.value, ms + ':0');
      });
    });
  });
  it('property.set(date) should have ms since epoch', function() {
    return p.then(function(graph) {
      return graph.createVertexProperty('date');
    }).then(function(property) {
      return property.set(128, ms);
    }).then(function(property) {
      return property.get(128);
    }).then(function(result) {
      assert.equal(result, ms);
    });
  });
  it('property.set(local_date) should have days since epoch', function() {
    return p.then(function(graph) {
      return graph.createVertexProperty('local_date');
    }).then(function(property) {
      return property.set(128, daysSinceEpoch);
    }).then(function(property) {
      return property.get(128);
    }).then(function(result) {
      assert.equal(result, daysSinceEpoch);
    });
  });
  it('property.set(time) should have ms of day', function() {
    return p.then(function(graph) {
      return graph.createVertexProperty('time');
    }).then(function(property) {
      return property.set(128, msOfDay);
    }).then(function(property) {
      return property.get(128);
    }).then(function(result) {
      assert.equal(result, msOfDay);
    });
  });
  it('property.set(timestamp) should have ms since epoch', function() {
    return p.then(function(graph) {
      return graph.createVertexProperty('timestamp');
    }).then(function(property) {
      return property.set(128, ms);
    }).then(function(property) {
      return property.get(128);
    }).then(function(result) {
      assert.equal(result, ms);
    });
  });
  it('property.set(time_with_timezone) should have ms of day', function() {
    return p.then(function(graph) {
      return graph.createVertexProperty('time_with_timezone');
    }).then(function(property) {
      return property.set(128, msOfDay);
    }).then(function(property) {
      return property.get(128);
    }).then(function(result) {
      assert.equal(result, msOfDay + ':0');
    });
  });
  it('property.set(timestamp_with_timezone) should have ms since epoch', function() {
    return p.then(function(graph) {
      return graph.createVertexProperty('timestamp_with_timezone');
    }).then(function(property) {
      return property.set(128, ms);
    }).then(function(property) {
      return property.get(128);
    }).then(function(result) {
      assert.equal(result, ms + ':0');
    });
  });
});

after(function() {
  localSession.destroy().then(function(result) {
    p = null;
    localSession = null;
  });
});