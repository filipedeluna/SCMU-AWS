import * as Utils from "./utils";
import * as Boom from 'boom';

/*
    GENERAL FUNCTIONS 
*/ 

export const checkTableExists = (t, table: DBTables) =>
  t.one('SELECT * FROM information_schema.tables WHERE table_name = $1', table)
  .catch(e => { throw Boom.badRequest(`Table ${table} does not exist.`, { data: e }); })

export const selectAll = (t, table: DBTables) =>
  t.any(`SELECT * FROM ${table}`) 

/*
    USERS
*/ 

export const addUser = (t, user: IInsertUser) =>
  t.one(`
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

export const getUserPicturebyId = (t, userId: string) =>
  t.one('SELECT user_picture FROM users WHERE user_id = $1', userId) 
  .catch(e => { throw Boom.notFound('User not found.', { data: e }) })

/*
    STAFF
*/ 

export const getStaffIdByEmail = (t, email: string) =>
  t.one('SELECT staff_id, staff_name, staff_password, staff_type FROM staff WHERE staff_email = $1', email) 
  .catch(e => { throw Boom.notFound('Staff not found.', { data: e }) })

export const getStaffbyId = (t, staffId: string) =>
  t.one('SELECT staff_email, staff_name, staff_password, staff_type FROM staff WHERE staff_id = $1', staffId) 
  .catch(e => { throw Boom.notFound('Staff not found.', { data: e }) })

export const addStaff = (t, user: IInsertStaff) =>
  t.one(`
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
  t.one(`
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
  t.one(`
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
    FROM events WHERE eventId = $1`, eventId
  )
  .catch(e => { throw Boom.notFound('Event not found.', { data: e }); })

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