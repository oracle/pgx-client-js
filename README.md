# PGX JavaScript Client

Use the PGX JavaScript client to communicate with the PGX server from your JavaScript application.
More information about PGX can be found on the [Oracle Technology Network (OTN)](https://www.oracle.com/technetwork/oracle-labs/parallel-graph-analytix/overview/index.html) page and the [PGX documentation](https://docs.oracle.com/cd/E56133_01/latest/) website.

## Prerequisites

The PGX client needs a PGX server that it can connect to.

1. Download and extract PGX 2.7.0 Server from [Oracle Technology Network (OTN)](https://www.oracle.com/technetwork/oracle-labs/parallel-graph-analytix/downloads/index.html).
2. Set `enable_tls` and `enable_client_authentication` to `false` in `conf/server.conf`.
3. Set `allow_local_filesystem` to `true` in `conf/pgx.conf`.
4. Run `./bin/start-server`.

You can open [http://localhost:7007/version](http://localhost:7007/version) to verify the PGX server is up and running.
Once the PGX server is up and running you can use this library to connect to the server from JavaScript.

## Usage

Add `pgx-client-js` as a dependency of your project:

```
npm i oracle/pgx-client-js
```

Require the PGX JS client module in your project:

```js
const pgx = require('pgx-client-js');
```

Connect to the PGX server:

```js
let p = pgx.connect('http://localhost:7007');
```

Load a graph and print the number of vertices and edges:

```js
p.then(function (session) {
  return session.readGraphWithProperties({
    uri: 'examples/graphs/sample.adj',
    format: 'adj_list',
    vertex_props: [{
      name: 'prop1',
      type: 'int'
    }],
    edge_props: [{
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

The PGX JS client is compatible with PGX 2.7.0.
Because PGX 3.0.0 made big changes in the REST API, many methods are no longer compatible.
A small number of methods (listed below) have been updated to work with PGX 19.1.
We invite contributions that make the PGX JS client compatible with newer versions of PGX.
The REST API used by PGX 3.2.0 is documented in [swagger.json](https://docs.oracle.com/cd/E56133_01/latest/swagger/swagger.json).
The easiest way to browse this documentation is by loading swagger.json into the [Swagger Editor](https://editor.swagger.io).

The following methods have been updated to work with PGX 19.1:

- `session.readGraphWithProperties`
- `session.getGraph`
- `graph.queryPgql`
- `resultSet.getResults`
- `resultSet.getResultSetElements`
- `resultSet.getResultSet`
- `session.postSession`
- `session.delSession`

### Big numbers

JavaScript numbers are all floating point, stored according to the IEEE 754 standard.
The PGX server might return numbers that fall out of IEEE 754 integer precision range.
For example, the JSON may contain the number `9223372036854775807`, but the result of `JSON.parse` is `9223372036854776000`.
The [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) type provides a way to represent larger numbers.
We invite contributions that make the PGX JS client support large numbers.

## Resources

* [PGX on Oracle Technology Network](https://www.oracle.com/technetwork/oracle-labs/parallel-graph-analytix/overview/index.html)
* [Documentation PGX 2.7.0](https://docs.oracle.com/cd/E56133_01/2.7.0/index.html)
* [Documentation PGX (latest)](https://docs.oracle.com/cd/E56133_01/latest/index.html)
* [PGX Sample code](https://github.com/oracle/pgx-samples)
