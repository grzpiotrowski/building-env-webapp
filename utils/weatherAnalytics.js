'use strict';

const _ = require('lodash');
const weatherAnalytics = {

  getMinimumTemperature(temperatures, dates) {
    const minTemp = Math.min.apply(null, temperatures);
    const index = temperatures.indexOf(minTemp);
    const date = dates[index];
    return {"minTemp": minTemp, "date": date};
  },

  getHeatingSuggestion(minTemperature, threshold) {
    if (minTemperature < threshold) {
      return "Consider keeping the heating ON.";
    } else {
      return "You might keep the heating OFF.";
    }
  }

}

module.exports = weatherAnalytics;