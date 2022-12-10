'use strict';

const logger = require('../utils/logger');
const userstore = require("../models/user-store");

const about = {
  index(request, response) {
    const loggedInUser = userstore.getCurrentUser(request);
    if (loggedInUser) {
      logger.info('about rendering');
      const viewData = {
        title: 'About - BEMS IoT',
      };
      response.render('about', viewData);
    } else {
      response.redirect('/login');
    }
  },
};

module.exports = about;
