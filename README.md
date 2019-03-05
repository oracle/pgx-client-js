# PGX JavaScript client

Use the PGX JavaScript client to communicate with the PGX server from your JavaScript application.
More information about PGX (including documentation) can be found on the [Oracle Technology Network (OTN)](https://www.oracle.com/technetwork/oracle-labs/parallel-graph-analytix/overview/index.html) website.

## Installation

The PGX client needs a PGX server that it can connect to.

1. Download and extract PGX 2.7.0 Server from [Oracle Technology Network (OTN)](https://www.oracle.com/technetwork/oracle-labs/parallel-graph-analytix/downloads/index.html).
2. Set `enable_tls` and `enable_client_authentication` to `false` in `conf/server.conf`.
3. Set `allow_local_filesystem` to `true` in `conf/pgx.conf`.
4. Run `./bin/start-server`.

You can open [http://localhost:7007/version](http://localhost:7007/version) to verify the PGX server is up and running.

## Usage

The JS module requires two third-party modules that need to be installed:

```
npm i request cookie
```

Require the PGX JS client module in your project:

```
const pgx = require('./path/to/pgx.js');
```

Connect to the PGX server:

```
let p = pgx.connect('http://localhost:7007');
```

Load a graph and print the number of vertices and edges:

```
p.then(function (session) {
  return session.readGraphWithProperties({
    uri: 'examples/graphs/sample.adj',
    format: 'adj_list',
    vertex_props: [{
      name: 'prop1',
      type: 'int'
    }],
    'edge_props': [{
      name: 'cost',
      type: 'double'
    }],
    separator: ' ',
    loading: {},
    error_handling: {}
  })
}).then(function (graph) {
  console.log("Vertices: " + graph.numVertices);
  console.log("Edges: " + graph.numEdges);
});
```

## Known issues

### Compatibility

The PGX JS client is compatible with PGX 2.7.0, but not with PGX 3.0.0 or later due to changes in the REST API.
We invite contributions that make the PGX JS client compatible with newer versions of PGX.
The REST API used by PGX 3.2.0 is documented in [swagger.json](https://docs.oracle.com/cd/E56133_01/latest/swagger/swagger.json).
The easiest way to browse this documentation is by loading swagger.json into the [Swagger Editor](https://editor.swagger.io).

### Big numbers

JavaScript numbers are all floating point, stored according to the IEEE 754 standard.
The PGX server might return numbers that fall out of IEEE 754 integer precision range.
For example, the JSON may contain the number `9223372036854775807`, but the result of `JSON.parse` is `9223372036854776000`.
The [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) type provides a way to represent larger numbers.
We invite contributions that make the PGX JS client support large numbers.

## References

* [Documentation for PGX 2.7.0](https://docs.oracle.com/cd/E56133_01/2.7.0/index.html)
* [Documentation on latest PGX](https://docs.oracle.com/cd/E56133_01/latest/index.html)

