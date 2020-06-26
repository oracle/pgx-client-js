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


let graphJson = `
{
  "uri": "/opt/oracle/oradata/electric_graph.edge",
  "format": "edge_list",
  "separator": " ",
  "node_id_type": "long",
  "vertex_labels": true,
  "node_props": [
    {"name":"nickname",                 "type":"string"},
    {"name":"latitude",                 "type":"double"},
    {"name":"longitude",                "type":"double"},
    {"name":"parent",                   "type":"long"},
    {"name":"base_volts",               "type":"double"},
    {"name":"base_current",             "type":"double"},
    {"name":"base_power",               "type":"double"},
    {"name":"configuration",            "type":"string"},
    {"name":"remote_control_available", "type":"boolean"},
    {"name":"segment_id",               "type":"string"},
    {"name":"upstream_connection",      "type":"string"},
    {"name":"downstream_connection",    "type":"string"},
    {"name":"phase",                    "type":"string"},
    {"name":"nominal_feeder",           "type":"long"},
    {"name":"switch_default",           "type":"boolean"},
    {"name":"connection_id",            "type":"long"}
  ],
  "edge_props": [],
  "loading": {
    "load_vertex_labels" : true
  }
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

