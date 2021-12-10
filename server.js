const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const express = require("express");

require("dotenv").config({ path: ".env" });

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const logger = require("morgan");

const db = require("./models");
const mongoRouter = require("./routes");

const swaggerDocument = require("./config/swagger.json");

const hostname = process.env.DB_HOST;
const port = process.env.PORT || 5000;

function main() {
  server.use(logger("dev"));
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: false }));

  server.use(
    "/swagger",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, { explorer: true })
  );

  server.set("view engine", "html");

  server.use(express.static(__dirname + "/views"));

  server.use("/api/", mongoRouter);

  io.on("connection", function (socket) {
    socket.on("stream", function (image) {
      socket.broadcast.emit("stream", image);
    });
  });

  io.on("connection", function (socket) {
    socket.on("msg", function (data) {
      //Send message to everyone
      io.sockets.emit("newmsg", data);
    });
  });

  server.get("/index.html", function (request, response) {
    response.sendFile(__dirname + "/views/index.html");
  });

  server.get("/main", function (request, response) {
    response.sendFile(__dirname + "/views/main.html");
  });

  server.get("/users", function (request, response) {
    response.sendFile(__dirname + "/views/users.html");
  });

  server.get("/favicon.ico", (req, res) => res.status(204));

  db.mongoose
    .connect(db.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to the database!");
      http.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
      });
    })
    .catch((err) => {
      console.log("Cannot connect to the database!", err);
      process.exit();
    });
}

main();
