"use strict";

const {InfluxDB, Point} = require('@influxdata/influxdb-client');

const token = process.env.INFLUXDB_TOKEN;
const url = process.env.INFLUXDB_URL;

const influxDbClient = new InfluxDB({url, token});

module.exports = influxDbClient;