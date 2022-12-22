"use strict";


const logger = require("../utils/logger");
const userstore = require("../models/user-store");
const influxDbAlerts = require('../utils/influxdb-alerts');

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
      const viewData = {
        title: "Dashboard",
        checkData: checkData,
      };
      response.render("dashboard", viewData);
    } else {
      response.redirect("/login");
    }
    
  }

};

module.exports = dashboard;
