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
	"loading": {
		"load_vertex_labels": true
	},
	"attributes": {},
	"edge_props": [{
		"dimension": 0,
		"name": "cost",
		"type": "double"
	}],
	"error_handling": {},
	"format": "edge_list",
	"vertex_uris": ["/opt/oracle/oradata/electric_graph.edge"],
	"vertex_id_type": "long",
	"vertex_props": [{
		"dimension": 0,
		"name": "base_power",
		"type": "double"
	}, {
		"dimension": 0,
		"name": "parent",
		"type": "long"
	}, {
		"dimension": 0,
		"name": "latitude",
		"type": "double"
	}, {
		"dimension": 0,
		"name": "nickname",
		"type": "string"
	}, {
		"dimension": 0,
		"name": "nominal_feeder",
		"type": "long"
	}, {
		"dimension": 0,
		"name": "configuration",
		"type": "string"
	}, {
		"dimension": 0,
		"name": "segment_id",
		"type": "string"
	}, {
		"dimension": 0,
		"name": "switch_default",
		"type": "boolean"
	}, {
		"dimension": 0,
		"name": "remote_control_available",
		"type": "boolean"
	}, {
		"dimension": 0,
		"name": "connection_id",
		"type": "long"
	}, {
		"dimension": 0,
		"name": "phase",
		"type": "string"
	}, {
		"dimension": 0,
		"name": "upstream_connection",
		"type": "string"
	}, {
		"dimension": 0,
		"name": "base_current",
		"type": "double"
	}, {
		"dimension": 0,
		"name": "longitude",
		"type": "double"
	}, {
		"dimension": 0,
		"name": "base_volts",
		"type": "double"
	}, {
		"dimension": 0,
		"name": "downstream_connection",
		"type": "string"
	}],
	"edge_uris": []
}
`;

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

