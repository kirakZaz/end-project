const mongoose = require("mongoose");
const user = require("./users");

const tokensSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    email: { type: String, ref: "Users" },
    token: String,
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Tokens = mongoose.model("Tokens", tokensSchema);

module.exports = Tokens;
