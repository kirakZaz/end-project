const { check } = require("express-validator");
const User = require("../models/users");
const Users = require("../models/users");

exports.userCreateValidation = [
  check("username", "Name is required")
    .not()
    .isEmpty()
    .isLength({ min: 5 })
    .withMessage("Name must have more than 5 characters"),
  check("email", "Please include a valid email")
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true })
    .not()
    .isEmpty(),
];

exports.checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  User.findOne({
    username: req.body.username,
  }).exec((err, user) => {
    if (err) {
      res.status(500).json({ message: err });
      return;
    }

    if (user) {
      res.status(400).json({ message: "Failed! Username is already in use!" });
      return;
    }

    // Email
    User.findOne({
      email: req.body.email,
    }).exec((err, user) => {
      if (err) {
        res.status(500).json({ message: err });
        return;
      }

      if (user) {
        res.status(400).json({ message: "Failed! Email is already in use!" });
        return;
      }
      next();
    });
  });
};

exports.userUpdateValidation = (req, res, next) => {
  // Username
  Users.find({}, (err, users) => {
    if (err) {
      res.status(400).json({ error: "Invalid request, something went wrong!" });
    }

    User.findOne({
      _id: req.body.id,
    }).exec((err, user) => {
      if (err) {
        res.status(500).json({ message: err });
        return;
      }
      const userExist = users.find(
        (userExist) => userExist.username === req.body.username
      );

      if (
        user.username !== req.body.username &&
        !!userExist &&
        userExist.username === req.body.username
      ) {
        res
          .status(400)
          .json({ message: "Failed!!! Username is already in use!" });
        return;
      }

      // Email
      User.findOne({
        _id: req.body.id,
      }).exec((err, user) => {
        if (err) {
          res.status(500).json({ message: err });
          return;
        }

        if (
          user.email !== req.body.email &&
          !!userExist &&
          userExist.email === req.body.email
        ) {
          res
            .status(400)
            .json({ message: "Failed!!! Email is already in use!" });
          return;
        }
        next();
      });
    });
  });
};

exports.userDeleteValidation = (req, res, next) => {
  // Username
  User.findOne({
    _id: req.params.id,
  }).exec((err, user) => {
    if (err) {
      res.status(500).json({ message: err });
      return;
    }

    if (!user) {
      res.status(400).json({ message: "Failed! User is not define!" });
      return;
    }
    next();
  });
};
