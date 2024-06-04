import { contacts } from "../db/contacts.js";

export const getContacts = async () => {
    const data = await contacts.find();
    return data;
}

export const getContactById = async (id) => {
    const data = await contacts.findById(id);
    return data;
}