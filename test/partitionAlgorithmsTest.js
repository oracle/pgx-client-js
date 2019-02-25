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
  //return graph.session.analyst.sccTarjan(graph);
  //return graph.session.analyst.wcc(graph);
  //return graph.session.analyst.communitiesConductanceMinimization(graph, 5);
  //return graph.session.analyst.communitiesLabelPropagation(graph);
}).then(function(partition) {
  return localGraph.session.analyst.conductance(localGraph, partition, 0);
  //return localGraph.session.analyst.partitionConductance(localGraph, partition);
  //return localGraph.session.analyst.partitionModularity(localGraph, partition);
}).then(function(item) {
  console.log(item);
}).catch(function(err) {
  console.log("error: " + err);
});