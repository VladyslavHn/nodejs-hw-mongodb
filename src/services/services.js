import { contacts } from "../db/contacts.js";

export const getContacts = async () => {
    const data = await contacts.find();
    return data;
}

export const getContactById = async (id) => {
    const data = await contacts.findById(id);
    return data;
}

export const createContact = async (payload) => {
    const data = await contacts.create(payload);
    return data;
}

export const upsertContact = async (id, payload) => {
    const rawResult = await contacts.findOneAndUpdate(
        { _id: id },
        payload,
        {
            new: true,
            includeResultMetaData: true,
            ...options
        },
    );

    if (!rawResult || rawResult.value) return null;

    return {
        contact: rawResult.value,
        isNew: Boolean(rawResult?.lastErrorObject?.upsert)
    }
}

export const deleteContact = async (id) => { 
    const data = await contacts.findOneAndDelete({ _id: id });
    return data;
}