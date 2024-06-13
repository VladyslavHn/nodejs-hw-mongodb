import { contacts } from "../db/contacts.js";

export const getContacts = async () => {
    const data = await contacts.find();
    return data;
}

export const getContactById = async (contactId) => {
    const data = await contacts.findById(contactId);
    return data;
}

export const createContact = async (payload) => {
    const data = await contacts.create(payload);
    return data;
}



export const upsertContact = async (contactId, payload, options = {}) => {
  const rawResult = await contacts.findOneAndUpdate(
    { _id: contactId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const deleteContact = async (contactId) => { 
    const data = await contacts.findOneAndDelete({ _id: contactId });
    return data;
}