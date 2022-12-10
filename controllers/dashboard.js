"use strict";

const { reduce } = require("lodash");
const logger = require("../utils/logger");
const userstore = require("../models/user-store");

const dashboard = {
  index(request, response) {
    const loggedInUser = userstore.getCurrentUser(request);
    if (loggedInUser) {
      logger.info("dashboard rendering");
      const viewData = {
        title: "Template 1 Dashboard",
      };
      response.render("dashboard", viewData);
    } else {
      response.redirect("/login");
    }
    
  },
};

module.exports = dashboard;
