const uri = process.env.DATABASE_URL;

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = uri;

db.user = require("./users");
db.token = require("./tokens");
db.message = require("./messages");

module.exports = db;
