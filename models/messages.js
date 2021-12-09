const mongoose = require("mongoose");
const user = require("./users");

const messagesSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    email: { type: String, ref: "User" },
    message: String,
    username: { type: String, ref: "User" },
  },
  {
    versionKey: false, // Unable auto-version after persist database
  }
);

const Messages = mongoose.model("Messages", messagesSchema);

module.exports = Messages;
