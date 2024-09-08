// external imports
const express = require("express");
const { createServer } = require("node:http");
require("dotenv").config()
const path = require("node:path");
const cookieParser = require("cookie-parser");
const loginRouter = require("./routers/loginRouter.js");
const usersRouter = require("./routers/usersRouter.js");
const inboxRouter = require("./routers/inboxRouter.js");
const { Server } = require("socket.io");
// DB connection
const dbConnect = require('./utils/dbConnect.js')
// internal imports
const {
  notFoundHandler,
  errorHandler,
} = require("./middlewares/common/errorHandler.js");
 
const app = express();
const server = createServer(app);

// socket creation
const io = new Server(server);
global.io = io; // Make socket available in all files
dbConnect() // database connection

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
app.use("/", loginRouter);
app.use("/users", usersRouter);
app.use("/inbox", inboxRouter);

// Error handling middlewares
app.use(notFoundHandler);// 404 not found handler
app.use(errorHandler);// common error handler

// event handling
io.on('connection', (socket) => {
  socket.on('join_room', ({ conversation_id }) => {
      socket.join(conversation_id);
  });

  socket.on('leave_room', ({ conversation_id }) => {
      socket.leave(conversation_id);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`app listening to port ${process.env.PORT}`);
});