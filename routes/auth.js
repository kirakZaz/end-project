const { verifySignUp } = require("../middleware");
const controller = require("../controllers/login");

const express = require("express");
const router = express.Router();

router.post("/signin", controller.signin);

router.post(
  "/signup",
  [verifySignUp.checkDuplicateUsernameOrEmail],
  controller.signup
);

module.exports = router;
