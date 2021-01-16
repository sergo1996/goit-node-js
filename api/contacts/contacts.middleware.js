//Validation package
const Joi = require("joi");

//The middleware validate contact credential (create)
function validateCreateContact(req, res, next) {
  const createContactRules = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
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
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string(),
  });

  const validatedContact = updateContactRules.validate(req.body);

  if (validatedContact.error) {
    return res.status(400).send({ message: "missing fields" });
  }

  next();
}

module.exports = { validateCreateContact, validateUpdateContact };
