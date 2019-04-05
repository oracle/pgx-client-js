/**
 * Copyright (c) 2019 Oracle and/or its affiliates. All rights reserved.
 *
 * Licensed under the Universal Permissive License v 1.0 as shown at
 * http://oss.oracle.com/licenses/upl.
 */
'use strict'

const pgx = require('../pgx.js');
const url = "https://localhost:7007"

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
  //let vf = pgx.createVertexFilter('true');
  //return graph.session.analyst.closenessCentralityUnitLength(graph);
  //return graph.session.analyst.closenessCentralityDoubleLength(graph, 'cost');
  //return graph.session.analyst.outDegreeCentrality(graph);
  //return graph.session.analyst.inDegreeCentrality(graph);
  //return graph.session.analyst.degreeCentrality(graph);
  //return graph.session.analyst.outDegreeDistribution(graph);
  //return graph.session.analyst.inDegreeDistribution(graph);
  //return graph.session.analyst.shortestPathDijkstra(graph, 128, 333, 'cost');
  //return graph.session.analyst.shortestPathFilteredDijkstra(graph, 128, 333, 'cost', vf);
  //return graph.session.analyst.shortestPathDijkstraBidirectional(graph, 128, 333, 'cost');
  //return graph.session.analyst.shortestPathFilteredDijkstraBidirectional(graph, 128, 333, 'cost', vf);
  //return graph.session.analyst.eigenvectorCentrality(graph, 2, 0, true, true) ;
  //return graph.session.analyst.fattestPath(graph, 128, 'cost') ;
  //return graph.session.analyst.filteredBfs(graph, 128, vf, vf, true) ;
  //return graph.session.analyst.hits(graph, 5) ;
  //return graph.session.analyst.kcore(graph, 0, 500) ;
  //return graph.session.analyst.pagerank(graph, 0.001, 0.85, 100);
  return graph.session.analyst.weightedPagerank(graph, 0.001, 0.85, 100,'cost');
  //return graph.session.analyst.personalizedPagerank(graph, 128, 0.001, 0.85, 100);
  //return graph.session.analyst.pagerankApproximate(graph, 0.001, 0.85, 100);
  //return graph.session.analyst.shortestPathBellmanFord(graph, 128, 'cost');
  //return graph.session.analyst.shortestPathBellmanFordReverse(graph, 128, 'cost');
  //return graph.session.analyst.shortestPathHopDist(graph, 128);
  //return graph.session.analyst.shortestPathHopDistReverse(graph, 128);
  //return graph.session.analyst.sccKosaraju(graph);
  //return graph.session.analyst.sccTarjan(graph);
  //return graph.session.analyst.countTriangles(graph, false);
  //return graph.session.analyst.countTriangles(graph, true);
  //return graph.session.analyst.vertexBetweennessCentrality(graph);
  //return graph.session.analyst.approximateVertexBetweennessCentrality(graph, 5);
  //return graph.session.analyst.approximateVertexBetweennessCentralityFromSeeds(graph, [128, 333]);
  //return graph.session.analyst.wcc(graph);
  //return graph.session.analyst.adamicAdarCounting(graph);
  //return graph.session.analyst.communitiesConductanceMinimization(graph, 5);
  //return graph.session.analyst.communitiesLabelPropagation(graph);
  //return graph.session.analyst.whomToFollow(graph, 128, 5);
}).then(function(property) {
  console.log(property);
}).catch(function(err) {
  console.log("error: " + err);
});