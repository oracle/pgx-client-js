'use strict'

const pgx = require(process.env.ORACLE_PGX_DIR);
const fs = require('fs');

let baseUrl = process.env.BASE_URL;

let options = {
  clientKey: fs.readFileSync(process.env.CLIENT_KEY),
  clientCert: fs.readFileSync(process.env.CLIENT_CERT),
  caCert: fs.readFileSync(process.env.CA_CERT),
  passphrase: process.env.PASSPHRASE,
  prefetchSize: 2048,
  uploadBatchSize: 65536,
  remoteFutureTimeout: 300000,
  remoteFuturePendingRetryInterval: 500
};

let graphJson = `{
                   "uri": "classpath:/graph-data/sample.adj",
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

let graphEdgeLabelJson = `{
                            "uri": "classpath:/graph-data/edge_labels.edge",
                            "format": "edge_list",
                            "vertex_props": [{
                              "name": "vertexProp",
                              "type": "long"
                            }],
                            "edge_props": [{
                              "name": "edgeProp",
                              "type": "double"
                            }],
                            "loading":{
                              "load_edge_label":true
                            },
                            "separator": " ",
                            "error_handling": {}
                          }`;

module.exports = {
  pgx: pgx,
  pgxDir: process.env.ORACLE_PGX_DIR,
  baseUrl: baseUrl,
  options: options,
  graphJson: graphJson,
  graphEdgeLabelJson, graphEdgeLabelJson
};