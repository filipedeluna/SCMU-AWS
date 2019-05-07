import * as Boom from 'boom';
import * as Joi from '@hapi/joi';

const LETTERS_RGX = /^([a-zA-ZùÙüÜäàáëèéïìíöòóüùúÄÀÁËÈÉÏÌÍÖÒÓÜÚñÑõãéèç\s]+)$/;
const TEXT_RGX = /^([a-zA-ZùÙüÜäàáëèéïìíöòóüùúÄÀÁËÈÉÏÌÍÖÒÓÜÚñÑõãéèç-,.\s]+)$/;

// General
export const id = id =>
  Joi.validate(id, Joi.number().integer().min(0).required())
  .catch(result => checkResult(result, 'Invalid id.'))

export const email = email =>
  Joi.validate(email, Joi.string().email().required())
  .catch(result => checkResult(result, 'Invalid email.'))

 export const ip = ip =>
  Joi.validate(ip, Joi.string().ip({ version: 'ipv4', cidr: 'forbidden' }).required())
  .catch(result => checkResult(result, 'Invalid ip address.'))

// Users
const userCreateSchema = Joi.object().keys({
  user_email:    Joi.string().email().max(30).required(),
  user_name:     Joi.string().min(3).max(30).regex(LETTERS_RGX).required(),
  user_birthday: Joi.date().iso().min('1900-01-01').max('now').required(),
  user_picture:  Joi.string().base64({ paddingRequired: false }).required(),
});

export const userCreate = user =>
  Joi.validate(user, userCreateSchema)
  .catch(result => checkResult(result, 'Invalid data for user creation.'))

// Staff
const staffCreateSchema = Joi.object().keys({
  staff_email:    Joi.string().email().max(30).required(),
  staff_name:     Joi.string().min(3).max(30).regex(LETTERS_RGX).required(),
  staff_password: Joi.string().min(3).max(20).required(),
  staff_type:     Joi.number().integer().min(0).max(2).required(),
});

export const staffCreate = staff =>
  Joi.validate(staff, staffCreateSchema)
  .catch(result => checkResult(result, 'Invalid data for staff creation.'))

// Events
const eventCreateSchema = Joi.object().keys({
  event_name:        Joi.string().min(3).max(40).regex(LETTERS_RGX).required(),
  event_description: Joi.string().min(0).max(200).regex(TEXT_RGX).required(),
  event_date:        Joi.date().iso().min('now').required(),
  event_tickets:     Joi.number().integer().min(1).max(999999).required(),
  event_price:       Joi.number().min(0).max(999999).required(),
  event_min_age:     Joi.number().integer().min(0).max(120).required(),
  event_picture:     Joi.string().base64({ paddingRequired: false }).required(),
});

export const eventCreate = event =>
  Joi.validate(event, eventCreateSchema)
  .catch(result => checkResult(result, 'Invalid data for event creation.'))

// Cards
export const cardId = cardId =>
  Joi.validate(cardId, Joi.number().integer().min(10000000).max(99999999).required())
  .catch(result => checkResult(result, 'Invalid card id.'))

  
// Controllers
export const controllerId = cardId =>
Joi.validate(cardId, Joi.number().integer().min(10000).max(99999).required())
.catch(result => checkResult(result, 'Invalid controller id.'))

// Utils
const checkResult = (result, errorMessage) => {
  if (result.error !== null)
    throw Boom.badData(errorMessage, { data: result.details }) 
  }
