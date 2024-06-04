import { contacts } from "../db/contacts.js";

export const getContacts = async () => {
    const contacts = await contacts.find();
    return contacts;
}

export const getContactById = async (id) => {
    const contact = await contacts.findById(id);
    return contact;
}