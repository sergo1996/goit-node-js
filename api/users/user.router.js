//Core
const { Router } = require('express');
//Controller
const userController = require('./user.controller');
//Helpers
const validators = require('../../helpers/validators');

const { getCurrentUser, updateUserSubscription, updateUserAvatar } = userController;
const { validateId, validateUserToken, validateSub } = validators;

const userRouter = Router();

// @ GET /api/users/current
userRouter.get('/current', validateUserToken, getCurrentUser);

// @ GET /api/users/avatars
userRouter.patch('/avatars', validateUserToken, updateUserAvatar);

// @ PATCH /api/users/:id
userRouter.patch('/:id', validateId, validateUserToken, validateSub, updateUserSubscription);

module.exports = userRouter;
