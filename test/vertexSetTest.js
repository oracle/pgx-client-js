/**
 * Copyright (c) 2019 Oracle and/or its affiliates. All rights reserved.
 *
 * Licensed under the Universal Permissive License v 1.0 as shown at
 * http://oss.oracle.com/licenses/upl.
 */
'use strict'

const pgx = require('../pgx.js');
const url = "http://localhost:7007"

var path = require('path');
var fs = require('fs');

// const clientKey = fs.readFileSync(path.resolve(__dirname, "../../../../client/build/keys/client_key.pem"));
// const clientCert = fs.readFileSync(path.resolve(__dirname, "../../../../client/build/keys/client_certificate.pem"));
// const caCert = fs.readFileSync(path.resolve(__dirname, "../../../../client/build/keys/ca_certificate.pem"));

let options = {
  // clientKey: clientKey,
  // clientCert: clientCert,
  // caCert: caCert,
  // passphrase: 'sysadm',
  prefetchSize: 2048,
  uploadBatchSize: 65536,
  remoteFutureTimeout: 300000,
  remoteFuturePendingRetryInterval: 500
};
let p = pgx.connect(url, options);

let jsonContent = `{
                    "uri": "examples/graphs/sample.adj",
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

let localProperty = {};

p.then(function(session) {
  return session.readGraphWithProperties(jsonContent);
}).then(function(graph) {
  return graph.createVertexSet();
}).then(function(vertexSet) {
  console.log(vertexSet);
  vertexSet.size().then(function(result) {
    console.log('size: ' + result);
  });
  vertexSet.addAll([333, 99]).then(function(result) {
    console.log('addAll: ' + result);
    vertexSet.clear().then(function(result) {
      console.log('clear: ' + result);
      vertexSet.destroy().then(function(vertexSet) {
        console.log('new vertexSet: ' + vertexSet);
      });
    });
  });
}).catch(function(err) {
  console.log("error: " + err);
});