"use strict";

const logger = require("../utils/logger");
const userstore = require("../models/user-store");

const viewer = {
  index(request, response) {
    const loggedInUser = userstore.getCurrentUser(request);
    if (loggedInUser) {
      logger.info("viewer rendering");
      const viewData = {
        title: "3D Viewer",
      };
      response.render("viewer", viewData);
    } else {
      response.redirect("/login");
    }
  },
};

module.exports = viewer;
