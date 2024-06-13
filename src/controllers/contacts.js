import mongoose from 'mongoose';
import {
  createContact,
  deleteContact,
  getContacts,
  getContactById,
  upsertContact,
} from '../services/services.js';
import createHttpError from 'http-errors';

export const getContactsController = async (req, res, next) => {
  try {
    const contacts = await getContacts();
    res.status(200).json({
      status: res.statusCode,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return res.status(404).json({
      message: 'Not found',
    });
  }

  try {
    const contact = await getContactById(contactId);

    if (!contact) {
      next(createHttpError(404, `Contact with id ${contactId} not found!`));
      return;
    }

    res.status(200).json({
      status: res.statusCode,
      message: `Successfully found contact with id: ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const createContactController = async (req, res, next) => {
  try {
    console.log('Request body:', req.body); 
    const contact = await createContact(req.body);
    res.status(201).json({
      status: 201,
      message: `Successfully created a contact!`,
      data: contact,
    });
  } catch (error) {
    console.error('Error creating contact:', error); 
    res.status(500).json({
      status: 500,
      message: 'Something went wrong',
      error: error.message,
    });
  }
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await upsertContact(contactId, req.body);

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: result.contact,
  });
};



export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return res.status(404).json({
      message: 'Not found',
    });
  }

  try {
    const contact = await deleteContact(contactId);

    if (!contact) {
      next(createHttpError(404, 'Contact not found'));
      return;
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully deleted the contact!',
    });
  } catch (error) {
    next(error);
  }
};
