const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

const dotenv = require("dotenv");
dotenv.config();

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "./uploads")));

app.use(express.static(path.join(__dirname, "./public")));

app.use(express.static(path.join(__dirname, "assets")));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(cors());
app.use(bodyParser.json({ extended: true, limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// Sequelize- DB
const sequelize = require("./services/sequelize.service")();
let connect = sequelize.connect();

// Passport Initialization
require("./services/passport.service").initialize();

//Associations
require("./models/associations/associations")();

//Configurations
const config = require("./config/env");


if (process.env.GENERATE_API_LOG == "true") {
  app.use(function (req, res, next) {
    console.log("before");
    const before_time = new Date().getTime();

    let old = res.json.bind(res);
    res.json = (body) => {
      //Do whatever
      old(body);

      console.log("after");
      const after_time = new Date().getTime();

      request_log(req, {
        status_code: res.statusCode,
        error_response: body,
        before_time: before_time,
        after_time: after_time,
      });
    };
    next();
  });
}

// Routers
app.use("/api", require("./config/path").include(express.Router()));

app.get("*", (req, res) =>
  res.json({ error: "No route found for this GET request" })
);
app.post("*", (req, res) =>
  res.json({ error: "No route found for this POST request" })
);
sequelize
  .sequel()
  .authenticate()
  .then(() => {
    console.log("Alter : ", process.env.SEQUELIZE_ALTER);
    return sequelize
      .sequel()
      .sync({ alter: process.env.SEQUELIZE_ALTER == "true" ? true : false });
  })
  .then(() => {
    return app.listen(config.server.port, () => {
      console.log(`Server is running on http://localhost:${config.server.port}/api`);
      if(connect)
        console.log("DATABASE CONNECTED SECCESSFULLY :)");
    });
  })
  .catch(console.error);


