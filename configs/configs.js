module.exports = {
	subscriptionEnum: ['free', 'pro', 'premium'],

	users: {
		userPassLengthMin: 6,
		userPassLengthMax: 20,
		userSubscription: this.subscriptionEnum,
	},

	contacts: {
		nameLengthMin: 3,
		nameLengthMax: 30,
		passLengthMin: 6,
		passLengthMax: 20,
		phonePattern: /^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/,
	},

	queryParams: {
		pageNumberMin: 1,
		limitNumberMin: 20,
		paramsSubscription: this.subscriptionEnum,
	},
};
