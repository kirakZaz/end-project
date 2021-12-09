const express = require("express");
const router = express.Router();
const {
  userCreateValidation,
  checkDuplicateUsernameOrEmail,
  userDeleteValidation,
  userUpdateValidation,
} = require("../middleware/usersMiddleWare");

const controller = require("../controllers/users");

router.get("/", controller.findAll);

router.post(
  "/",
  [userCreateValidation, checkDuplicateUsernameOrEmail],
  controller.create
);

router.get("/:id", controller.findOne);

router.put(
  "/:id",
  [userUpdateValidation],
  controller.update
);

router.delete("/:id", userDeleteValidation, controller.delete);

module.exports = router;
