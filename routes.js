"use strict";

const express = require("express");
const router = express.Router();

const dashboard = require("./controllers/dashboard.js");
const about = require("./controllers/about.js");
const viewer = require("./controllers/viewer.js");
const accounts = require('./controllers/accounts');

router.get("/dashboard", dashboard.index);
router.get("/viewer", viewer.index)
router.get("/about", about.index);

router.get('/', accounts.index);
router.get('/login', accounts.login);
router.get('/signup', accounts.signup);
router.get('/logout', accounts.logout);
router.post('/register', accounts.register);
router.post('/authenticate', accounts.authenticate);

module.exports = router;
