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

let localGraph = {};

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

p.then(function(session) {
  return session.readGraphWithProperties(jsonContent);
}).then(function(graph) {
  localGraph = graph;
  return graph.session.analyst.sccKosaraju(graph);
}).then(function(partition) {
  partition.iterator().then(function(iterator) {
    iterator.forEach(function(vertexSet) {
      console.log("iterator rows: " + vertexSet.name)
    });
  });
  console.log('size: ' + partition.size());
  partition.getPartitionIndexOfVertex(128).then(function(result) {
    console.log('getPartitionIndexOfVertex: ' + result);
  });
  partition.getPartitionByVertex(128).then(function(result) {
    console.log("partitionByVertex: " + result.name);
  });
  partition.getPartitionByIndex(0).then(function(result) {
    console.log("partitionByIndex: " + result.name);
    partition.destroy().then(function(result) {
      console.log("destroy: " + result);
    });
  });
}).catch(function(err) {
  console.log("error: " + err);
});