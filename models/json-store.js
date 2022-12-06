"use strict";

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

class JsonStore {
  constructor(file, defaults) {
    const adapter = new FileSync(file);
    this.db = low(adapter);
    this.db.defaults(defaults).value();
  }

  save() {
    this.db.write();
  }

  add(collection, obj) {
    this.db
      .get(collection)
      .push(obj)
      .last()
      .value();
  }

  remove(collection, obj) {
    this.db
      .get(collection)
      .remove(obj)
      .value();
  }

  removeAll(collection) {
    this.db
      .get(collection)
      .remove()
      .value();
  }

  findAll(collection) {
    return this.db.get(collection).value();
  }

  findOneBy(collection, filter) {
    const results = this.db
      .get(collection)
      .filter(filter)
      .value();
    return results[0];
  }

  findByIds(collection, ids) {
    return this.db
      .get(collection)
      .keyBy("id")
      .at(ids)
      .value();
  }

  findBy(collection, filter) {
    return this.db
      .get(collection)
      .filter(filter)
      .value();
  }
}

module.exports = JsonStore;
