'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store.js');

const userStore = {

  store: new JsonStore('./models/user-store.json', { users: [] }),
  collection: 'users',

  getAllUsers() {
    return this.store.findAll(this.collection);
  },

  addUser(user) {
    this.store.add(this.collection, user);
    this.store.save();
  },

  updateUser(user, updatedUser) {
    user.firstName = updatedUser.firstName;
    user.lastName = updatedUser.lastName;
    this.store.save();
  },

  updateUserPassword(user, newPassword) {
    user.password = newPassword;
    this.store.save();
  },

  checkPassword(user, password) {
    return user.password === password;
  },

  getUserById(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  isEmailTaken(email) {
    if (this.store.findOneBy(this.collection, { email: email })) {
      return true;
    } else {
      return false;
    }
  },

  getUserByEmail(email) {
    return this.store.findOneBy(this.collection, { email: email });
  },

  getCurrentUser(request) {
    const userEmail = request.cookies.authToken;
    return this.getUserByEmail(userEmail);
  },
};

module.exports = userStore;