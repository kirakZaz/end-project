const Users = require("../models/users");
const Message = require("../models/messages");

const Token = require("../models/tokens");
const validator = require("validator");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

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

    const errors = validationResult(req);
    if (errors) {
      console.log("errors", errors);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    }

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

exports.update = async (req, res) => {
  try {
    let { id, username, email } = req.body;

    Users.find({}, async (err, users) => {
      const userExist = users.find(
        (user) => user._id.toString() === id.toString()
      );

      if (!userExist) {
        console.log("No user found!");
        return;
      }

      Message.find({}, (err, res) => {
        res.forEach((message) => {
          if (message.email === userExist.email) {
            Message.findOneAndUpdate(
              { _id: message._id },
              {
                $set: {
                  email,
                  message,
                  username,
                },
              },
              (err, response) => {
                console.log("response", response);
              }
            );
          }
        });
      });

      Token.find({}, (err, res) => {
        res.forEach((token) => {
          if (token.email === userExist.email) {
            Message.findOneAndUpdate(
              { _id: token._id },
              {
                $set: {
                  email: email,
                  message: "ertertert",
                  username: username,
                },
              },
              (err, response) => {
                console.log("response", response);
              }
            );
          }
        });
      });

      let doc1 = await Users.findOneAndUpdate(
        { _id: id },
        { $set: { username, password: userExist.password, email } },
        { new: true },
        (err, user) => {
          if (err) {
            res
              .status(400)
              .json({ success: false, error: "Can't update user!" });
          }
          res.json({ data: user });
        }
      );

      console.log("doc1", doc1);
    });
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
