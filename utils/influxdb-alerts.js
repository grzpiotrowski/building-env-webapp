'use strict';

const axios = require("axios");

const influxDbAlerts = {

  async getAllChecks() {
    const token = process.env.INFLUXDB_TOKEN;
    const requestUrl = `${process.env.INFLUXDB_URL}/api/v2/checks`;
    const result = await axios.get(requestUrl, {
        headers: {"Authorization" : `Token ${token}`} 
    });
    const checks = [];
    if (result.status == 200) {
        result.data.checks.forEach((check) => {
            checks.push(check);
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
        console.log(check)
    }
    return check;
  },


  async updateThreshold(checkId, check, thresholdLevel, value) {
    const token = process.env.INFLUXDB_TOKEN;
    const requestUrl = `${process.env.INFLUXDB_URL}/api/v2/checks/${checkId}`;
    
    check.thresholds.forEach((threshold) => {
        if (threshold.level === thresholdLevel) {
            threshold.value = value;
        };
    });
    const result = await axios.put(requestUrl,
        check,
        {
            headers: {"Authorization" : `Token ${token}`} 
        });

    let responseCheck;
    if (result.status == 200) {
        console.log("Threshold updated:");
        console.log(result.data.thresholds);
        responseCheck = result.data;
    };
    return responseCheck;
  },



}

module.exports = influxDbAlerts;