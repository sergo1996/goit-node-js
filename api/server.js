//Core
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
//Middleware
const cors = require('cors');
require('dotenv').config();
//Routes
const contactRouter = require('./contacts/contact.router');
const userRouter = require('./users/user.router');

class ContactsServer {
	//Initial server
	constructor() {
		this.server = null;
		this.port = 3001;
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
		this.server.use(morgan('combined'));
		this.server.use(cors({ origin: 'http://localhost:3000' }));
	}

	//Routes init
	initRoutes() {
		this.server.use('/api/auth', userRouter);
		this.server.use('/api/contacts', contactRouter);
		this.server.use('/api/users', userRouter);
	}

	//MongoDB init
	async initDatabase() {
		try {
			await mongoose.connect(process.env.MONGODB_URL, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
				useFindAndModify: false,
			});

			console.log('Database connection successful');
		} catch (error) {
			console.log(`MongoDB error: ${error.message}`);
			process.exit(1);
		}
	}

	//Start listening on port 3001
	startListening() {
		this.server.listen(this.port, () => {
			console.log('Server started listening on port', this.port);
		});
	}
}

module.exports = ContactsServer;
