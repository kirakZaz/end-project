const Messages = require("../models/messages");
const validator = require("validator");
const mongoose = require("mongoose");

exports.findAll = (req, res) => {
  try {
    Messages.find({}, (err, messages) => {
      if (err)
        res
          .status(400)
          .json({ error: "Invalid request, something went wrong!" });
      if (!messages) res.status(401).json({ error: "Unauthorized action!" });
      res.json(messages);
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

    Messages.find({ _id }, (err, messages) => {
      if (err)
        res
          .status(400)
          .json({ error: "Invalid request, something went wrong!" });
      if (!messages) res.status(401).json({ error: "Unauthorized action!" });
      res.json(messages[0]);
    });
  } catch (e) {
    res.status(401).json({ error: "Unauthorized action!" });
  }
};

exports.create = (req, res) => {
  try {
    let { email, message, username } = req.body;
    let _id = mongoose.Types.ObjectId();

    Messages.create({ _id, email, message, username }, (err, user) => {
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
    let { id, email, message } = req.body;
    Messages.findOneAndUpdate(
      { _id: id },
      { $set: { email, message } },
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
      Messages.deleteOne({ _id }, (err) => {
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
