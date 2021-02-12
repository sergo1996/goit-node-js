//Core
const {
	Types: { ObjectId },
} = require('mongoose');
//Models
const userModel = require('../api/users/user.model');
//Validate
const Joi = require('joi');
//Configs
const configs = require('../configs/configs');
//Crypt
const jwt = require('jsonwebtoken');

const { pageNumberMin, limitNumberMin, paramsSubscription } = configs.queryParams;
const { userPassLengthMin, userPassLengthMax, userSubscription } = configs.users;
const {
	nameLengthMin,
	nameLengthMax,
	passLengthMin,
	passLengthMax,
	phonePattern,
} = configs.contacts;

//The middleware validate to register user
function validateSignUpUser(req, res, next) {
	const createRegisterRules = Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().min(userPassLengthMin).max(userPassLengthMax).required(),
	});

	const validatedRegister = createRegisterRules.validate(req.body);

	if (validatedRegister.error) {
		const message = validatedRegister.error.details[0].message;

		return res.status(400).json({ message });
	}

	next();
}

//The middleware validate to login user
function validateSignInUser(req, res, next) {
	const createLoginRules = Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().min(userPassLengthMin).max(userPassLengthMax).required(),
	});

	const validatedLogin = createLoginRules.validate(req.body);

	if (validatedLogin.error) {
		const message = validatedLogin.error.details[0].message;

		return res.status(400).json({ message });
	}

	next();
}

//The middleware validate user token
async function validateUserToken(req, res, next) {
	try {
		const authorizationHeader = req.get('Authorization') || '';
		const token = authorizationHeader.replace('Bearer ', '');

		try {
			const userId = await jwt.verify(token, process.env.JWT_SECRET_KEY).userId;
			const user = await userModel.findById(userId);

			if (!user || user.token !== token) {
				return res.status(401).json({ message: 'Not authorized' });
			}

			req.user = user;

			next();
		} catch (err) {
			return res.status(401).json({ message: 'Not authorized' });
		}
	} catch (err) {
		next(err);
	}
}

//The middleware validate query params (each of the parameters is optional)
function validateQueryParams(req, res, next) {
	const createQueryRules = Joi.object({
		page: Joi.number().min(pageNumberMin).default(pageNumberMin),
		limit: Joi.number().min(limitNumberMin).default(limitNumberMin),
		sub: Joi.string().valid(...paramsSubscription),
	});

	const validatedQueryParams = createQueryRules.validate(req.query);

	if (validatedQueryParams.error) {
		const message = validatedQueryParams.error.details[0].message;

		return res.status(400).json({ message });
	}

	req.query = validatedQueryParams.value;

	next();
}

//The middleware validate user subscription
function validateSub(req, res, next) {
	const { subscription } = req.body;

	if (!userSubscription.includes(subscription)) {
		return res.status(400).send({ message: 'invalid subscription' });
	}

	next();
}

//The middleware validate id
function validateId(req, res, next) {
	const { id } = req.params;

	if (!ObjectId.isValid(id)) {
		return res.status(400).send({ message: 'invalid id' });
	}

	next();
}

//The middleware validate contact credential (create)
function validateCreateContact(req, res, next) {
	const createContactRules = Joi.object({
		name: Joi.string().min(nameLengthMin).max(nameLengthMax).required(),
		email: Joi.string().email().required(),
		phone: Joi.string().pattern(phonePattern).required(),
		subscription: Joi.string().required(),
		password: Joi.string().min(passLengthMin).max(passLengthMax).required(),
	});

	const validatedContact = createContactRules.validate(req.body);

	if (validatedContact.error) {
		return res.status(400).send({ message: 'missing required name field' });
	}

	next();
}

//The middleware validate contact credential (update)
function validateUpdateContact(req, res, next) {
	const updateContactRules = Joi.object({
		name: Joi.string().min(nameLengthMin).max(nameLengthMax),
		email: Joi.string().email(),
		phone: Joi.string().pattern(phonePattern),
		subscription: Joi.string(),
		password: Joi.string().min(passLengthMin).max(passLengthMax),
	}).min(1);

	const validatedContact = updateContactRules.validate(req.body);

	if (validatedContact.error) {
		return res.status(400).send({ message: 'missing fields' });
	}

	next();
}

module.exports = {
	validateSignUpUser,
	validateSignInUser,
	validateUserToken,
	validateQueryParams,
	validateSub,
	validateId,
	validateCreateContact,
	validateUpdateContact,
};
