// Import npm libs
import * as express from 'express';
import * as pgPromise from 'pg-promise';
import * as Promise from 'bluebird';
import * as Boom from 'boom';

// Import local files
import { DBOptions, PGPConfig } from './program/config';
import { 
  getAllUsers ,
  checkTableExists
} from './program/dbFunctions';

// Constants
const PORT = 8000

const app = express()
const pgp = pgPromise(PGPConfig);
const db = pgp(DBOptions);

// SERVER ROUTES
app.get('/', (req, res) => 
  res.send('Hello World!')
)

app.get('/users', (req, res) => 
  db.tx(t => 
    checkTableExists(t)
    .then(val => {
      if (val)
        return getAllUsers(t);
      else
        return Promise.reject();
    })
    .then(data => res.send(data))
  )
  .catch(() => res.json(Boom.badRequest("Table does not exist.")))
)

// Start service
app.listen(PORT, () => 
  console.log(`Example app listening on port ${PORT}!`)
)