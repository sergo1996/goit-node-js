const fsPromises = require("fs/promises");
const path = require("path");

const contactsPath = path.join(__dirname, "db/contacts.json");

async function listContacts() {
  try {
    const data = await fsPromises.readFile(contactsPath, "utf-8");
    const parsedData = JSON.parse(data);

    console.table(parsedData);
  } catch (error) {
    console.error(error);
  }
}

async function getContactById(contactId) {
  try {
    const data = await fsPromises.readFile(contactsPath, "utf-8");
    const parsedData = JSON.parse(data);

    const contact = parsedData.find((element) => element.id === contactId);
    console.table(contact);
  } catch (error) {
    console.error(error);
  }
}

async function removeContact(contactId) {
  try {
    const data = await fsPromises.readFile(contactsPath, "utf-8");

    const updatedData = Object.values(JSON.parse(data)).filter(
      (delid) => delid.id !== contactId
    );
    const stringifyUpdatedData = JSON.stringify(updatedData);

    await fsPromises.writeFile(contactsPath, stringifyUpdatedData, "utf-8");

    console.log("The contact has been removed!");
  } catch (error) {
    console.error(error);
  }
}

async function addContact(name, email, phone) {
  try {
    const data = await fsPromises.readFile(contactsPath, "utf-8");

    const updatedData = JSON.parse(data);
    const contactAdd = { name, email, phone };
    const pushNewContact = { ...updatedData, contactAdd };

    const stringifyUpdatedData = JSON.stringify(pushNewContact);

    await fsPromises.writeFile(contactsPath, stringifyUpdatedData, "utf-8");

    console.log("The contact has been added!");
  } catch (error) {
    console.error(error);
  }
}

module.exports = { listContacts, getContactById, removeContact, addContact };
