//Model
const contactModel = require("./contacts.model");

//Read: return contacts list
async function listContacts(req, res, next) {
  try {
    const contacts = await contactModel.find();

    return res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
}

//Read: return contact by id
async function getContactById(req, res, next) {
  try {
    const { contactId } = req.params;
    const contact = await contactModel.findOne({ _id: contactId });

    !contact
      ? res.status(404).json({ message: "Not found" })
      : res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
}

//Create: receive contact data and return created contact with id
async function addContact(req, res, next) {
  try {
    const createdContact = await contactModel.create(req.body);

    return res.status(201).json(createdContact);
  } catch (error) {
    next(error);
  }
}

//Delete: remove contact by id
async function removeContact(req, res, next) {
  try {
    const { contactId } = req.params;
    const removedContact = await contactModel.findByIdAndDelete(contactId);

    !removedContact
      ? res.status(404).json({ message: "Not found" })
      : res.status(200).json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
}

//Update: update contact information by id
async function updateContact(req, res, next) {
  try {
    const { contactId } = req.params;
    const updatedContact = await contactModel.findByIdAndUpdate(
      contactId,
      { $set: req.body },
      { new: true }
    );

    !updatedContact
      ? res.status(404).json({ message: "Not found" })
      : res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listContacts,
  addContact,
  removeContact,
  getContactById,
  updateContact,
};
