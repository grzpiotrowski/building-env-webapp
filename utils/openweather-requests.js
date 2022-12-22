'use strict';

const axios = require("axios");

const openWeatherRequests = {

  async get5DayForecast(lat, lon) {
    const openWeatherApiKey = process.env.OPENWEATHERAPIKEY;
    const requestUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}`;
    const result = await axios.get(requestUrl);
    let report;
    if (result.status == 200) {
      report = result.data;
    }
    return report;
  }

}

module.exports = openWeatherRequests;