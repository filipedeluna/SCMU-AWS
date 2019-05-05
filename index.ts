// Import npm libs
import * as express from 'express';
import * as pgPromise from 'pg-promise';
import * as Promise from 'bluebird';
import * as Boom from 'boom';

// Import local files
import { DBOptions, PGPConfig } from './program/config';
import { 
  DBTables,
} from './program/dbFunctions';

import {
  selectAllFromTable
} from './program/serverFunctions'

// Constants
const PORT:number = 8000

const app = express()
const pgp = pgPromise(PGPConfig);
const db = pgp(DBOptions);

// SERVER ROUTES
app.get('/', (req, res) => 
  res.send('Hello World!')
)

// USERS 
app.get('/users', (req, res) => 
  db.tx(t => 
    selectAllFromTable(t, DBTables.USERS)
    .then(data => res.send(data))
  )
  .catch(() => res.json(Boom.badRequest(`Table ${DBTables.USERS} does not exist.`)))
)

// STAFF 
app.get('/staff', (req, res) => 
  db.tx(t => 
    selectAllFromTable(t, DBTables.STAFF)
    .then(data => res.send(data))
  )
  .catch(() => res.json(Boom.badRequest(`Table ${DBTables.STAFF} does not exist.`)))
)

// CARDS 
app.get('/cards', (req, res) => 
  db.tx(t => 
    selectAllFromTable(t, DBTables.CARDS)
    .then(data => res.send(data))
  )
  .catch(() => res.json(Boom.badRequest(`Table ${DBTables.CARDS} does not exist.`)))
)

// TICKETS 
app.get('/tickets', (req, res) => 
  db.tx(t => 
    selectAllFromTable(t, DBTables.TICKETS)
    .then(data => res.send(data))
  )
  .catch(() => res.json(Boom.badRequest(`Table ${DBTables.TICKETS} does not exist.`)))
)

// EVENTS 
app.get('/events', (req, res) => 
  db.tx(t => 
    selectAllFromTable(t, DBTables.EVENTS)
    .then(data => res.send(data))
  )
  .catch(() => res.json(Boom.badRequest(`Table ${DBTables.EVENTS} does not exist.`)))
)

// ENTRIES 
app.get('/entries', (req, res) => 
  db.tx(t => 
    selectAllFromTable(t, DBTables.ENTRIES)
    .then(data => res.send(data))
  )
  .catch(() => res.json(Boom.badRequest(`Table ${DBTables.ENTRIES} does not exist.`)))
)

// Start service
app.listen(PORT, () => 
  console.log(`Example app listening on port ${PORT}!`)
)