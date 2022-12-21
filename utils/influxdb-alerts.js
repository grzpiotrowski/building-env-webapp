'use strict';

const axios = require("axios");

const influxDbAlerts = {

  async getAllChecks() {
    const token = process.env.INFLUXDB_TOKEN;
    const requestUrl = `${process.env.INFLUXDB_URL}/api/v2/checks`;
    const result = await axios.get(requestUrl, {
        headers: {"Authorization" : `Token ${token}`} 
    });
    const checks = new Map();
    if (result.status == 200) {
        result.data.checks.forEach((check) => {
            checks.set(check.id, check.name);
        })
    }
    return checks;
  },

  async getCheck(checkId) {
    const token = process.env.INFLUXDB_TOKEN;
    const requestUrl = `${process.env.INFLUXDB_URL}/api/v2/checks/${checkId}`;
    const result = await axios.get(requestUrl, {
        headers: {"Authorization" : `Token ${token}`} 
    });
    let check;
    if (result.status == 200) {
        check = result.data;
    }
    return check;
  }

}

module.exports = influxDbAlerts;