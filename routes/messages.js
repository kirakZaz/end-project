const express = require("express");
const router = express.Router();

const controller = require("../controllers/messages");
const { messageCreateValidation } = require('../middleware/messagesMiddleWare');

router.get("/", controller.findAll);

router.post("/", messageCreateValidation, controller.create);

// todo - right now in use only findAll and Create
router.get("/:id", controller.findOne);

router.put("/:id", controller.update);

router.delete("/:id", controller.delete);

module.exports = router;
