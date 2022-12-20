"use strict";


const logger = require("../utils/logger");
const userstore = require("../models/user-store");
const envData = require("../models/env-data");

const dashboard = {
  async index(request, response) {
    const loggedInUser = userstore.getCurrentUser(request);
    if (loggedInUser) {
      logger.info("dashboard rendering");
      let humidityData = await envData.collectDataRows("apartment-env-data", "environment", "humidity");
      const viewData = {
        title: "Dashboard",
        humidityData: humidityData
      };
      console.log(humidityData)
      response.render("dashboard", viewData);
    } else {
      response.redirect("/login");
    }
    
  }

};

module.exports = dashboard;
