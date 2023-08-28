require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const { logEvents, logger } = require("./middleware/logEvents");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const errorHandler = require("./middleware/errorHandler");
const verifyjwt = require("./middleware/verifyjwt");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const PORT = process.env.PORT || 3500;

// connect to database
connectDB();

// custom middleware logger
app.use(logger);

app.use(credentials);

app.use(cors(corsOptions));

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

// custom middleware for cookies
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "css")));

app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

// Verify JWT
app.use(verifyjwt);
app.use("/employees", require("./routes/api/employees"));

app.all("/*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "Not Found" });
  } else {
    res.type("txt").send("Not Found");
  }
});

// custom middleware error handler
app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to database");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

