'use strict'

const assert = require('assert');
const fs = require('fs');
const common = require('./common.js');
const commonHelper = require(`${common.pgxDir}/helpers/common.js`);
const edgeStrategy = require(`${common.pgxDir}/classes/edgeStrategy.js`)
const propertyClass = require(`${common.pgxDir}/classes/property.js`)
const pgx = common.pgx;

let p = null;
let localSession = null;

before(function() {
  p = pgx.connect(common.baseUrl, common.options).then(function(session) {
    localSession = session;
    return session.readGraphWithProperties(common.graphJson);
  });

  try {
    fs.unlinkSync(`${common.pgxDir}/graph1.txt`);
    fs.unlinkSync(`${common.pgxDir}/graph2.txt`);
    fs.unlinkSync(`${common.pgxDir}/graph3.txt`);
  } catch (e) {
    // error is ignored
  }
});

describe('graph', function () {
  it('should have a name', function() {
    return p.then(function(graph) {
      assert(graph.name);
    });
  });
  it('transient should be false', function() {
    return p.then(function(graph) {
      assert.equal(false, graph.transient);
    });
  });
  it('numVertices should be 4', function() {
    return p.then(function(graph) {
      assert.equal(4, graph.numVertices);
    });
  });
  it('numEdges should be 4', function() {
    return p.then(function(graph) {
      assert.equal(4, graph.numEdges);
    });
  });
  it('should have vertexIdType', function() {
    return p.then(function(graph) {
      assert(graph.vertexIdType);
    });
  });
  it('should have edgeIdType', function() {
    return p.then(function(graph) {
      assert(graph.edgeIdType);
    });
  });
  it('should have memoryMb', function() {
    return p.then(function(graph) {
      assert(graph.memoryMb === 0);
    });
  });
  it('should have dataSourceVersion', function() {
    return p.then(function(graph) {
      assert(graph.dataSourceVersion === '0');
    });
  });
  it('should have creationTimestamp', function() {
    return p.then(function(graph) {
      assert(typeof graph.creationTimestamp === 'number');
    });
  });
  it('should have creationRequestTimestamp', function() {
    return p.then(function(graph) {
      assert(typeof graph.creationRequestTimestamp === 'number');
    });
  });
  it('should have config', function() {
    return p.then(function(graph) {
      assert(graph.config.format);
    });
  });
  it('vertexProperties should return 1 element', function() {
    return p.then(function(graph) {
      return graph.vertexProperties;
    }).then(function(properties) {
      assert.equal(1, properties.length);
    });
  });
  it('edgeProperties should return 1 element', function() {
    return p.then(function(graph) {
      return graph.edgeProperties;
    }).then(function(properties) {
      assert.equal(1, properties.length);
    });
  });
  it('getVertexProperty should return a Property', function() {
    return p.then(function(graph) {
      return graph.getVertexProperty('prop1');
    }).then(function(property) {
      assert((property.name === 'prop1') && (property.entityType === 'vertex'));
    });
  });
  it('getEdgeProperty should return a Property', function() {
    return p.then(function(graph) {
      return graph.getEdgeProperty('cost');
    }).then(function(property) {
      assert((property.name === 'cost') && (property.entityType === 'edge'));
    });
  });
  it('getVertices should return 4 elements', function() {
    return p.then(function(graph) {
      return graph.getVertices();
    }).then(function(vertices) {
      assert.equal(4, vertices.length);
    });
  });
  it('getVertices in page 1 should return 2 elements', function() {
    return p.then(function(graph) {
      return graph.getVertices(0, 2);
    }).then(function(vertices) {
      assert.equal(2, vertices.length);
    });
  });
  it('getVertices in page 2 should return 2 elements', function() {
    return p.then(function(graph) {
      return graph.getVertices(2, 2);
    }).then(function(vertices) {
      assert.equal(2, vertices.length);
    });
  });
  it('getEdges should return 4 elements', function() {
    return p.then(function(graph) {
      return graph.getEdges();
    }).then(function(edges) {
      assert.equal(4, edges.length);
    });
  });
  it('getEdges in page 1 should return 2 elements', function() {
    return p.then(function(graph) {
      return graph.getEdges(0, 2);
    }).then(function(edges) {
      assert.equal(2, edges.length);
    });
  });
  it('getEdges in page 2 should return 2 elements', function() {
    return p.then(function(graph) {
      return graph.getEdges(2, 2);
    }).then(function(edges) {
      assert.equal(2, edges.length);
    });
  });
  it('iterateVertices should return 4 vertices', function() {
    return p.then(function(graph) {
      return graph.iterateVertices(function(row) {
        assert(([128, 333, 99, 1908].indexOf(row.id) > -1) && (row.type === 'integer'));
      });
    });
  });
  it('iterateEdges should return 4 edges', function() {
    return p.then(function(graph) {
      return graph.iterateEdges(function(row) {
        assert(([0, 1, 2, 3].indexOf(row.id) > -1) && (row.type === 'long'));
      });
    });
  });
  it('fresh should be boolean', function() {
    return p.then(function(graph) {
      return graph.fresh;
    }).then(function(fresh) {
      assert(typeof fresh === 'boolean');
    });
  });
  it('undirect() should return a graph', function() {
    return p.then(function(graph) {
      return graph.undirect();
    }).then(function(graph) {
      assert(graph.name.includes('sub-graph'));
    });
  });
  it('undirect(options) should return a graph', function() {
    return p.then(function(graph) {
    let undirectStrategy = {
      'vertexPropNames': ['prop1'],
      'edgePropNames': ['cost'],
      'inPlace': false,
      'newGraphName': 'newUndirectedGraph',
      'noTrivialVertices': false,
      'edgeStrategy': new edgeStrategy.PickByProperty(0, 'MIN', true)
    };
      return graph.undirect(undirectStrategy);
    }).then(function(graph) {
      assert(graph.name === 'newUndirectedGraph');
    });
  });
  it('sortByDegree() should return a graph', function() {
    return p.then(function(graph) {
      return graph.sortByDegree();
    }).then(function(graph) {
      assert(graph.name.includes('sub-graph'));
    });
  });
  it('sortByDegree(options) should return a graph', function() {
    return p.then(function(graph) {
      return graph.sortByDegree({
        'nodePropNames': ['prop1'],
        'edgePropNames': ['cost'],
        'newGraphName': 'newSortedGraph',
        'ascending': true,
        'useOutDegree': true
      });
    }).then(function(graph) {
      assert(graph.name === 'newSortedGraph');
    });
  });
  it('simplify() should return a graph', function() {
    return p.then(function(graph) {
      return graph.simplify();
    }).then(function(graph) {
      assert(graph.name.includes('sub-graph'));
    });
  });
  it('simplify(options) should return a graph', function() {
    return p.then(function(graph) {
    let simplifyStrategy = {
      'vertexPropNames': ['prop1'],
      'edgePropNames': ['cost'],
      'inPlace': false,
      'newGraphName': 'newSimplifiedGraph',
      'noTrivialVertices': true,
      'edgeStrategy': new edgeStrategy.PickByProperty(0, 'MIN', true)
    };
      return graph.simplify(simplifyStrategy);
    }).then(function(graph) {
      assert(graph.name === 'newSimplifiedGraph');
    });
  });
  it('transpose() should return a graph', function() {
    return p.then(function(graph) {
      return graph.transpose();
    }).then(function(graph) {
      assert(graph.name.includes('sub-graph'));
    });
  });
  it('transpose(options) inPlace should return a graph with same name', function() {
    let graphName = '';
    return p.then(function(graph) {
      let transposeStrategy = {
        'vertexProperties': null,
        'edgePropNames': null,
        'inPlace': false
      };
      return graph.transpose(transposeStrategy); //will create copy
    }).then(function(graph) {
      graphName = graph.name; //save name to test inplace
      let transposeStrategy = {
        'vertexProperties': null,
        'edgePropNames': null,
        'inPlace': true
      };
      return graph.transpose(transposeStrategy); //do inPlace mutation
    }).then(function(graph) {
      assert(graph.name == graphName);
    });
  });
  it('sparsify(e) should return a graph', function() {
    return p.then(function(graph) {
      return graph.sparsify(0.5);
    }).then(function(graph) {
      assert(graph.name.includes('sub-graph'));
    });
  });
  it('sparsify(e, options) should return a graph', function() {
    return p.then(function(graph) {
      return graph.sparsify(0.5, {
        "nodePropNames": ['prop1'],
        "edgePropNames": ['cost'],
        "newGraphName": 'newSparcifyGraph'
      });
    }).then(function(graph) {
      assert(graph.name === 'newSparcifyGraph');
    });
  });
  it('pickRandomVertex should return a vertex', function() {
    return p.then(function(graph) {
      return graph.pickRandomVertex();
    }).then(function(vertex) {
      assert((['128', '333', '99', '1908'].indexOf(vertex.id) > -1) && (vertex.type === 'integer'));
    });
  });
  it('isBipartiteGraph should be true', function() {
    return p.then(function(graph) {
      return graph.createVertexSet();
    }).then(function(collection) {
      return collection.addAll([333, 99]);
    }).then(function(collection) {
      return collection.graph.bipartiteSubGraphFromLeftSet(collection);
    }).then(function(bipartiteGraph) {
      return bipartiteGraph.isLeftProperty;
    }).then(function(leftProperty) {
      return leftProperty.graph.isBipartiteGraph(leftProperty.name);
    }).then(function(result) {
      assert.equal(true, result);
    });
  });
  it('queryPgql should return a ResultSet', function() {
    return p.then(function(graph) {
      return graph.queryPgql('SELECT n WHERE (n)');
    }).then(function(resultSet) {
      assert(resultSet.resultSetId);
    });
  });
  it('createVertexSet should return a VertexSet', function() {
    return p.then(function(graph) {
      return graph.createVertexSet();
    }).then(function(collection) {
      assert((collection.elementType === 'vertex') && (collection.collectionType === 'set') &&
        collection.name.startsWith('vertex_collection_set'));
    });
  });
  it('createVertexSet(name) should return a VertexSet', function() {
    return p.then(function(graph) {
      return graph.createVertexSet('newVertexSet');
    }).then(function(collection) {
      assert((collection.elementType === 'vertex') && (collection.collectionType === 'set') &&
        (collection.name === 'newVertexSet'));
    });
  });
  it('createVertexSequence should return a VertexSequence', function() {
    return p.then(function(graph) {
      return graph.createVertexSequence();
    }).then(function(collection) {
      assert((collection.elementType === 'vertex') && (collection.collectionType === 'sequence') &&
        collection.name.startsWith('vertex_collection_sequence'));
    });
  });
  it('createVertexSequence(name) should return a VertexSequence', function() {
    return p.then(function(graph) {
      return graph.createVertexSequence('newVertexSequence');
    }).then(function(collection) {
      assert((collection.elementType === 'vertex') && (collection.collectionType === 'sequence') &&
        (collection.name === 'newVertexSequence'));
    });
  });
  it('createEdgeSet should return an edgeSet', function() {
    return p.then(function(graph) {
      return graph.createEdgeSet();
    }).then(function(collection) {
      assert((collection.elementType === 'edge') && (collection.collectionType === 'set') &&
        collection.name.startsWith('edge_collection_set'));
    });
  });
  it('createEdgeSet(name) should return an edgeSet', function() {
    return p.then(function(graph) {
      return graph.createEdgeSet('newEdgeSet');
    }).then(function(collection) {
      assert((collection.elementType === 'edge') && (collection.collectionType === 'set') &&
        (collection.name === 'newEdgeSet'));
    });
  });
  it('createEdgeSequence should return an edgeSequence', function() {
    return p.then(function(graph) {
      return graph.createEdgeSequence();
    }).then(function(collection) {
      assert((collection.elementType === 'edge') && (collection.collectionType === 'sequence') &&
        collection.name.startsWith('edge_collection_sequence'));
    });
  });
  it('createEdgeSequence(name) should return an edgeSequence', function() {
    return p.then(function(graph) {
      return graph.createEdgeSequence('newEdgeSequence');
    }).then(function(collection) {
      assert((collection.elementType === 'edge') && (collection.collectionType === 'sequence') &&
        collection.name.startsWith('newEdgeSequence'));
    });
  });
  it('createVertexProperty(type) should return a property', function() {
    return p.then(function(graph) {
      return graph.createVertexProperty('integer');
    }).then(function(property) {
      assert(property.name.startsWith('vertex_prop_integer') && (property.entityType === 'vertex'));
    });
  });
  it('createVertexProperty(type, name) should return a property', function() {
    return p.then(function(graph) {
      return graph.createVertexProperty('integer', 'newVertexProperty');
    }).then(function(property) {
      assert((property.name === 'newVertexProperty') && (property.entityType === 'vertex'));
    });
  });
  it('createEdgeProperty(type) should return a property', function() {
    return p.then(function(graph) {
      return graph.createEdgeProperty('integer');
    }).then(function(property) {
      assert(property.name.startsWith('edge_prop_integer') && (property.entityType === 'edge'));
    });
  });
  it('createEdgeProperty(type, name) should return a property', function() {
    return p.then(function(graph) {
      return graph.createEdgeProperty('integer', 'newEdgeProperty');
    }).then(function(property) {
      assert((property.name === 'newEdgeProperty') && (property.entityType === 'edge'));
    });
  });
  it('createVertexVectorProperty(type, dimension) should return a property', function() {
    return p.then(function(graph) {
      return graph.createVertexVectorProperty('integer', 10);
    }).then(function(property) {
      assert(property.name.startsWith('vertex_prop_integer') && (property.entityType === 'vertex')
        && (property.dimension === 10));
      return property;
    }).then(function(property) {
      return property.destroy();
    });
  });
  it('createVertexVectorProperty(type, dimension, name) should return a property', function() {
    return p.then(function(graph) {
      return graph.createVertexVectorProperty('integer', 10, 'vertexVector');
    }).then(function(property) {
      assert((property.name === 'vertexVector') && (property.entityType === 'vertex') && (property.dimension === 10));
      return property;
    }).then(function(property) {
      return property.destroy();
    });
  });
  it('createEdgeVectorProperty(type, dimension) should return a property', function() {
    return p.then(function(graph) {
      return graph.createEdgeVectorProperty('integer', 10);
    }).then(function(property) {
      assert(property.name.startsWith('edge_prop_integer') && (property.entityType === 'edge')
        && (property.dimension === 10));
      return property;
    }).then(function(property) {
      return property.destroy();
    });
  });
  it('createEdgeVectorProperty(type, dimension, name) should return a property', function() {
    return p.then(function(graph) {
      return graph.createEdgeVectorProperty('integer', 10, 'edgeVector');
    }).then(function(property) {
      assert((property.name === 'edgeVector') && (property.entityType === 'edge') && (property.dimension === 10));
      return property;
    }).then(function(property) {
      return property.destroy();
    });
  });
  it('createScalar(type) should return a scalar', function() {
    return p.then(function(graph) {
      return graph.createScalar('integer');
    }).then(function(scalar) {
      assert(scalar.name.startsWith('scalar_integer') && (scalar.type === 'integer'));
    });
  });
  it('createScalar(type, name) should return a scalar', function() {
    return p.then(function(graph) {
      return graph.createScalar('integer', 'newScalar');
    }).then(function(scalar) {
      assert((scalar.name === 'newScalar') && (scalar.type === 'integer'));
    });
  });
  it('createVectorScalar(type, dimension) should return a scalar', function() {
    return p.then(function(graph) {
      return graph.createVectorScalar('integer', 10);
    }).then(function(scalar) {
      assert(scalar.name.startsWith('scalar_integer') && (scalar.type === 'integer') && (scalar.dimension === 10));
      return scalar;
    }).then(function(scalar) {
      return scalar.destroy();
    });
  });
  it('createVectorScalar(type, dimension, name) should return a scalar', function() {
    return p.then(function(graph) {
      return graph.createVectorScalar('integer', 10, "vectorScalar");
    }).then(function(scalar) {
      assert((scalar.name === 'vectorScalar') && (scalar.type === 'integer') && (scalar.dimension === 10));
      return scalar;
    }).then(function(scalar) {
      return scalar.destroy();
    });
  });
  it('combineVertexPropertiesIntoVectorProperty(propertyNames) should return a property', function() {
    return p.then(function(graph) {
      return graph.createVertexProperty("integer");
    }).then(function(property) {
      return property.graph.combineVertexPropertiesIntoVectorProperty(["prop1", property.name]);
    }).then(function(property) {
      assert(property.name.startsWith('vertex_prop_integer') && (property.entityType === 'vertex')
        && (property.dimension === 2));
      return property;
    }).then(function(property) {
      return property.destroy();
    });
  });
  it('combineVertexPropertiesIntoVectorProperty(propertyNames, name) should return a property', function() {
    return p.then(function(graph) {
      return graph.createVertexProperty("integer");
    }).then(function(property) {
      return property.graph.combineVertexPropertiesIntoVectorProperty(["prop1", property.name], "combineVertexProp");
    }).then(function(property) {
      assert((property.name === 'combineVertexProp') && (property.entityType === 'vertex') && (property.dimension === 2));
      return property;
    }).then(function(property) {
      return property.destroy();
    });
  });
  it('combineEdgePropertiesIntoVectorProperty(propertyNames) should return a property', function() {
    return p.then(function(graph) {
      return graph.createEdgeProperty("double");
    }).then(function(property) {
      return property.graph.combineEdgePropertiesIntoVectorProperty(["cost", property.name]);
    }).then(function(property) {
      assert(property.name.startsWith('edge_prop_double') && (property.entityType === 'edge')
        && (property.dimension === 2));
      return property;
    }).then(function(property) {
      return property.destroy();
    });
  });
  it('combineEdgePropertiesIntoVectorProperty(propertyNames, name) should return a property', function() {
    return p.then(function(graph) {
      return graph.createEdgeProperty("double");
    }).then(function(property) {
      return property.graph.combineEdgePropertiesIntoVectorProperty(["cost", property.name], "combineEdgeProp");
    }).then(function(property) {
      assert((property.name === 'combineEdgeProp') && (property.entityType === 'edge') && (property.dimension === 2));
      return property;
    }).then(function(property) {
      return property.destroy();
    });
  });
  it('createMap(keyType, valType) should return a map', function() {
    return p.then(function(graph) {
      return graph.createMap('integer', 'integer');
    }).then(function(map) {
      assert(map.name.startsWith('map_') && (map.keyType === 'integer') && (map.valType === 'integer'));
    });
  });
  it('createMap(keyType, valType, name) should return a map', function() {
    return p.then(function(graph) {
      return graph.createMap('integer', 'integer', 'newMap');
    }).then(function(map) {
      assert((map.name === 'newMap') && (map.keyType === 'integer') && (map.valType === 'integer'));
    });
  });
  it('getVertex should return a Vertex', function() {
    return p.then(function(graph) {
      return graph.getVertex(128);
    }).then(function(vertex) {
      assert.equal(128, vertex.id);
    });
  });
  it('hasVertex should be true', function() {
    return p.then(function(graph) {
      return graph.hasVertex(128);
    }).then(function(result) {
      assert.equal(true, result);
    });
  });
  it('getEdge should return an Edge', function() {
    return p.then(function(graph) {
      return graph.getEdge(0);
    }).then(function(edge) {
      assert.equal(0, edge.id);
    });
  });
  it('hasEdge should be true', function() {
    return p.then(function(graph) {
      return graph.hasEdge(0);
    }).then(function(result) {
      assert.equal(true, result);
    });
  });
  it('filter(f) should return a graph', function() {
    return p.then(function(graph) {
      return graph.filter(pgx.createVertexFilter('true'));
    }).then(function(graph) {
      assert(graph.name.includes('sub-graph'));
    });
  });
  it('filter(f, options) should return a graph', function() {
    return p.then(function(graph) {
      return graph.filter(pgx.createVertexFilter('true'), {
        'nodePropNames': ['prop1'],
        'edgePropNames': ['cost'],
        'newGraphName': 'newFilteredGraph'
      });
    }).then(function(graph) {
      assert(graph.name === 'newFilteredGraph');
    });
  });
  it('bipartiteSubGraphFromLeftSet(collection) should return a SubGraph', function() {
    return p.then(function(graph) {
      return graph.createVertexSet();
    }).then(function(collection) {
      return collection.addAll([333, 99]);
    }).then(function(collection) {
      return collection.graph.bipartiteSubGraphFromLeftSet(collection);
    }).then(function(bipartiteGraph) {
      assert(bipartiteGraph.name.indexOf('sub-graph') > -1);
      return bipartiteGraph.createVertexProperty('boolean');
    }).then(function(property) {
      return property.graph.isBipartiteGraph(property.name);
    }).then(function(result) {
      assert.equal(true, result);
    });
  });
  it('bipartiteSubGraphFromLeftSet(collection, options) should return a SubGraph', function() {
    return p.then(function(graph) {
      return graph.createVertexSet();
    }).then(function(collection) {
      return collection.addAll([333, 99]);
    }).then(function(collection) {
      return collection.graph.bipartiteSubGraphFromLeftSet(collection, {
      'nodePropNames': ['prop1'],
      'edgePropNames': ['cost'],
      'newGraphName': 'newBipartiteGraph1',
      'isLeftPropName': 'newLeftProperty2'
      });
    }).then(function(bipartiteGraph) {
      assert(bipartiteGraph.name === 'newBipartiteGraph1');
      return bipartiteGraph.isBipartiteGraph('newLeftProperty2');
    }).then(function(result) {
      assert.equal(true, result);
    });
  });
  it('bipartiteSubGraphFromInDegree() should return a SubGraph', function() {
    return p.then(function(graph) {
      return graph.bipartiteSubGraphFromInDegree();
    }).then(function(bipartiteGraph) {
      return bipartiteGraph.createVertexProperty('boolean');
    }).then(function(property) {
      return property.graph.isBipartiteGraph(property.name);
    }).then(function(result) {
      assert.equal(true, result);
    });
  });
  it('bipartiteSubGraphFromInDegree(options) should return a SubGraph', function() {
    return p.then(function(graph) {
      return graph.bipartiteSubGraphFromInDegree({
      'nodePropNames': ['prop1'],
      'edgePropNames': ['cost'],
      'newGraphName': 'newBipartiteGraph2',
      'isLeftPropName': 'newLeftProperty'
      });
    }).then(function(bipartiteGraph) {
      assert(bipartiteGraph.name === 'newBipartiteGraph2');
      return bipartiteGraph.isBipartiteGraph('newLeftProperty');
    }).then(function(result) {
      assert.equal(true, result);
    });
  });
  it('store with format should generate a file', function() {
    return p.then(function(graph) {
      return graph.store({
        overwrite: true,
        format: commonHelper.storeFormat.ADJ_LIST,
        targetPath: `${common.pgxDir}/graph1.txt`
      });
    }).then(function(result) {
      let stat = fs.statSync(`${common.pgxDir}/graph1.txt`);
      assert(stat.isFile() && result.format === commonHelper.storeFormat.ADJ_LIST);
    });
  });
  it('store with format and props should generate a file', function() {
    let vp;
    return p.then(function(graph) {
      return graph.getVertexProperty('prop1');
    }).then(function(property) {
      vp = property;
      return vp.graph.getEdgeProperty('cost');
    }).then(function(ep) {
      return ep.graph.store({
        overwrite: true,
        format: commonHelper.storeFormat.ADJ_LIST,
        targetPath: `${common.pgxDir}/graph2.txt`,
        vertexProps: [vp],
        edgeProps: [ep]
      });
    }).then(function(result) {
      let stat = fs.statSync(`${common.pgxDir}/graph2.txt`);
      assert(stat.isFile() && result.format === commonHelper.storeFormat.ADJ_LIST);
    });
  });
  it('store with graphConfig should generate a file', function() {
    let vp;
    let graphConfig = {
      format: commonHelper.storeFormat.ADJ_LIST,
      uri: `${common.pgxDir}/graph3.txt`,
      vertex_id_type: 'integer',
      error_handling: {},
      loading: {},
      vertex_props: [{'name': 'prop1', 'type': 'int'}],
      attributes: {},
      edge_props: [{'name': 'cost', 'type': 'double'}]
    };
    return p.then(function(graph) {
      return graph.store({
        overwrite: true,
        graphConfig: graphConfig
      });
    }).then(function(result) {
      let stat = fs.statSync(`${common.pgxDir}/graph3.txt`);
      assert(stat.isFile() && result.format === commonHelper.storeFormat.ADJ_LIST);
    });
  });
  it('clone should return a graph', function() {
    return p.then(function(graph) {
      return graph.clone();
    }).then(function(graph) {
      assert(graph.name.includes('sub-graph'));
    });
  });
  it('clone(options) should return a graph', function() {
    return p.then(function(graph) {
      return graph.clone({
        'nodePropNames': ['prop1'],
        'edgePropNames': ['cost'],
        'newGraphName': 'newCloneGraph'
      });
    }).then(function(graph) {
      assert(graph.name === 'newCloneGraph');
    });
  });
  it('rename should have a value', function() {
    return p.then(function(graph) {
      return graph.clone();
    }).then(function(graph) {
      return graph.rename("newGraphName");
    }).then(function(graph) {
      assert(graph.name === 'newGraphName');
    });
  });
  it('publish without properties', function() {
    let localGraph;
    return p.then(function(graph) {
      return graph.clone();
    }).then(function(graph) {
      return graph.publish();
    }).then(function(graph) {
      localGraph = graph;
      return localGraph.isPublished();
    }).then(function(result) {
      assert.equal(true, result);
      return localGraph.getVertexProperty("prop1");
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
  it('publish with all properties', function() {
    let localGraph;
    return p.then(function(graph) {
      return graph.clone();
    }).then(function(graph) {
      return graph.publish(propertyClass.ALL, propertyClass.ALL);
    }).then(function(graph) {
      localGraph = graph;
      return localGraph.isPublished();
    }).then(function(result) {
      assert.equal(true, result);
      return localGraph.getVertexProperty("prop1");
    }).then(function(property) {
      return property.isPublished();
    }).then(function(result) {
      assert.equal(true, result);
      return localGraph.getEdgeProperty("cost");
    }).then(function(property) {
      return property.isPublished();
    }).then(function(result) {
      assert.equal(true, result);
    });
  });
  it('publish with some properties', function() {
    let localGraph;
    return p.then(function(graph) {
      return graph.clone();
    }).then(function(graph) {
      return graph.publish(['prop1'], ['cost']);
    }).then(function(graph) {
      localGraph = graph;
      return localGraph.isPublished();
    }).then(function(result) {
      assert.equal(true, result);
      return localGraph.getVertexProperty("prop1");
    }).then(function(property) {
      return property.isPublished();
    }).then(function(result) {
      assert.equal(true, result);
      return localGraph.getEdgeProperty("cost");
    }).then(function(property) {
      return property.isPublished();
    }).then(function(result) {
      assert.equal(true, result);
    });
  });
  it('isPublished should be false', function() {
    return p.then(function(graph) {
      return graph.isPublished();
    }).then(function(result) {
      assert.equal(false, result);
    });
  });
  it('destroy should remove graph', function() {
    return p.then(function(graph) {
      return graph.destroy();
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
