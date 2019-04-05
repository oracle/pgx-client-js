/**
 * Copyright (c) 2019 Oracle and/or its affiliates. All rights reserved.
 *
 * Licensed under the Universal Permissive License v 1.0 as shown at
 * http://oss.oracle.com/licenses/upl.
 */
'use strict'

const pgx = require('../pgx.js');

let vf = pgx.createVertexFilter('true');
console.log('binaryOperation: ' + vf.binaryOperation);
console.log('filterExpression: ' + vf.filterExpression);
console.log('type: ' + vf.type);
console.log(vf.intersect(vf));
console.log(vf.union(vf));
console.log(vf.intersect(vf).intersect(vf));
console.log(vf.union(vf).union(vf));

let ef = pgx.createEdgeFilter('edge.cost > 5');
console.log('binaryOperation: ' + ef.binaryOperation);
console.log('filterExpression: ' + ef.filterExpression);
console.log('type: ' + ef.type);
console.log(ef.intersect(ef));
console.log(ef.union(ef));
console.log(ef.intersect(ef).intersect(ef));
console.log(ef.union(ef).union(ef));