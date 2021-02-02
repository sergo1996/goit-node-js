//Core
const { Schema, model } = require('mongoose');

const contactSchema = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true },
	phone: { type: String, required: true },
	subscription: { type: String, required: true },
	password: { type: String, required: true },
	token: String,
});

module.exports = model('Contact', contactSchema);
