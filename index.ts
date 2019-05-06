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
// Get all users or specific user by email
app.get('/users', (req, res) => 
  db.tx(t => {
    if (req.query.email)
      return SV.getUserByEmail(t, req.query.email)
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
  )
  .then(() => res.send("User created."))
  .catch((err) => Utils.errorHandler(err, res))
)

// Get by id
app.get('/users/:userId', (req, res) => 
  db.tx(t => 
    SV.getUserById(t, req.params.userId)
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
// Get all staff or specific staff by email
app.get('/staff', (req, res) => 
  db.tx(t => {
    if (req.query.email)
      return SV.getStaffId(t, req.query.email)
      .then(data => res.send(data))
    else
      return SV.selectAllFromTable(t, DBTables.STAFF)
      .then(data => res.send(data))
  })
  .catch((err) => Utils.errorHandler(err, res))
)

// Get staff info
app.get('/staff/:staffId', (req, res) => 
  db.tx(t => 
    SV.getStaff(t, req.params.staffId)
    .then(data => res.send(data))
  )
  .catch((err) => Utils.errorHandler(err, res))
)

// Create staff
app.post('/staff', jsonParser, (req, res) => 
  db.tx(t => 
    SV.createNewStaff(t, req.body)
    .then(() => res.send('Staff created'))
  )
  .catch((err) => Utils.errorHandler(err, res))
)

/*
    CARDS 
*/ 
// Get all cards
app.get('/cards', (req, res) => 
  db.tx(t => 
    SV.selectAllFromTable(t, DBTables.CARDS)
    .then(data => res.send(data))
  )
  .catch((err) => Utils.errorHandler(err, res))
)

// Create card
app.post('/cards', jsonParser, (req, res) => 
  db.tx(t => 
    SV.addCard(t, req.body.cardId, req.body.userId)
    .then(() => res.send('Card created'))
  )
  .catch((err) => Utils.errorHandler(err, res))
)

// Get card owner
app.get('/cards/:cardId/user', (req, res) => 
  db.tx(t => 
    SV.getCardOwner(t, req.params.cardId)
    .then(data => res.send(data))
  )
  .catch((err) => Utils.errorHandler(err, res))
)

// Get all user cards
app.get('/cards/user/:userId', (req, res) => 
  db.tx(t => 
    SV.getUserCards(t, req.params.userId)
    .then(data => res.send(data))
  )
  .catch((err) => Utils.errorHandler(err, res))
)

/*
    TICKETS 
*/
// Get all tickets
app.get('/tickets', (req, res) => 
  db.tx(t => 
    SV.selectAllFromTable(t, DBTables.TICKETS)
    .then(data => res.send(data))
  )
  .catch((err) => Utils.errorHandler(err, res))
)

// Add ticket to card
app.post('/tickets', (req, res) => 
  db.tx(t => 
    SV.addTicketToCard(t, req.body.cardId, req.body.eventId)
    .then(() => res.send('Ticket added to card.'))
  )
  .catch((err) => Utils.errorHandler(err, res))
)

// Get all tickets by card id
app.get('/tickets/card/:cardId', (req, res) => 
  db.tx(t => 
    SV.getAllTicketsByCardId(t, req.params.cardId)
    .then(data => res.send(data))
  )
  .catch((err) => Utils.errorHandler(err, res))
)

// Get all event by card id
app.get('/tickets/event/:eventId', (req, res) => 
  db.tx(t => 
    SV.getAllTicketsByEventId(t, req.params.eventId)
    .then(data => res.send(data))
  )
  .catch((err) => Utils.errorHandler(err, res))
)

// Check ticket is used
app.get('/tickets/:cardId/:eventId', (req, res) => 
  db.tx(t => 
    SV.checkTicketUsed(t, req.params.cardId, req.params.eventId)
    .then(data => res.send(data))
  )
  .catch((err) => Utils.errorHandler(err, res))
)

// Set ticket as used
app.patch('/tickets', (req, res) => 
  db.tx(t => 
    SV.checkTicketUsed(t, req.body.cardId, req.body.eventId)
    .then(data => res.send(data))
  )
  .catch((err) => Utils.errorHandler(err, res))
)

/*
    EVENTS 
*/ 
// Get all events
app.get('/events', (req, res) => 
  db.tx(t => 
    SV.selectAllFromTable(t, DBTables.EVENTS)
    .then(data => res.send(data))
  )
  .catch((err) => Utils.errorHandler(err, res))
)

// Get event by id
app.get('/events/:eventId', (req, res) =>
  db.tx(t => 
    SV.getEventById(t, req.body.eventId)
    .then(data => res.send(data))
  )
  .catch((err) => Utils.errorHandler(err, res))
)


/*
    ENTRIES 
*/ 
// Get all entries
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