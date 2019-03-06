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
        "format": "edge_list",
        "uri": "/scratch_user/projectq/graphdata/qa_framework/bellman_ford_testgraph.edge",
        "node_props": [
                {"name": "distance", "type": "double"},
                {"name": "prev_node", "type": "node"}
        ],
        "edge_props": [
                {"name": "cost", "type": "double"}
        ],
        "separator": " "
}`;

p.then(function(session) {
  console.log(session.sessionId);
  return session.readGraphWithProperties(jsonContent);
}).then(function(graph) {
  console.log(graph.name);
  return graph.session.analyst.wcc(graph);
}).then(function(partition) {
  partition.iterate(function(row) {
    console.log(row.elementType + ' ' + row.collectionType + ': ' + row.name);
  });
  return partition;
}).catch(function(err) {
  console.log(err);
});
