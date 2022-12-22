"use strict";


const logger = require("../utils/logger");
const userstore = require("../models/user-store");
const influxDbAlerts = require('../utils/influxdb-alerts');
const openWeatherRequests = require("../utils/openweather-requests")

const dashboard = {
  async index(request, response) {
    const loggedInUser = userstore.getCurrentUser(request);
    if (loggedInUser) {
      logger.info("dashboard rendering");
      let checkData = [];
      await influxDbAlerts.getAllChecks().then((checks) => {
        checks.forEach((check) => {
          checkData.push({
            "id": check.id,
            "name": check.name,
            "thresholds": check.thresholds
          })
        });
      });
      const lat = 53.179;
      const lon = -6.815;
      let forecastDates = [], forecastTemp = [];
      await openWeatherRequests.get5DayForecast(lat, lon).then((data) => {
        data.forEach((chunk) => {
          forecastDates.push(chunk.dt_txt);
          forecastTemp.push(chunk.main.temp.toFixed(1));
        })
      });
      
      const viewData = {
        title: "Dashboard",
        checkData: checkData,
        forecastDates: forecastDates,
        forecastTemp: forecastTemp,
      };
      response.render("dashboard", viewData);
    } else {
      response.redirect("/login");
    }
    
  },

  async updateTargetTemperature(request, response) {
    const loggedInUser = userstore.getCurrentUser(request);
    if (loggedInUser) {
      logger.info("Updating target temperature");
      const checkId = request.params.id;
      const newValue = Number(request.body.targetValue);
      const level = request.body.level;
      console.log(`check to update: ${checkId}`)
      console.log(`new value: ${newValue} for level ${level}`);
      let check = await influxDbAlerts.getCheck(checkId);
      await influxDbAlerts.updateThreshold(checkId, check, level, newValue);

      response.redirect("/dashboard");
    } else {
      response.redirect("/login");
    }
  }

};

module.exports = dashboard;
