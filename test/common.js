'use strict'

let oracle_pgx_dir = process.env.ORACLE_PGX_DIR || process.cwd();
const pgx = require(oracle_pgx_dir);
const fs = require('fs');

let baseUrl = process.env.BASE_URL || "http://localhost:7007";

let options = {
  clientKey: process.env.CLIENT_KEY ? fs.readFileSync(process.env.CLIENT_KEY) : "",
  clientCert: process.env.CLIENT_CERT ? fs.readFileSync(process.env.CLIENT_CERT) : "",
  caCert: process.env.CA_CERT ? fs.readFileSync(process.env.CA_CERT) : "",
  passphrase: process.env.PASSPHRASE || "",
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
                            "uri": "examples/graphs/connections.edge_list.json",
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
  pgxDir: oracle_pgx_dir,
  baseUrl: baseUrl,
  options: options,
  graphJson: graphJson,
  graphEdgeLabelJson, graphEdgeLabelJson
};

