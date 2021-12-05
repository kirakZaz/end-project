module.exports = (app) => {
  const token = require("../controllers/token.js");

  const router = require("express").Router();
  app.get("/api/tokens", token.findAll);
  // Create a new User
  router.post("/", token.create);

  // Retrieve all token
  router.get("/tokens", token.findAll);

  // Retrieve a single User with id
  router.get("/:id", token.findOne);

  // Update a User with id
  router.put("/:id", token.update);

  // Delete a User with id
  router.delete("/:id", token.delete);

  // Create a new User
  router.delete("/", token.deleteAll);

  app.use("/api/tokens", router);
};
