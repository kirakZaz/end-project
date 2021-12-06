const dotenv = require("dotenv");

const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const express = require("express");

const app = new express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

const logger = require("morgan");

const db = require("./models");
const mongoRouter = require("./routes");

const swaggerDocument = require("./config/swagger.json");

dotenv.config();
require("dotenv").config();

const hostname = process.env.DB_HOST;
const port = process.env.PORT || 5000;

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

  io.on("connection", function (socket) {
    socket.on("stream", function (image) {
      socket.broadcast.emit("stream", image);
    });
  });

  const users = [];
  io.on("connection", function (socket) {
    console.log("A user connected");
    // socket.on("setUsername", function (data) {
    //   if (users.indexOf(data) === -1) {
    //     users.push(data);
    //     socket.emit("userSet", { username: data });
    //   } else {
    //     socket.emit(
    //       "userExists",
    //       data + " username is taken! Try some other username."
    //     );
    //   }
    // });

    socket.on("msg", function (data) {
      //Send message to everyone
      io.sockets.emit("newmsg", data);
    });
  });

  app.get("/", function (request, response) {
    response.sendFile(__dirname + "/views/registration.html");
  });
  app.get("/main", function (request, response) {
    response.sendFile(__dirname + "/views/main.html");
  });
  app.get("/users", function (request, response) {
    response.sendFile(__dirname + "/views/users.html");
  });

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
