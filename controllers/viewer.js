"use strict";

const logger = require("../utils/logger");

const viewer = {
  index(request, response) {
    logger.info("viewer rendering");
    const viewData = {
      title: "3D Viewer",
      scripts: [
        "js/viewer.js"
      ]
    };
    response.render("viewer", viewData);
  },
};

module.exports = viewer;
