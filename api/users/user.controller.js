//Core
const path = require('path');
const fsPromises = require('fs/promises');
//Model
const userModel = require('./user.model');
//Helpers
const imageCompressor = require('../../helpers/imageCompressor');

//Gets user credential from request and returns the current user
async function getCurrentUser(req, res, next) {
	try {
		const { email, subscription, avatarURL } = req.user;

		return res.status(200).json({ email, subscription, avatarURL });
	} catch (error) {
		next(error);
	}
}

//Gets the type of subscription from the request body and returns updated user with a new subscription
async function updateUserSubscription(req, res, next) {
	try {
		const {
			body: { subscription },
			user: { _id },
		} = req;

		const updatedUser = await userModel.findByIdAndUpdate(_id, { subscription }, { new: true });
		const response = { email: updatedUser.email, subscription: updatedUser.subscription };

		return res.status(200).json(response);
	} catch (error) {
		next(error);
	}
}

//Gets an image file from the request file and returns updated user's avatarURL
async function updateUserAvatar(req, res, next) {
	try {
		const {
			file: { filename },
			user: { _id, avatarURL },
		} = req;

		const oldAvatar = path.parse(avatarURL).base;
		await fsPromises.unlink(process.env.TARGET_DIR + oldAvatar);

		await imageCompressor(filename);

		const newAvatar = process.env.AVATAR_URL + filename;
		const updatedUser = await userModel.findByIdAndUpdate(
			_id,
			{ $set: { avatarURL: newAvatar } },
			{ new: true },
		);

		const response = { avatarURL: updatedUser.avatarURL };

		return res.status(200).json(response);
	} catch (error) {
		next(error);
	}
}

module.exports = {
	getCurrentUser,
	updateUserSubscription,
	updateUserAvatar,
};
