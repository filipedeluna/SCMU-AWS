import * as Utils from "./utils";
import * as Boom from 'boom';

/*
    GENERAL FUNCTIONS 
*/ 

const checkTableExists = (t, table: DBTables) =>
  t.one('SELECT * FROM information_schema.tables WHERE table_name = $1', table)
  .catch(e => { throw Boom.badRequest(`Table ${table} does not exist.`, { data: e }); })

export const selectAll = (t, table: DBTables) =>
  t.any(`SELECT * FROM ${table}`) 

export const checkAllTablesExist = t =>
  checkTableExists(t, DBTables.USERS)
  .then(() => checkTableExists(t, DBTables.CARDS))
  .then(() => checkTableExists(t, DBTables.STAFF))
  .then(() => checkTableExists(t, DBTables.EVENTS))
  .then(() => checkTableExists(t, DBTables.TICKETS))
  .then(() => checkTableExists(t, DBTables.ENTRIES))

/*
    USERS
*/ 

export const addUser = (t, user: IInsertUser) =>
  t.none(`
    INSERT INTO users 
    (user_email, user_name, user_birthday, user_picture)
    VALUES
    ($1, $2, $3, $4)`,
    [user.user_email, user.user_name, user.user_birthday, user.user_picture]
  ) 
  .catch(e => { throw Boom.badRequest('Error inserting user.', { data: e }); })

export const getUserByEmail = (t, email: string) =>
  t.one('SELECT user_id, user_name, user_birthday FROM users WHERE user_email = $1', email) 
  .catch(e => { throw Boom.notFound('User not found.', { data: e }) })

export const getUserById = (t, userId: string) =>
  t.one('SELECT user_email, user_name, user_birthday FROM users WHERE user_id = $1', userId) 
  .catch(e => { throw Boom.notFound('User not found.', { data: e }) })

export const checkUserExists = (t, userId: string) => getUserById(t, userId)

export const getUserPicturebyId = (t, userId: string) =>
  t.one('SELECT user_picture FROM users WHERE user_id = $1', userId) 
  .catch(e => { throw Boom.notFound('User not found.', { data: e }) })

export const checkUserOldEnough = (t, userId, minAge) =>
  t.one(`
    SELECT * FROM users WHERE user_id = $1 
    AND DATE_PART('year',AGE(user_birthday)) <= $2`, [userId, minAge]) 
  .catch(e => { throw Boom.forbidden('User not old enough.', { data: e }) })


/*
    STAFF
*/ 

export const getStaffByEmail = (t, email: string) =>
  t.one('SELECT staff_id, staff_name, staff_password, staff_type FROM staff WHERE staff_email = $1', email) 
  .catch(e => { throw Boom.notFound('Staff not found.', { data: e }) })

export const getStaffbyId = (t, staffId: string) =>
  t.one('SELECT staff_email, staff_name, staff_password, staff_type FROM staff WHERE staff_id = $1', staffId) 
  .catch(e => { throw Boom.notFound('Staff not found.', { data: e }) })

export const addStaff = (t, user: IInsertStaff) =>
  t.none(`
    INSERT INTO staff 
    (staff_email, staff_name, staff_password, staff_type)
    VALUES
    ($1, $2, $3, $4)`,
    [user.staff_email, user.staff_name, user.staff_password, user.staff_type]
  ) 
  .catch(e => { throw Boom.badRequest('Error inserting staff.', { data: e }); })

/*
    CARDS
*/ 

export const addCard = (t, cardId, userId) =>
  t.none(`
    INSERT INTO cards 
    (card_id, user_id_ref)
    VALUES
    ($1, $2)`,
    [cardId, userId]
  ) 
  .catch(e => { throw Boom.badRequest('Error creating card.', { data: e }); })

export const getCardsByUserId = (t, userId) =>
  t.any('SELECT card_id FROM cards WHERE user_id_ref = $1', userId) 
  .catch(e => { throw Boom.badRequest('Error getting user cards.', { data: e }); })

export const getCardOwnerByCardId = (t, cardId) =>
  t.one('SELECT user_id_ref FROM cards WHERE card_id = $1', cardId) 
  .catch(e => { throw Boom.notFound('Card not found.', { data: e }); })

export const checkCardExists = (t, cardId) => getCardOwnerByCardId(t, cardId)

/*
    TICKETS
*/ 

export const checkTicketsLeft = (t, eventId) =>
  t.one(`
    SELECT 
      (SELECT COUNT(*) FROM tickets WHERE event_id_ref = $1) < 
      (SELECT event_tickets FROM events WHERE event_id_ref = $1)
    AS value`,
    [eventId]
  )
  .then(res => {
    if (!res.value)
      throw Boom.forbidden('No tickets left for event.'); 
  })
  .catch(e => { throw Boom.badRequest('Error checking tickets left for event.', { data: e }); })

export const checkTicketAlreadyBought = (t, cardId, eventId) =>
  t.none('SELECT * FROM tickets WHERE card_id_ref = $1 AND event_id_ref = $2',
    [cardId, eventId]
  )
  .catch(e => { throw Boom.forbidden('Ticket already bought.', { data: e }); })

