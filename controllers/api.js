'use strict';

const logger = require("../utils/logger");
const userstore = require("../models/user-store");
const envData = require("../models/env-data");

const api = {
  mqttDetails(request, response) {
    const loggedInUser = userstore.getCurrentUser(request);
    if (loggedInUser) {
      logger.info("mqttDetails API response");
      response.setHeader('Content-Type', 'application/json');
      const mqttHost = process.env.MQTTBROKER;
      const mqttPort = process.env.MQTTPORT;
      const mqttUser = process.env.MQTTUSERNAME;
      const mqttPass = process.env.MQTTPASSWORD;
      const jsonContent = `{ "host": "${mqttHost}", "port": ${mqttPort}, "user": "${mqttUser}", "pass": "${mqttPass}" }`;
      response.json(jsonContent);
    } else {
      response.send("NOT AUTHORIZED ACCESS!");
    }
  },

  async humidityReadings(request, response) {
    const loggedInUser = userstore.getCurrentUser(request);
    if (loggedInUser) {
      logger.info("HumidityReadings API response");
      let humidityData = await envData.collectDataRows("apartment-env-data", "environment", "humidity");
      response.json(humidityData);
    } else {
      response.send("NOT AUTHORIZED ACCESS!");
    }
  }
};
  
module.exports = api;