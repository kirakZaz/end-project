const http = require("http");
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");

const db = require("./models");

const mongoRouter = require("./routes");

const swaggerDocument = require("./config/swagger.json");

const dotenv = require("dotenv");
dotenv.config();
require("dotenv").config();

const hostname = process.env.DB_HOST;
const port = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);

function main() {
  app.use(logger("dev"));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use(
    "/swagger",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, { explorer: true })
  );

  app.set("view engine", "html");

  app.use(express.static(__dirname + "/views"));

  app.use("/api/", mongoRouter);

  app.get("/", function (request, response) {
    response.sendFile(__dirname + "/views/registration.html");
  });
  // app.get("/signin", function (request, response) {
  //   response.sendFile(__dirname + "/server/views/login.html");
  // });
  // app.get("/users", function (request, response) {
  //   response.sendFile(__dirname + "/server/views/users.html");
  // });
  // app.get("/tokens", function (request, response) {
  //   response.sendFile(__dirname + "/server/views/tokens.html");
  // });
  db.mongoose
    .connect(db.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to the database!");
      server.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
      });
    })
    .catch((err) => {
      console.log("Cannot connect to the database!", err);
      process.exit();
    });
}

main();