export const addTicket = (t, cardId, eventId) =>
  t.none(`
    INSERT INTO tickets 
    (card_id_ref, event_id_ref)
    VALUES
    ($1, $2)`,
    [cardId, eventId]
  ) 
  .catch(e => { throw Boom.badRequest('Error adding ticket to card.', { data: e }); })

export const getAllTicketsByCardId = (t, cardId) =>
  t.any('SELECT event_id_ref, ticket_used FROM tickets WHERE card_id_ref = $1', cardId)
  .catch(e => { throw Boom.badRequest('Error getting tickets by cardId.', { data: e }); })

export const getAllTicketsByEventId = (t, eventId) =>
  t.any('SELECT card_id_ref, ticket_used FROM tickets WHERE eventId_id_ref = $1', eventId)
  .catch(e => { throw Boom.badRequest('Error getting tickets by eventId.', { data: e }); })

export const checkTicketUsed = (t, cardId, eventId) =>
  t.one('SELECT ticket_used FROM tickets WHERE cardId_id_ref = $1 AND eventId_id_ref = $2', [cardId, eventId])
  .then(result => result.ticket_used)
  .catch(e => { throw Boom.notFound('Ticket not found.', { data: e }); })

export const setTicketAsUsed = (t, cardId, eventId) =>
  checkTicketUsed(t, cardId, eventId)
  .then(result => { 
    if (result)
      throw Boom.forbidden('Ticket was already used.');
  })
  .then(() => t.one(`
    UPDATE tickets SET ticket_used = TRUE 
    WHERE cardId_id_ref = $1 AND eventId_id_ref = $2`, 
    [cardId, eventId])
  )
  .catch(e => { throw Boom.notFound('Error setting ticket as used.', { data: e }); })

/*
    EVENTS
*/ 

export const getEventById = (t, eventId) =>
  t.one(`
    SELECT event_name, event_description, event_date, event_tickets, event_price, event_min_age 
    FROM events WHERE event_id = $1`, eventId
  )
  .catch(e => { throw Boom.notFound('Event not found.', { data: e }); })

export const checkEventExists = (t, eventId) => getEventById(t, eventId)

export const addEvent = (t, event: IInsertEvent) =>
  t.none(`
    INSERT INTO events 
    (event_name, event_description, event_date, 
      event_tickets, event_price, event_min_age)
    VALUES
    ($1, $2, $3, $4, $5, $6)`,
    [event.event_name, event.event_description, event.event_date,
      event.event_tickets, event.event_price, event.event_min_age]
  ) 
  .catch(e => { throw Boom.badRequest('Error registering entry.', { data: e }); })

export const getEventPicturebyId = (t, eventId: string) =>
  t.one('SELECT event_picture FROM users WHERE event_id = $1', eventId) 
  .catch(e => { throw Boom.notFound('Event not found.', { data: e }) })

/*
    ENTRIES
*/ 

export const getEntriesByEventId = (t, eventId) =>
  t.one(`
    SELECT entry_id, card_id_ref, entry_date, entry_valid
    FROM events WHERE event_id_ref = $1`, eventId
  )
  .catch(e => { throw Boom.notFound('Event not found.', { data: e }); })

export const getEntriesByCardtId = (t, cardId) =>
  t.one(`
    SELECT entry_id, event_id_ref, entry_date, entry_valid
    FROM events WHERE card_id_ref = $1`, cardId
  )
  .catch(e => { throw Boom.notFound('Event not found.', { data: e }); })

export const getEntriesByEventAndCardId = (t, eventId, cardId) =>
  t.one(`
    SELECT entry_id, entry_date, entry_valid
    FROM events WHERE card_id_ref = $1 AND card_id_ref = $2`, [eventId, cardId]
  )
  .catch(e => { throw Boom.notFound('Event not found.', { data: e }); })

export const checkEntryValid = (t, eventId, cardId) =>
  t.none(`SELECT * FROM events WHERE card_id_ref = $1 AND card_id_ref = $2`, [eventId, cardId])
  .then(() => 
    t.one(`SELECT * FROM tickets WHERE card_id_ref = $1 AND card_id_ref = $2 AND ticket_used IS FALSE`, 
    [eventId, cardId])
  )
  .then(() => true)
  .catch(() => false)

export const addEntry = (t, cardId, eventId, status) =>
  t.none(`
    INSERT INTO entries 
    (card_id_ref, event_id_ref, entry_date, entry_valid)
    VALUES
    ($1, $2, NOW(), $3)`,
    [cardId, eventId, status]
  ) 
  .catch(e => { throw Boom.badRequest('Error registering entry.', { data: e }); })

/*
    CONNECTIONS
*/ 

/*
    ENUMS 
*/ 

export enum DBTables {
  USERS    = 'users',
  STAFF    = 'staff',
  CARDS    = 'cards',
  TICKETS  = 'tickets',
  EVENTS   = 'events',
  ENTRIES  = 'entries'
}

/*
    INTERFACES 
*/ 

interface IInsertUser {
  user_email:    string,
  user_name:     string,
  user_birthday: string,
  user_picture:  string
} 

interface IInsertStaff {
  staff_email:    string,
  staff_name:     string,
  staff_password: string,
  staff_type:     string
}

interface IInsertEvent {
  event_name:        string,
  event_description: string,
  event_date:        string,
  event_tickets:     string
  event_price:       string
  event_min_age:     string
  event_picture:     string
}