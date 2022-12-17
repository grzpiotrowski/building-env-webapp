"use strict";


const logger = require("../utils/logger");
const userstore = require("../models/user-store");
const envData = require("../models/env-data");

const dashboard = {
  async index(request, response) {
    const loggedInUser = userstore.getCurrentUser(request);
    if (loggedInUser) {
      logger.info("dashboard rendering");
      let data = await envData.collectRows();
      const viewData = {
        title: "Template 1 Dashboard",
        sensordata: data
      };
      //console.log(queryResult)
      response.render("dashboard", viewData);
    } else {
      response.redirect("/login");
    }
    
  }

};

module.exports = dashboard;
