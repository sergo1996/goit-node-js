//Models
const userModel = require('../users/user.model');
//Crypt
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//Helpers
const generateAvatar = require('../../helpers/avatarGenerator');
const imageCompressor = require('../../helpers/imageCompressor');

//Gets user credential from the request, checks email, create password hash, create a new user and return it
async function singUpUser(req, res, next) {
	try {
		const { email, password } = req.body;

		const existedUser = await userModel.findOne({ email });

		if (existedUser) {
			return res.status(409).json({ message: 'Email in use' });
		}

		const encryptedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND));
		const userAvatar = await generateAvatar(next);
		await imageCompressor(userAvatar);

		const user = await userModel.create({
			email,
			password: encryptedPassword,
			avatarURL: process.env.AVATAR_URL + userAvatar,
		});

		const response = {
			user: { email, subscription: user.subscription, avatarURL: user.avatarURL },
		};

		return res.status(201).json(response);
	} catch (error) {
		next(error);
	}
}

//Gets user credential from the request, checks it, creates token, and return the user with the token.
async function signInUser(req, res, next) {
	try {
		const { email, password } = req.body;

		const user = await userModel.findOne({ email });

		if (!user) {
			return res.status(401).json({ message: 'Email or password is wrong' });
		}

		const isUserPasswordCorrect = await bcrypt.compare(password, user.password);

		if (!isUserPasswordCorrect) {
			return res.status(401).json({ message: 'Email or password is wrong' });
		}

		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
			expiresIn: '24h',
		});

		await userModel.findByIdAndUpdate(user._id, { token }, { new: true });

		const { subscription, avatarURL } = user;
		const response = { token, user: { email, subscription, avatarURL } };

		return res.status(200).json(response);
	} catch (error) {
		next(error);
	}
}

//Gets the userID from the request and resets the user token. Returns status 204
async function signOutUser(req, res, next) {
	try {
		await userModel.findByIdAndUpdate(req.user._id, { token: '' });

		return res.status(204).send();
	} catch (error) {
		next(error);
	}
}

module.exports = {
	singUpUser,
	signInUser,
	signOutUser,
};
