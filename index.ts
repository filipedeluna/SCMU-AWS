// Import npm libs
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as pgPromise from 'pg-promise';
import * as Promise from 'bluebird';
import * as Boom from 'boom';

// Import local files
import { 
  DBOptions, 
  PGPConfig 
} from './program/config';

import * as Utils from './program/utils';

import { 
  DBTables,
} from './program/dbFunctions';

import * as SV from './program/serverFunctions';

// Constants
const PORT: number = 8000

const app = express()
const pgp = pgPromise(PGPConfig);
const db = pgp(DBOptions);

const jsonParser = bodyParser.json({ limit: '1mb' });

// SERVER ROUTES
app.get('/', (req, res) => 
  res.send('Hello World!')
)

/*
    USERS 
*/
// Get all users or specific user
app.get('/users', (req, res) => 
  db.tx(t => {
    if (req.query.email)
      return SV.getUserId(t, req.query.email)
      .then(data => res.send(data))
    else
      return SV.selectAllFromTable(t, DBTables.USERS)
      .then(data => res.send(data))
  })
  .catch((err) => Utils.errorHandler(err, res))
)

// Create user
app.post('/users', jsonParser, (req, res) => 
  db.tx(t => 
    SV.createNewUser(t, req.body)
    .then(data => res.send(data))
  )
  .catch((err) => Utils.errorHandler(err, res))
)

// Get user info
app.get('/users/:userId', (req, res) => 
  db.tx(t => 
    SV.getUser(t, req.params.userId)
    .then(data => res.send(data))
  )
  .catch((err) => Utils.errorHandler(err, res))
)

// Get user picture
app.get('/users/:userId/picture', (req, res) => 
  db.tx(t => {
    res.type('jpg');
    return SV.getUserPicture(t, req.params.userId)
    .then(data => res.send(data))
  })
  .catch((err) => Utils.errorHandler(err, res))
)

/*
    STAFF 
*/
app.get('/staff', (req, res) => 
  db.tx(t => 
    SV.selectAllFromTable(t, DBTables.STAFF)
    .then(data => res.send(data))
  )
  .catch((err) => Utils.errorHandler(err, res))
)

/*
    CARDS 
*/ 
app.get('/cards', (req, res) => 
  db.tx(t => 
    SV.selectAllFromTable(t, DBTables.CARDS)
    .then(data => res.send(data))
  )
  .catch((err) => Utils.errorHandler(err, res))
)

/*
    TICKETS 
*/
app.get('/tickets', (req, res) => 
  db.tx(t => 
    SV.selectAllFromTable(t, DBTables.TICKETS)
    .then(data => res.send(data))
  )
  .catch((err) => Utils.errorHandler(err, res))
)

/*
    EVENTS 
*/ 
app.get('/events', (req, res) => 
  db.tx(t => 
    SV.selectAllFromTable(t, DBTables.EVENTS)
    .then(data => res.send(data))
  )
  .catch((err) => Utils.errorHandler(err, res))
)

/*
    ENTRIES 
*/ 
app.get('/entries', (req, res) => 
  db.tx(t => 
    SV.selectAllFromTable(t, DBTables.ENTRIES)
    .then(data => res.send(data))
  )
  .catch((err) => Utils.errorHandler(err, res))
)

// Start service
app.listen(PORT, () => 
  console.log(`SCMU APP listening on port ${PORT}!`)
)