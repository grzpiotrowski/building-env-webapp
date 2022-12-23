"use strict";


const logger = require("../utils/logger");
const userstore = require("../models/user-store");
const influxDbAlerts = require('../utils/influxdb-alerts');
const openWeatherRequests = require("../utils/openweather-requests")
const weatherAnalytics = require("../utils/weatherAnalytics");
const { getHeatingSuggestion } = require("../utils/weatherAnalytics");

const dashboard = {
  async index(request, response) {
    const loggedInUser = userstore.getCurrentUser(request);
    if (loggedInUser) {
      logger.info("dashboard rendering");
      let checkData = [];
      await influxDbAlerts.getAllChecks().then((checks) => {
        checks.forEach((check) => {
          if (check.name.startsWith("Temperature")) {
            checkData.push({
              "id": check.id,
              "name": check.name,
              "thresholds": check.thresholds
            });
          }
        });
      });
      const lat = 53.179;
      const lon = -6.815;
      const minTempThreshold = 10;
      let forecastDates = [], forecastTemp = [];
      let minTemp, minTempDate, heatingSuggestion;
      await openWeatherRequests.get5DayForecast(lat, lon).then((data) => {
        data.forEach((chunk) => {
          forecastDates.push(chunk.dt_txt);
          forecastTemp.push(chunk.main.temp);
        });
        let minForecast = weatherAnalytics.getMinimumTemperature(forecastTemp, forecastDates);
        minTemp = Number(minForecast.minTemp);
        minTempDate = minForecast.date;
        heatingSuggestion = weatherAnalytics.getHeatingSuggestion(minTemp, minTempThreshold);
      });
      
      const viewData = {
        title: "Dashboard",
        checkData: checkData,
        forecastDates: forecastDates,
        forecastTemp: forecastTemp,
        minTemp: minTemp,
        minTempDate: minTempDate,
        heatingSuggestion: heatingSuggestion
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
