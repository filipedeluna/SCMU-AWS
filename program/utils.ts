import * as Boom from 'boom';

// UTILS
export const checkDate = (date: string) => {
  if (!date.match(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/))
    throw Boom.badRequest(`Invalid date format, use YYYY-MM-DD.`); 
  return date;
}

export const checkTimestamp = (timestamp: number) => {
  if (timestamp < 1000000000 || timestamp > 2000000000)
    throw Boom.badRequest(`Invalid date timestamp, use an int between 1000000000 and 2000000000.`); 
}

export const errorHandler = (err, res) => {
  if (Boom.isBoom(err))
    res.status(err.output.statusCode).send(err.output.payload.message);
  else {
    console.log(err);
    res.sendStatus(500);
  }
}
