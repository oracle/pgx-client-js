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

p.then(function(session) {
  return session.readGraphWithProperties(jsonContent);
}).then(function(graph) {
  return graph.session.analyst.outDegreeDistribution(graph);
  //return graph.session.analyst.inDegreeDistribution(graph);
}).then(function(map) {
  map.containsKey(0).then(function(result) {
    console.log('containsKey: ' + result);
  });
  return map;
}).then(function(map) {
  map.entries().then(function(result) {
    console.log('entries: ' + result);
  });
  return map;
}).then(function(map) {
  map.get(1).then(function(result) {
    console.log('get: ' + result);
  });
  return map;
}).then(function(map) {
  map.keys().then(function(result) {
    console.log('keys: ' + result);
  });
  return map;
}).then(function(map) {
    map.remove(0).then(function(result) {
      console.log('remove: ' + result);
    });
    return map;
}).then(function(map) {
  map.set(3,4).then(function(result) {
    console.log('set: ' + result);
  });
  return map;
}).then(function(map) {
  map.size().then(function(result) {
    console.log('size: ' + result);
  });
  return map;
}).then(function(map) {
  console.log('Map name: ' + map.name);
  map.destroy().then(function(result) {
    console.log('new Map: ' + result);
  });
}).catch(function(err) {
  console.log("error: " + err);
});