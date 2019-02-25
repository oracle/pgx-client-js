'use strict'

const pgx = require('../../../main/javascript/pgx.js');
const algorithmHelper = require('../../../main/javascript/helpers/algorithm.js');

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

p.then(function(session) {
  console.log(session.sessionId);
  return session.readGraphWithProperties(jsonContent);
}).then(function(graph) {
  console.log(graph.name);
  if (process.argv[3] === '1') {
    console.log('pagerank approximate...');
    return graph.session.analyst.pagerank(graph, {variant: algorithmHelper.pagerankVariant.APPROXIMATE});
  } else if (process.argv[3] === '2') {
    console.log('eigenvectorCentrality...');
    return graph.session.analyst.eigenvectorCentrality(graph);
  } else {
    console.log('pagerank...');
    return graph.session.analyst.pagerank(graph);
  }
}).then(function(property) {
  console.log(property.name);
  return property;
}).then(function(property) {
  property.iterateTopKValues(5, function(row) {
    console.log(row);
  });
  return property;
}).catch(function(err) {
  console.log("error: " + err);
});
