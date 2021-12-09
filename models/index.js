const dbConfig = require("../config/dbConfig");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;

db.user = require("./users");
db.token = require("./tokens");
db.message = require("./messages");

module.exports = db;
