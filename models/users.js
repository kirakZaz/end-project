const mongoose = require("mongoose");

const usersSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    username: { type: String, ref: "Messages" },
    password: String,
    email: { type: String },
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Messages" }],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Users = mongoose.model("Users", usersSchema);

module.exports = Users;
