import * as Boom from 'boom';
import * as Joi from '@hapi/joi';

// General
export const id = id =>
  Joi.validate(id, Joi.number().integer().min(0))
  .catch(result => checkResult(result, `Invalid id.`))

export const email = email =>
  Joi.validate(email, Joi.string().email())
  .catch(result => checkResult(result, `Invalid email.`))

// Users
const userCreateSchema = Joi.object().keys({
  user_email:    Joi.string().email().max(30).required(),
  user_name:     Joi.string().min(3).max(30).required(),
  user_birthday: Joi.date().iso().min('1950-01-01').max('now').required(),
  user_picture:  Joi.string().base64().required(),
});

export const userCreate = user =>
  Joi.validate(user, userCreateSchema)
  .catch(result => checkResult(result, `Invalid data for user creation.`))

// Staff
const staffCreateSchema = Joi.object().keys({
  staff_email:    Joi.string().email().max(30).required(),
  staff_name:     Joi.string().min(3).max(30).required(),
  staff_password: Joi.string().min(3).max(20).required(),
  staff_type:     Joi.number().integer().min(0).max(2),
});

export const staffCreate = staff =>
  Joi.validate(staff, staffCreateSchema)
  .catch(result => checkResult(result, `Invalid data for staff creation.`))

// Utils
const checkResult = (result, errorMessage) => {
  if (result.error !== null)
    throw Boom.badData(errorMessage, { data: result.details }) 
  }
