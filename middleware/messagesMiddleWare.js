const { check } = require("express-validator");

exports.messageCreateValidation = [
  check("message", "Name is required")
    .not()
    .isEmpty()
    .isLength({ min: 1 })
    .withMessage("Name must have more than 35 characters"),
  check("email", "Please include a valid email")
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true })
    .not()
    .isEmpty(),
  check("username", "Name is required")
      .not()
      .isEmpty()
      .isLength({ min: 5 })
      .withMessage("Name must have more than 5 characters"),
];
