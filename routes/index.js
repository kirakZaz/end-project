const router = require("express").Router();

router.use("/user", require("./user"));
router.use("/tokens", require("./tokens"));
router.use("/auth", require("./auth"));

module.exports = router;
