/**
 * Copyright (c) 2019 Oracle and/or its affiliates. All rights reserved.
 *
 * Licensed under the Universal Permissive License v 1.0 as shown at
 * http://oss.oracle.com/licenses/upl.
 */
'use strict'

const pgx = require('../../../main/javascript/pgx.js');

let p = pgx.connect(process.argv[2]);

let jsonContent = `{
    "uri": "/scratch_user/projectq/graphdata/qa_framework/pagerank_testgraph.edge",
    "edge_props": [],
    "format": "edge_list",
    "node_props": [
        {
            "name": "pagerank",
            "type": "double"
        }
    ],
    "separator": " "
}`;

let prop;

p.then(function(session) {
  console.log(session.sessionId);
  return session.readGraphWithProperties(jsonContent);
}).then(function(graph) {
  console.log(graph.name);
  return graph.session.analyst.kcore(graph);
}).then(function(pair) {
  console.log(pair.first.name);
  console.log(pair.second.name);
  prop = pair.second;
  return pair.first.get();
}).then(function(value) {
  console.log(value);
  prop.iterateTopKValues(5, function(row) {
    console.log(row);
  });
  return prop;
}).catch(function(err) {
  console.log("error: " + err);
});
