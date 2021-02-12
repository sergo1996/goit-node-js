//Core
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
//Middleware
const cors = require('cors');
require('dotenv').config();
const fileStorage = require('../middleware/fileStorage');
//Routes
const authRouter = require('../api/auth/auth.router');
const userRouter = require('../api/users/user.router');
const contactRouter = require('../api/contacts/contact.router');
//Utils
const accessLogStream = require('../utils/accessLogStream');

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
		return this.startListening();
	}

	//Server init
	initServer() {
		this.server = express();
	}

	//Middleware init
	initMiddleware() {
		this.server.use(express.static('public'));
		this.server.use(fileStorage.single('avatar'));
		this.server.use(express.json());
		this.server.use(morgan('combined', { stream: accessLogStream }));
		this.server.use(cors({ origin: 'http://localhost:3000' }));
	}

	//Routes init
	initRoutes() {
		this.server.use('/api/auth', authRouter);
		this.server.use('/api/users', userRouter);
		this.server.use('/api/contacts', contactRouter);
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
		return this.server.listen(this.port, () => {
			console.log('Server started listening on port', this.port);
		});
	}
}

module.exports = ContactsServer;
