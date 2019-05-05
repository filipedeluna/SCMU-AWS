import * as Boom from 'boom';

const fs = require('fs').promises;

export const errorHandler = (err, res) => {
  if (Boom.isBoom(err)) {
    console.error("BOOM ERROR----------------------");
    console.error(err.output.payload.message + '\n\n' + JSON.stringify(err.data));
    res.status(err.output.statusCode).send(err.output.payload.message + '\n\n' + JSON.stringify(err.data));
  } else {
    console.error("SERVER ERROR--------------------");
    console.error(err);
    res.status(500).send(err);
  }
  console.error("---------------------------------");
}

export const writePictureToFile = (filename: string, pictureData) => {
  const fixedPictureData = pictureData.split(';base64,').pop();
  const buffer = Buffer.from(fixedPictureData, 'base64');
  
  return fs.writeFile(filename, buffer)
  .catch(e => { throw Boom.badData('Failed to save picture.', { data: e }); })
}

export const readPictureFromFile = (filename: string) =>
  fs.readFile(filename)
  .catch(e => { throw Boom.notFound('Failed to get picture.', { data: e }); })