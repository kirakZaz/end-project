const Users = require("../models/users");
const validator = require("validator");
const mongoose = require("mongoose");

exports.findAll = (req, res) => {
  try {
    Users.find({}, (err, users) => {
      if (err)
        res
          .status(400)
          .json({ error: "Invalid request, something went wrong!" });
      if (!users) res.status(401).json({ error: "Unauthorized action!" });
      res.json(users);
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

    Users.find({ _id }, (err, user) => {
      if (err)
        res
          .status(400)
          .json({ error: "Invalid request, something went wrong!" });
      if (!user) res.status(401).json({ error: "Unauthorized action!" });
      res.json(user[0]);
    });
  } catch (e) {
    res.status(401).json({ error: "Unauthorized action!" });
  }
};

exports.create = (req, res) => {
  try {
    let { username, password, role, email } = req.body;
    let _id = mongoose.Types.ObjectId();

    Users.create({ _id, username, password, role, email }, (err, user) => {
      if (err)
        res
          .status(400)
          .json({ error: "Invalid request, something went wrong!", err });
      res.status(201).json(user);
    });
  } catch (e) {
    res.status(401).json({ error: "Unauthorized action!" });
  }
};

exports.update = (req, res) => {
  try {
    let { id, username, password, role, email } = req.body;
    Users.findOneAndUpdate(
      { _id: id },
      { $set: { username, password, role, email } },
      { new: true },
      (err, user) => {
        if (err)
          res.status(400).json({ success: false, error: "Can't update user!" });
        res.json({ data: user });
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
      Users.deleteOne({ _id }, (err) => {
        if (err)
          res.status(400).json({ success: false, error: "Can't remove user!" });
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
