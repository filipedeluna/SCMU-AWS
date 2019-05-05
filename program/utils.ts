import * as Boom from 'boom';

const fs = require('fs').promises;

export const checkDate = (date: string) => {
  if (date == undefined || !date.match(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/))
    throw Boom.badRequest(`Invalid date format, use YYYY-MM-DD.`); 
  return date;
}

export const checkTimestamp = (timestamp: number) => {
  if (timestamp < 1000000000 || timestamp > 2000000000)
    throw Boom.badRequest(`Invalid date timestamp, use an int between 1000000000 and 2000000000.`); 
}

export const errorHandler = (err, res) => {


  if (Boom.isBoom(err)) {
    console.error("BOOM ERROR----------------------");
    res.status(err.output.statusCode).send(err.output.payload.message);
    } else {
    console.error("SERVER ERROR--------------------");
    res.sendStatus(500);
  }
  console.error(err);
  console.error("---------------------------------");
}

export const writePictureToFile = (filename: string, pictureData) => {
  const fixedPictureData = pictureData.split(';base64,').pop();
  const buffer = Buffer.from(fixedPictureData, 'base64');
  
  return fs.writeFile(filename, buffer)
  .catch(( )=> { throw Boom.badData('Failed to save picture.'); })
}

export const readPictureFromFile = (filename: string) =>
  fs.readFile(filename /*, 'base64' */)
  //.then(data => `data:image/jpeg;base64, ${data}`)
  .catch(()=> { throw Boom.notFound('Failed to get picture.'); })