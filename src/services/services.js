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

const defaultOptions = {
  new: true,
  includeResultMetaData: true
};

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

export const deleteContact = async (id) => { 
    const data = await contacts.findOneAndDelete({ _id: id });
    return data;
}