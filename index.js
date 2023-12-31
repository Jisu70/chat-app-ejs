// external imports
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
// const loginRouter = require("./router/loginRouter");
// const usersRouter = require("./router/usersRouter");
// const inboxRouter = require("./router/inboxRouter");
// DB connection
const dbConnect = require('./utils/dbConnect.js')
// internal imports
const {
  notFoundHandler,
  errorHandler,
} = require("./middlewares/common/errorHandler.js");

const app = express();
dotenv.config();



// request parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set view engine
app.set("view engine", "ejs");

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// parse cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

// routing setup
// app.use("/", loginRouter);
// app.use("/users", usersRouter);
// app.use("/inbox", inboxRouter);

// 404 not found handler
app.use(notFoundHandler);

// common error handler
app.use(errorHandler);
// dbConnect()
app.listen(process.env.PORT, () => {
  console.log(`app listening to port ${process.env.PORT}`);
});