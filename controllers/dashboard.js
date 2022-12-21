"use strict";


const logger = require("../utils/logger");
const userstore = require("../models/user-store");
const influxDbAlerts = require('../utils/influxdb-alerts');

const dashboard = {
  async index(request, response) {
    const loggedInUser = userstore.getCurrentUser(request);
    if (loggedInUser) {
      logger.info("dashboard rendering");
      const viewData = {
        title: "Dashboard",
      };
      response.render("dashboard", viewData);
    } else {
      response.redirect("/login");
    }
    
  }

};

module.exports = dashboard;
