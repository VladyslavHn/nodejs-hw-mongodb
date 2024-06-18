import { contacts } from "../db/contacts.js";
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

export const getContacts = async ({
  page,
  perPage,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
}) => {
  try {
    const limit = perPage;
    const skip = (page - 1) * perPage;
    const contactsQuery = contacts.find();
    
    console.log('Contacts query:', contactsQuery);
    console.log('Skip:', skip, 'Limit:', limit, 'Sort by:', sortBy, 'Sort order:', sortOrder);

    const [contactsCount, contactsList] = await Promise.all([
      contacts.find().merge(contactsQuery).countDocuments(),
      contactsQuery
        .skip(skip)
        .limit(limit)
        .sort({ [sortBy]: sortOrder })
        .exec(),
    ]);

    const paginationData = calculatePaginationData(contactsCount, perPage, page);

    console.log('Contacts count:', contactsCount, 'Contacts list:', contactsList);

    return {
      data: contactsList,
      ...paginationData,
    };
  } catch (error) {
    console.error('Error in getContacts:', error);
    throw error;
  }
};



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