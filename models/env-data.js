'use strict';


const dbClient = require("../db");

const envData = {
  // Execute query and collect result rows in a Promise.
  async collectDataRows(bucket, measurement, field) {
    console.log('\n*** CollectRows ***')
    const org = process.env.INFLUXDB_ORG;
    let queryApi = dbClient.getQueryApi(org)
    let fluxQuery = `from(bucket: "${bucket}")
     |> range(start: -1d)
     |> filter(fn: (r) => r._measurement == "${measurement}" and
     r._field == "${field}")
     |> aggregateWindow(every: 15m, fn: mean, createEmpty: true)`
    const data = await queryApi.collectRows(
      fluxQuery //, you can also specify a row mapper as a second argument
    );
    //data.forEach((x) => console.log(JSON.stringify(x)));
    console.log('\nCollect ROWS SUCCESS');
    return data;
  }

}


module.exports = envData;