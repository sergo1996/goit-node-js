//Core
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
//Middleware
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
//Routes
const contactRouter = require("./contacts/contacts.router");

class ContactsServer {
  //Initial server
  constructor() {
    this.server = null;
    // this.port =  3001;
    this.port = process.env.PORT || 3001;
  }

  //Server start
  async start() {
    this.initServer();
    this.initMiddleware();
    this.initRoutes();
    await this.initDatabase();
    this.startListening();
  }

  //Server init
  initServer() {
    this.server = express();
  }

  //Middleware init
  initMiddleware() {
    this.server.use(express.json());
    this.server.use(morgan("combined"));
    this.server.use(cors({ origin: "http://localhost:3000" }));
  }

  //Routes init
  initRoutes() {
    this.server.use("/api/contacts", contactRouter);
  }

  //MongoDB init
  async initDatabase() {
    try {
      await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      });

      console.log("Database connection successful");
    } catch (error) {
      console.log(`MongoDB error: ${error.message}`);
      process.exit(1);
    }
  }

  //Start listening on port 3001
  startListening() {
    this.server.listen(this.port, () => {
      console.log("Server started listening on port", this.port);
    });
  }
}

module.exports = ContactsServer;
