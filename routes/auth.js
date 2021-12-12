const { verifySignUp } = require("../middleware");
const controller = require("../controllers/login");

const express = require("express");
const router = express.Router();

router.post("/signin", verifySignUp.verifyToken, controller.signin);

router.post(
  "/signup",
  [verifySignUp.checkDuplicateUsernameOrEmail],
  controller.signup
);

router.get("/logout", controller.logout);

module.exports = router;
