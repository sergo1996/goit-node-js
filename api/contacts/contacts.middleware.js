//Validation package
const Joi = require("joi");
//Mongoose validation ObjID
const {
  Types: { ObjectId },
} = require("mongoose");

//The middleware validate contact credential (create)
function validateCreateContact(req, res, next) {
  const createContactRules = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.string()
      .pattern(/^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/)
      .required(),
    subscription: Joi.string().required(),
    password: Joi.string().min(6).max(20).required(),
    token: Joi.string().token(),
  });

  const validatedContact = createContactRules.validate(req.body);

  if (validatedContact.error) {
    return res.status(400).send({ message: "missing required name field" });
  }

  next();
}

//The middleware validate contact credential (update)
function validateUpdateContact(req, res, next) {
  const updateContactRules = Joi.object({
    name: Joi.string().min(3).max(30),
    email: Joi.string().email(),
    phone: Joi.string().pattern(/^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/),
    subscription: Joi.string(),
    password: Joi.string().min(6).max(20),
  }).min(1);

  const validatedContact = updateContactRules.validate(req.body);

  if (validatedContact.error) {
    return res.status(400).send({ message: "missing fields" });
  }

  next();
}

//The middleware validate contact id (read, delete, update)
function validateContactID(req, res, next) {
  const { contactId } = req.params;

  if (!ObjectId.isValid(contactId)) {
    return res.status(400).send({ message: "invalid id" });
  }

  next();
}

module.exports = {
  validateCreateContact,
  validateUpdateContact,
  validateContactID,
};
