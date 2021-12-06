const express = require("express");
const router = express.Router();

const controller = require("../controllers/users");

router.get("/", controller.findAll);

router.post("/", controller.create);

router.get("/:id", controller.findOne);

router.put("/:id", controller.update);

router.delete("/:id", controller.delete);

module.exports = router;
