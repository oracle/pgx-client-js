/**
 * Copyright (c) 2019 Oracle and/or its affiliates. All rights reserved.
 *
 * Licensed under the Universal Permissive License v 1.0 as shown at
 * http://oss.oracle.com/licenses/upl.
 */
'use strict'

const pgx = require('../../main/javascript/pgx.js');
const url = "https://localhost:7007"

var path = require('path');
var fs = require('fs');

const clientKey = fs.readFileSync(path.resolve(__dirname, "../../../../client/build/keys/client_key.pem"));
const clientCert = fs.readFileSync(path.resolve(__dirname, "../../../../client/build/keys/client_certificate.pem"));
const caCert = fs.readFileSync(path.resolve(__dirname, "../../../../client/build/keys/ca_certificate.pem"));

let options = {
  clientKey: clientKey,
  clientCert: clientCert,
  caCert: caCert,
  passphrase: 'sysadm',
  prefetchSize: 2048,
  uploadBatchSize: 65536,
  remoteFutureTimeout: 300000,
  remoteFuturePendingRetryInterval: 500
};
let p = pgx.connect(url, options);

let jsonContent = `{
                    "uri": "http://slc09iyv.us.oracle.com:8000/sample.adj",
                    "format": "adj_list",
                    "vertex_props": [{
                      "name": "prop1",
                      "type": "int"
                    }],
                    "edge_props": [{
                      "name": "cost",
                      "type": "double"
                    }],
                    "separator": " ",
                    "loading": {},
                    "error_handling": {}
                  }`;

let localSession = {};
let localGraph = {};
let localProperty = {};
let localResultSet = {};

p.then(function(session) {
  localSession = session;
  return localSession.readGraphWithProperties(jsonContent);
}).then(function(graph) {
  localGraph = graph;
  console.log("Vertices: " + localGraph.numVertices);
  console.log("Edges: " + localGraph.numEdges);
  return localSession.analyst.pagerank(graph, 0.001, 0.85, 100);
}).then(function(property) {
  localProperty = property;
  localProperty.topK(4).then(function(result) {
    result.forEach(function(row) {
      console.log(`topK: ${row.key} -> ${row.value}`)
    })
  });
  return localGraph.queryPgql("SELECT n, n.pagerank WHERE (n) ORDER BY n.pagerank");
}).then(function(resultSet) {
  localResultSet = resultSet;
  localResultSet.forEach(function(row) {
    console.log("queryPgql: " + row[0])
  })
  console.log('old resultSet: ' + localResultSet.result.resultSetId);
  console.log('old property: ' + localProperty.result.name);
  console.log('old graph: ' + localGraph.result.graphName);
  console.log('old session: ' + localSession.sessionId);
  localResultSet.destroy().then(function(result) {
    console.log('new resultSet: ' + result);
  });
  localProperty.destroy().then(function(result) {
    console.log('new property: ' + result);
  });
  localGraph.destroy().then(function(result) {
    console.log('new graph: ' + result);
    localSession.destroy().then(function(result) {
      console.log('new session: ' + result);
    });
  });
}).catch(function(err) {
  console.log("error: " + err);
});