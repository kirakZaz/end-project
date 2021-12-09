const { check } = require("express-validator");
const Token = require("../models/tokens");

exports.tokenCreateValidation = [
  check("token", "Name is required")
    .not()
    .isEmpty()
    .isLength({ min: 35 })
    .withMessage("Name must have more than 35 characters"),
  check("email", "Please include a valid email")
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true })
    .not()
    .isEmpty(),
];

exports.tokenUpdateValidation = (req, res, next) => {
  // Username
  Token.find({}, (err, tokens) => {
    if (err) {
      res.status(400).json({ error: "Invalid request, something went wrong!" });
    }

    Token.findOne({
      _id: req.body.id,
    }).exec((err, token) => {
      if (err) {
        res.status(500).json({ message: err });
        return;
      }
      const tokenExist = tokens.find(
        (userExist) => userExist.token === req.body.token
      );

      if(token.token !== req.body.token && !!tokenExist && tokenExist.token === req.body.token){
        res
            .status(400)
            .json({ message: "Failed!!! Token is already in use!" });
        return;
      }
        next();
      });
  });
};

exports.tokenDeleteValidation = (req, res, next) => {
  // Username
  Token.findOne({
    _id: req.body._id,
  }).exec((err, token) => {
    if (err) {
      res.status(500).json({ message: err });
      return;
    }

    if (!token) {
      res.status(400).json({ message: "Failed! Token is not define!" });
      return;
    }
    next();
  });
};
