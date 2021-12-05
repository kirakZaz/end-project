const tokens = require("../models/tokens");
const validator = require("validator");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

exports.findAll = (req, res) => {
  try {
    tokens.find({}, (err, tokens) => {
      if (err)
        res
          .status(400)
          .json({ error: "Invalid request, something went wrong!" });
      if (!tokens) res.status(401).json({ error: "Unauthorized action!" });
      res.json(tokens);
    });
  } catch (e) {
    res.status(401).json({ error: "Unauthorized action!" });
  }
};

exports.findOne = (req, res) => {
  try {
    let _id = req.params.id || null;

    if (!_id || validator.isEmpty(_id))
      res
        .status(400)
        .json({ success: false, error: "Invalid identifier has been sent!" });

    _id = mongoose.Types.ObjectId(_id);

    tokens.find({ _id }, (err, token) => {
      if (err)
        res
          .status(400)
          .json({ error: "Invalid request, something went wrong!" });
      if (!token) res.status(401).json({ error: "Unauthorized action!" });
      res.json(token[0]);
    });
  } catch (e) {
    res.status(401).json({ error: "Unauthorized action!" });
  }
};
const config = {
  secret: "bezkoder-secret-key",
};
const User = require("../models/users");

exports.create = (req, res) => {
  try {
    let { id } = req.body;
    User.findOne({ _id: id }, function (err, user) {
      if (user) {
        let _id = mongoose.Types.ObjectId();
        const userId = user._id || user.id;
        const email = user.email;

        const token = jwt.sign({ id: userId }, config.secret, {
          expiresIn: 86400, // 24 hours
        });
        tokens.create({ _id, email, token }, (err, token) => {
          if (err)
            res
              .status(400)
              .json({ error: "Invalid request, something went wrong!", err });
          res.status(201).json(token);
        });
      }
    });
  } catch (e) {
    res.status(401).json({ error: "Unauthorized action!" });
  }
};

exports.update = (req, res) => {
  try {
    let { id, token, username, email } = req.body;
    tokens.findOneAndUpdate(
      { _id: id },
      { $set: { token, username, email } },
      { new: true },
      (err, token) => {
        if (err) {
          res
            .status(400)
            .json({ success: false, error: "Can't update token!" });
        } else {
          res.json({ data: token });
        }
      }
    );
  } catch (e) {
    res.status(401).json({ error: "Unauthorized action!" });
  }
};

exports.delete = (req, res) => {
  try {
    const _id = req.params.id || null;
    if (_id) {
      tokens.deleteOne({ _id }, (err) => {
        if (err)
          res
            .status(400)
            .json({ success: false, error: "Can't remove token!" });
        res.json({ data: _id });
      });
    } else {
      res
        .status(400)
        .json({ error: "Identifier required to perform this action!" });
    }
  } catch (e) {
    res.status(401).json({ error: "Unauthorized action!" });
  }
};
