//Core
const express = require("express");
const morgan = require("morgan");
//Middleware
const cors = require("cors");
//Routes
const contactRouter = require("./contacts/contacts.router");
// //Handle logs

class ContactsServer {
  //Initial server
  constructor() {
    this.server = null;
    this.port = 3000;
  }

  //Start server
  start() {
    this.initServer();
    this.initMiddleware();
    this.initRoutes();
    this.startListening();
  }

  //Init server
  initServer() {
    this.server = express();
  }

  //Init middleware
  initMiddleware() {
    this.server.use(express.json());
    this.server.use(morgan("combined"));
    this.server.use(cors({ origin: `http://localhost:${this.port}` }));
  }

  //Init routes
  initRoutes() {
    this.server.use("/api/contacts", contactRouter);
  }

  //Start listening on port 2000
  startListening() {
    this.server.listen(this.port, () => {
      console.log("Server started listening on port", this.port);
    });
  }
}

module.exports = ContactsServer;
