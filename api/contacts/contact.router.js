//Core
const { Router } = require('express');
//Controller
const contactsController = require('./contact.controller');
//Helpers
const validators = require('../../helpers/validators');

const {
	listContacts,
	getContactById,
	addContact,
	removeContact,
	updateContact,
} = contactsController;

const {
	validateId,
	validateQueryParams,
	validateCreateContact,
	validateUpdateContact,
} = validators;

//Init router
const contactRouter = Router();

// @ GET /api/contacts (can be requested with next params: sub=free, page=1, limit=10)
contactRouter.get('/', validateQueryParams, listContacts);

// @ GET /api/contacts/:contactId
contactRouter.get('/:contactId', validateId, getContactById);

// @ POST /api/contacts
contactRouter.post('/', validateCreateContact, addContact);

// @ DELETE /api/contacts/:id
contactRouter.delete('/:id', validateId, removeContact);

// @ PATCH /api/contacts/:id
contactRouter.patch('/:id', validateId, validateUpdateContact, updateContact);

module.exports = contactRouter;
