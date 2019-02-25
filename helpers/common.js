'use strict'

module.exports.getOptions = function(defaultOptions, options) {
  let list = Object.keys(defaultOptions);
  let result = {};
  for(let i=0; i<list.length; i++) {
    if ( (options != null) && (options.hasOwnProperty(list[i])) ) {
      result[list[i]] = options[list[i]];
    } else {
      result[list[i]] = defaultOptions[list[i]];
    }
  }
  return result;
}

module.exports.createError = function(error, statusCode, result) {
  let localResult = result ? JSON.parse(result) : null;
  let obj = { err: error, statusCode: statusCode, result: localResult };
  return new Error(JSON.stringify(obj));
}

const storeFormat = {
  PGB: 'PGB',
  EDGE_LIST: 'EDGE_LIST',
  ADJ_LIST: 'ADJ_LIST',
  GRAPHML: 'GRAPHML'
}

const dateTypes = {
  LOCAL_DATE: "LOCAL_DATE",
  TIME: 'TIME',
  TIMESTAMP: 'TIMESTAMP',
  TIME_WITH_TIMEZONE: 'TIME_WITH_TIMEZONE',
  TIME_PART_OF_TIME_WITH_TZ: 'TIME_PART_OF_TIME_WITH_TZ',
  TZ_PART_OF_TIME_WITH_TZ: 'TZ_PART_OF_TIME_WITH_TZ',
  TIMESTAMP_WITH_TIMEZONE: 'TIMESTAMP_WITH_TIMEZONE',
  TIMESTAMP_PART_OF_TS_WITH_TZ: 'TIMESTAMP_PART_OF_TS_WITH_TZ',
  TZ_PART_OF_TS_WITH_TZ: 'TZ_PART_OF_TS_WITH_TZ'
};

module.exports.storeFormat = storeFormat;
module.exports.dateTypes = dateTypes;
