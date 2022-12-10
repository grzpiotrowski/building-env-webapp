'use strict';

const userstore = require('../models/user-store');
const logger = require('../utils/logger');
const uuid = require('uuid');
const { log } = require("winston");

const accounts = {

  index(request, response) {
    const viewData = {
      title: 'Home - BEMS',
    };
    response.render('index', viewData);
  },

  login(request, response) {
    const viewData = {
      title: 'Login - BEMS',
    };
    response.render('login', viewData);
  },

  logout(request, response) {
    response.cookie('authToken', '');
    response.redirect('/');
  },

  signup(request, response) {
    const viewData = {
      title: 'Signup - BEMS',
    };
    response.render('signup', viewData);
  },

  register(request, response) {
    const user = request.body;

    let errormessages = [];
    if (userstore.isEmailTaken(user.email)) {
      logger.info("Email already taken: " + user.email);
      errormessages.push("Email already taken.");
    }
    if (!user.email) {
      errormessages.push("Email is required.");
    }
    if (!user.password) {
      errormessages.push("Password is required.");
    }
    if (!user.firstname) {
      errormessages.push("First Name is required.");
    }
    if (!user.lastname) {
      errormessages.push("Last Name is required.");
    }

    if (errormessages.length === 0) {
      logger.info(`Registering new user: ${user.email}`);
      user.id = uuid.v1();
      userstore.addUser(user);
      response.redirect("/");
    } else {
      const viewData = {
        title: "Signup - BEMS",
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        errors: errormessages
      }
      response.render("signup", viewData);
    }
  },

  authenticate(request, response) {
    let errormessages = [];
    const user = userstore.getUserByEmail(request.body.email);
    if (user && userstore.checkPassword(user, request.body.password)) {
      response.cookie('authToken', user.email);
      logger.info(`logging in ${user.email}`);
      response.redirect('/dashboard');
    } else {
      const viewData = {
        title: 'Login - BEMS',
        errors: errormessages
      };
      errormessages.push('Incorrect login or password!');
      response.render('login', viewData);
    }
  },

};

module.exports = accounts;
