//Core
const { Schema, model } = require('mongoose');
//Configs
const configs = require('../../configs/configs');

const { subscriptionEnum } = configs.users;

const userSchema = new Schema({
	email: { type: String, required: true },
	password: { type: String, required: true },
	avatarURL: { type: String, required: false },
	subscription: {
		type: String,
		enum: subscriptionEnum,
		required: false,
		default: 'free',
	},
	token: { type: String, required: false },
});

module.exports = model('User', userSchema);
