const mongoose = require("mongoose");
const message = require("./messages");

const usersSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    password: String,
    email: { type: String },
  },
  {
    versionKey: false, // Unable auto-version after persist database
  }
);

const Users = mongoose.model("Users", usersSchema);

module.exports = Users;
