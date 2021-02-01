//Core
const { Schema, model } = require('mongoose');

const userSchema = new Schema({
	email: { type: String, required: true },
	password: { type: String, required: true },
	subscription: {
		type: String,
		enum: ['free', 'pro', 'premium'],
		required: false,
		default: 'free',
	},
	token: { type: String, required: false },
});

module.exports = model('User', userSchema);
