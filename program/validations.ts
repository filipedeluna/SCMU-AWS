import * as Boom from 'boom';
import * as Joi from '@hapi/joi';

// General
export const id = id =>
  Joi.validate(id, Joi.number().integer().min(0).required())
  .catch(result => checkResult(result, 'Invalid id.'))

export const email = email =>
  Joi.validate(email, Joi.string().email().required())
  .catch(result => checkResult(result, 'Invalid email.'))

// Users
const userCreateSchema = Joi.object().keys({
  user_email:    Joi.string().email().max(30).required(),
  user_name:     Joi.string().min(3).max(30).required(),
  user_birthday: Joi.date().iso().min('1900-01-01').max('now').required(),
  user_picture:  Joi.string().base64({ paddingRequired: false }).required(),
});

export const userCreate = user =>
  Joi.validate(user, userCreateSchema)
  .catch(result => checkResult(result, 'Invalid data for user creation.'))

// Staff
const staffCreateSchema = Joi.object().keys({
  staff_email:    Joi.string().email().max(30).required(),
  staff_name:     Joi.string().min(3).max(30).required(),
  staff_password: Joi.string().min(3).max(20).required(),
  staff_type:     Joi.number().integer().min(0).max(2),
});

export const staffCreate = staff =>
  Joi.validate(staff, staffCreateSchema)
  .catch(result => checkResult(result, 'Invalid data for staff creation.'))

// Cards
export const cardId = cardId =>
  Joi.validate(cardId, Joi.number().integer().min(10000000).max(99999999).required())
  .catch(result => checkResult(result, 'Invalid card id.'))

// Utils
const checkResult = (result, errorMessage) => {
  if (result.error !== null)
    throw Boom.badData(errorMessage, { data: result.details }) 
  }
