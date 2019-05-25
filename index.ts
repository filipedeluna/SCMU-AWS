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
const PORT: number = 8000;
const OK: number = 200;

const app = express()
const pgp = pgPromise(PGPConfig);
const db = pgp(DBOptions);

const jsonParser = bodyParser.json({ limit: '1mb' });

// SERVER ROUTES
app.get('/', (req, res) => res.send('SCMU APP is alive!'))

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

// Get user picture
app.get('/users/picture', (req, res) => 
  db.tx(t => {
    res.type('jpg');
    return SV.getUserPicture(t, req.query.email)
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
      return SV.getStaffByEmail(t, req.query.email)
      .then(data => res.send(data))
    else
      return SV.selectAllFromTable(t, DBTables.STAFF)
      .then(data => res.send(data))
  })
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
// Get all cards or specific cards by email
app.get('/cards', (req, res) => 
  db.tx(t => {
    if (req.query.email)
      return SV.getUserCardsByEmail(t, req.query.email)
      .then(data => res.send(data))
    else
      return SV.selectAllFromTable(t, DBTables.CARDS)
      .then(data => res.send(data))
  })
  .catch((err) => Utils.errorHandler(err, res))
)

// Create card
app.post('/cards', jsonParser, (req, res) => 
  db.tx(t => 
    SV.addCard(t, req.body.cardId, req.body.userEmail)
    .then(() => res.send('Card created'))
  )
  .catch((err) => Utils.errorHandler(err, res))
)

// Get card owner
app.get('/cards/:cardId', (req, res) => 
  db.tx(t => 
    SV.getCardOwner(t, req.params.cardId)
    .then(data => res.send(data))
  )
  .catch((err) => Utils.errorHandler(err, res))
)


// Create staff
app.delete('/cards', (req, res) => 
  db.tx(t => 
    SV.deleteAllCards(t)
    .then(() => res.send('Cards deleted'))
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
app.post('/tickets/buy', jsonParser, (req, res) => 
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

// Get all tickets by eventId
app.get('/tickets/event/:eventId', (req, res) => 
  db.tx(t => 
    SV.getAllTicketsByEventId(t, req.params.eventId)
    .then(data => res.send(data))
  )
  .catch((err) => Utils.errorHandler(err, res))
)

// Check ticket is used, use it and create an entry
app.post('/tickets/use', jsonParser, (req, res) => 
  db.tx(t => 
    SV.useTicket(t, req.body.cardId, req.body.eventId)
    .then(entryValid => {
      if (entryValid) 
        res.status(OK).send('Valid entry added.')
      else
        res.status(201).send('Invalid entry added.')
    })
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
    SV.getEventById(t, req.params.eventId)
    .then(data => res.send(data))
  )
  .catch((err) => Utils.errorHandler(err, res))
)

// Create Event
app.post('/events', jsonParser, (req, res) => 
  db.tx(t => 
    SV.createNewEvent(t, req.body)
  )
  .then(() => res.send("User created."))
  .catch((err) => Utils.errorHandler(err, res))
)

// Get event picture
app.get('/events/:eventId/picture', (req, res) =>
  db.tx(t => {    
    res.type('jpg');
    return SV.getEventPicture(t, req.params.eventId)
    .then(data => res.send(data))
  })
  .catch((err) => Utils.errorHandler(err, res))
)

// Get tickets left for event
app.get('/events/:eventId/tickets', (req, res) => 
  db.tx(t => 
    SV.getEventTicketsLeft(t, req.params.eventId)
  )
  .then(data => res.send(data))
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

// Get entries by card id
app.get('/entries/card/:cardId', (req, res) => 
  db.tx(t => 
    SV.getEntriesByCardId(t, req.params.cardId)
    .then(data => res.send(data))
  )
  .catch((err) => Utils.errorHandler(err, res))
)

// Get entries by event id
app.get('/entries/:eventId', (req, res) => 
  db.tx(t => 
    SV.getEntriesByEventId(t, req.params.eventId)
    .then(data => res.send(data))
  )
  .catch((err) => Utils.errorHandler(err, res))
)

// Get entries by event and card id
app.get('/entries/:eventId/:cardId', (req, res) => 
  db.tx(t => 
    SV.getEntriesByCardAndEventId(t, req.params.eventId, req.params.cardId)
    .then(data => res.send(data))
  )
  .catch((err) => Utils.errorHandler(err, res))
)

// Register entry
app.post('/entries', jsonParser, (req, res) => 
  db.tx(t => 
    SV.registerEntry(t, req.body.eventId, req.body.cardId)
    .then(entryValid => {
      if (entryValid) 
        res.status(OK).send('Valid entry added.')
      else
        res.status(201).send('Invalid entry added.')
    })
  )
  .catch((err) => Utils.errorHandler(err, res))
)

/*
    CONTROLLERS
*/ 
// Get all controllers
app.get('/controllers', (req, res) => 
  db.tx(t => 
    SV.selectAllFromTable(t, DBTables.CONTROLLERS)
    .then(data => res.send(data))
  )
  .catch((err) => Utils.errorHandler(err, res))
)

// Register controller
app.post('/controllers', jsonParser, (req, res) => 
  db.tx(t => 
    SV.registerController(t, req.body.controllerId)
    .then(() => res.send("Controller registered."))
  )
  .catch((err) => Utils.errorHandler(err, res))
)

/*
    CONNECTIONS 
*/ 
// Get all connections
app.get('/connections', (req, res) => 
  db.tx(t => 
    SV.selectAllFromTable(t, DBTables.CONNECTIONS)
    .then(data => res.send(data))
  )
  .catch((err) => Utils.errorHandler(err, res))
)

// Register connection
app.post('/connections', jsonParser, (req, res) => 
  db.tx(t => 
    SV.registerConnection(t, req.body.staffId, req.body.controllerId)
    .then(() => res.send("Connection registered."))
  )
  .catch((err) => Utils.errorHandler(err, res))
)

/*
    MESSAGES 
*/ 
// Get messages
app.get('/messages', (req, res) => 
  db.tx(t => {
    if (req.query.staff)
      return SV.getStaffMessages(t, req.query.staff, req.query.type)
      .then(data => res.send(data))
    else if (req.query.controller)
      return SV.getControllerMessages(t, req.query.controller, req.query.type)
      .then(data => res.send(data))
    else 
      if (req.query.type)
        return SV.getAllMessages(t, req.query.type)
        .then(data => res.send(data))
      else
        return SV.selectAllFromTable(t, DBTables.MESSAGES)
        .then(data => res.send(data))
  })
  .catch((err) => Utils.errorHandler(err, res))
)

// Send messages
app.post('/messages', jsonParser, (req, res) => 
  db.tx(t => {
    if (req.query.staff) {
      return SV.insertMessageAsStaff(t, req.query.staff, req.body)
      .then(data => res.send(data))
    } else if (req.query.controller) {
      return SV.insertMessageAsController(t, req.query.controller, req.body)
      .then(data => res.send(data))
    } else {
      return res.status(201).send('Not implemented, send staff or controller query param.')
    }
  })
  .catch((err) => Utils.errorHandler(err, res))
)

// Start service
app.listen(PORT, () => 
  console.log(`SCMU APP listening on port ${PORT}!`)
)