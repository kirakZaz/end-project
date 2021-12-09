const express = require("express");
const router = express.Router();
const { tokenDeleteValidation, tokenCreateValidation, tokenUpdateValidation } = require('../middleware/tokensMiddleWare');

const controller = require("../controllers/tokens");

router.get("/", controller.findAll);

router.post("/", tokenCreateValidation, controller.create);

router.get("/:id", controller.findOne);

router.put("/:id", tokenUpdateValidation, controller.update);

router.delete("/:id", controller.delete);

module.exports = router;
