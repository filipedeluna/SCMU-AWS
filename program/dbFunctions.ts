import * as Utils from "./utils";
import * as Boom from 'boom';
import * as Promise from 'bluebird';
import { Connection } from "pg-promise/typescript/pg-subset";


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
  .then(() => checkTableExists(t, DBTables.CONNECTIONS))
  .then(() => checkTableExists(t, DBTables.CONTROLLERS))
  .then(() => checkTableExists(t, DBTables.MESSAGES))

/*
    USERS
*/ 

export const addUser = (t, user: IInsertUser) =>
  t.none(`
    INSERT INTO users 
    (user_email, user_name, user_birthday, user_picture)
    VALUES
    ($1, $2, $3, $4)`,
    [user.userEmail, user.userName, user.userBirthday, user.userPicture]
  ) 
  .catch(e => { throw Boom.badRequest('Error inserting user.', { data: e }); })

export const getUserByEmail = (t, email: string) =>
  t.one('SELECT user_id, user_name, user_birthday FROM users WHERE user_email = $1', email) 
  .catch(e => { throw Boom.notFound('User not found.', { data: e }) })

export const getUserIdByEmail = (t, email: string) =>
  getUserByEmail(t, email)  
  .then(result => result.user_id)  

export const getUserById = (t, userId: string) =>
  t.one('SELECT user_email, user_name, user_birthday FROM users WHERE user_id = $1', userId) 
  .catch(e => { throw Boom.notFound('User not found.', { data: e }) })

export const checkUserExists = (t, userId: string) => getUserById(t, userId)

export const getUserPicturebyId = (t, userId: string) =>
  t.one('SELECT user_picture FROM users WHERE user_id = $1', userId) 
  .catch(e => { throw Boom.notFound('User not found.', { data: e }) })

export const checkUserOldEnough = (t, userId: string, minAge: string) =>
  t.one(`
    SELECT * FROM users WHERE user_id = $1 
    AND DATE_PART('year',AGE(user_birthday)) <= $2`, [userId, minAge]) 
  .catch(e => { throw Boom.forbidden('User not old enough.', { data: e }) })

export const checkUserDoesNotExist = (t, email: string) =>
  t.none('SELECT * FROM users WHERE user_email = $1', email) 
  .catch(e => { throw Boom.conflict('User email already registered.', { data: e }) })


/*
    STAFF
*/ 

export const getStaffByEmail = (t, email: string) =>
  t.one('SELECT staff_id, staff_name, staff_password, staff_type FROM staff WHERE staff_email = $1', email) 
  .catch(e => { throw Boom.notFound('Staff not found.', { data: e }) })

export const getStaffIdByEmail = (t, email: string) =>
  getStaffByEmail(t, email)  
  .then(result => result.staff_id)  

export const getStaffbyId = (t, staffId: string) =>
  t.one('SELECT staff_email, staff_name, staff_password, staff_type FROM staff WHERE staff_id = $1', staffId) 
  .catch(e => { throw Boom.notFound('Staff not found.', { data: e }) })

export const addStaff = (t, user: IInsertStaff) =>
  t.none(`
    INSERT INTO staff 
    (staff_email, staff_name, staff_password, staff_type)
    VALUES
    ($1, $2, $3, $4)`,
    [user.staffEmail, user.staffName, user.staffPassword, user.staffType]
  ) 
  .catch(e => { throw Boom.badRequest('Error inserting staff.', { data: e }); })

  
export const checkStaffEmailNotRegistered = (t, email: string) =>
  t.none('SELECT * FROM staff WHERE staff_email = $1', email) 
  .catch(e => { throw Boom.conflict('Staff email already registered.', { data: e }) })

export const checkStaffExists = (t, staffId: string) =>
  t.one('SELECT * FROM staff WHERE staff_id = $1', staffId) 
  .catch(e => { throw Boom.notFound('Staff does not exist.', { data: e }) })

/*
    CARDS
*/ 

export const addCard = (t, cardId: string, userId: string) =>
  t.none(`
    INSERT INTO cards 
    (card_id, user_id_ref)
    VALUES
    ($1, $2)`,
    [cardId, userId]
  ) 
  .catch(e => { throw Boom.badRequest('Error creating card.', { data: e }); })

export const getCardsByUserId = (t, userId: string) =>
  t.any('SELECT card_id FROM cards WHERE user_id_ref = $1', userId) 
  .catch(e => { throw Boom.badRequest('Error getting user cards.', { data: e }); })

export const getCardOwnerByCardId = (t, cardId: string) =>
  t.one('SELECT user_id_ref FROM cards WHERE card_id = $1', cardId) 
  .catch(e => { throw Boom.notFound('Card not found.', { data: e }); })

export const checkCardExists = (t, cardId: string) => getCardOwnerByCardId(t, cardId)

/*
    TICKETS
*/ 

export const checkTicketsLeft = (t, eventId: string) =>
  t.one(`
    SELECT 
      (SELECT COUNT(*) FROM tickets WHERE event_id_ref = $1) < 
      (SELECT event_tickets FROM events WHERE event_id = $1)
    AS value`,
    [eventId]
  )
  .then(res => {
    if (!res.value)
      throw Boom.forbidden('No tickets left for event.'); 
  })
  .catch(e => { throw Boom.badRequest('Error checking tickets left for event.', { data: e }); })

export const checkTicketAlreadyBought = (t, cardId: string, eventId: string) =>
  t.none('SELECT * FROM tickets WHERE card_id_ref = $1 AND event_id_ref = $2',
    [cardId, eventId]
  )
  .catch(e => { throw Boom.forbidden('Ticket already bought.', { data: e }); })

export const addTicket = (t, cardId: string, eventId: string) =>
  t.none(`
    INSERT INTO tickets 
    (card_id_ref, event_id_ref)
    VALUES
    ($1, $2)`,
    [cardId, eventId]
  ) 
  .catch(e => { throw Boom.badRequest('Error adding ticket to card.', { data: e }); })

export const getAllTicketsByCardId = (t, cardId: string) =>
  t.any('SELECT event_id_ref, ticket_used FROM tickets WHERE card_id_ref = $1', cardId)
  .catch(e => { throw Boom.badRequest('Error getting tickets by cardId.', { data: e }); })

export const getAllTicketsByEventId = (t, eventId: string) =>
  t.any('SELECT card_id_ref, ticket_used FROM tickets WHERE eventId_id_ref = $1', eventId)
  .catch(e => { throw Boom.badRequest('Error getting tickets by eventId.', { data: e }); })

export const checkTicketUsed = (t, cardId: string, eventId: string) =>
  t.one('SELECT ticket_used FROM tickets WHERE cardId_id_ref = $1 AND eventId_id_ref = $2', [cardId, eventId])
  .then(result => result.ticket_used)
  .then(result => result == 'true' || result == 'TRUE' ? true : false)
  .catch(e => { throw Boom.notFound('Ticket not found.', { data: e }); })

export const setTicketAsUsed = (t, cardId: string, eventId: string) =>
  checkTicketUsed(t, cardId, eventId)
  .then(result => { 
    if (result)
      throw Boom.forbidden('Ticket was already used.');
  })
  .then(() => t.none(`
    UPDATE tickets SET ticket_used = TRUE 
    WHERE cardId_id_ref = $1 AND eventId_id_ref = $2`, 
    [cardId, eventId])
  )
  .catch(e => { throw Boom.notFound('Error setting ticket as used.', { data: e }); })

/*
    EVENTS
*/ 

export const getEventById = (t, eventId: string) =>
  t.one(`
    SELECT event_name, event_description, event_date, event_tickets, event_price, event_min_age 
    FROM events WHERE event_id = $1`, eventId
  )
  .catch(e => { throw Boom.notFound('Event not found.', { data: e }); })

export const checkEventExists = (t, eventId: string) => getEventById(t, eventId)

export const addEvent = (t, event: IInsertEvent) =>
  t.none(`
    INSERT INTO events 
    (event_name, event_description, event_date, 
      event_tickets, event_price, event_min_age)
    VALUES
    ($1, $2, $3, $4, $5, $6)`,
    [event.eventName, event.eventDescription, event.eventDate,
      event.eventTickets, event.eventPrice, event.eventMinAge]
  ) 
  .catch(e => { throw Boom.badRequest('Error registering entry.', { data: e }); })

export const getEventPicturebyId = (t, eventId: string) =>
  t.one('SELECT event_picture FROM events WHERE event_id = $1', eventId) 
  .catch(e => { throw Boom.notFound('Event not found.', { data: e }) })

export const getEventTicketsLeft = (t, eventId: string) => 
  t.one(`SELECT
    (SELECT event_tickets FROM events WHERE event_id = $1) -
    (SELECT COUNT(*) FROM tickets WHERE event_id_ref = $1)
    AS value`, eventId) 
  .then(res => res.value)
  .catch(e => { throw Boom.notFound('Error getting event tickets left.', { data: e }) })

/*
    ENTRIES
*/ 

export const getEntriesByEventId = (t, eventId: string) =>
  t.one(`
    SELECT entry_id, card_id_ref, entry_date, entry_valid
    FROM entries WHERE event_id_ref = $1`, eventId
  )
  .catch(e => { throw Boom.notFound('Event not found.', { data: e }); })

export const getEntriesByCardId = (t, cardId: string) =>
  t.one(`
    SELECT entry_id, event_id_ref, entry_date, entry_valid
    FROM entries WHERE card_id_ref = $1`, cardId
  )
  .catch(e => { throw Boom.notFound('Event not found.', { data: e }); })

export const getEntriesByEventAndCardId = (t, eventId: string, cardId: string) =>
  t.one(`
    SELECT entry_id, entry_date, entry_valid
    FROM entries WHERE event_id_ref = $1 AND card_id_ref = $2`, [eventId, cardId]
  )
  .catch(e => { throw Boom.notFound('Event not found.', { data: e }); })

export const checkEntryValid = (t, eventId: string, cardId: string) =>
  t.none(`SELECT * FROM entries WHERE event_id_ref = $1 AND card_id_ref = $2`, [eventId, cardId])
  .then(() => 
    t.one(`SELECT * FROM tickets WHERE card_id_ref = $1 AND card_id_ref = $2 AND ticket_used IS FALSE`, 
    [eventId, cardId])
  )
  .then(() => true)
  .catch(() => false)

export const addEntry = (t, cardId: string, eventId: string, status: string) =>
  t.none(`
    INSERT INTO entries 
    (card_id_ref, event_id_ref, entry_date, entry_valid)
    VALUES
    ($1, $2, NOW(), $3)`,
    [cardId, eventId, status]
  ) 
  .catch(e => { throw Boom.badRequest('Error registering entry.', { data: e }); })

/*
    CONTROLLERS
*/ 

export const registerController = (t, controllerId: string) =>
  t.none(`INSERT INTO controllers (controller_id) VALUES ($1)`, controllerId)
  .catch(e => { throw Boom.conflict('Failed to register controller.', { data: e }); })

export const checkControllerExists = (t, controllerId: string) =>
  t.one('SELECT * FROM controllers WHERE controller_id = $1', controllerId)
  .catch(e => { throw Boom.conflict('Controller is not registered.', { data: e }); })


/*
    CONNECTIONS
*/ 

export const registerConnection = (t, staffId: string, controllerId: string) =>
  t.none(`INSERT INTO connections (staff_id_ref, controller_id_ref) VALUES ($1, $2)`,
    [staffId, controllerId]
  )
  .catch(e => { throw Boom.conflict('Failed to register connection.', { data: e }); })

export const resetControllerConnections = (t, controllerId: string) =>
  t.none('DELETE FROM connections WHERE controller_id_ref = $1', controllerId)
  .catch(e => { throw Boom.conflict('Failed to reset connections.', { data: e }); })

export const resetStaffConnections = (t, staffId: string) =>
  t.none('DELETE FROM connections WHERE staff_id_ref = $1', staffId)
  .catch(e => { throw Boom.conflict('Failed to reset connections.', { data: e }); })

const getControllerConnections = (t, controllerId: string) =>
  t.any('SELECT staff_id_ref FROM connections WHERE controller_id_ref = $1', controllerId)
  .catch(e => { throw Boom.conflict('Failed to get connections.', { data: e }); })

const getStaffConnection = (t, staffId: string) =>
  t.one('SELECT controller_id_ref FROM connections WHERE staff_id_ref = $1', staffId)
  .then(data => data.controller_id_ref)
  .catch(e => { throw Boom.conflict('Failed to get connection.', { data: e }); })

/*
    MESSAGES
*/ 

export const resetMessages = (t, controllerId: string) =>
  t.none(`
    DELETE FROM messages 
      WHERE message_sender = $1 OR message_receiver = $1`, 
    controllerId)
  .catch(e => { throw Boom.conflict('Failed to reset messages.', { data: e }); })

export const getUnreadMessages = (t, receiverId: string) =>
  t.any(`
    SELECT message_sender, message_type, message_data
    FROM messages 
    WHERE message_receiver = $1 AND message_read IS FALSE
    ORDER BY message_id ASC`, receiverId) 
  .tap(() => setMessagesAsRead(t, receiverId))
  .catch(e => { throw Boom.conflict('Failed to get messages.', { data: e }); })

const setMessagesAsRead = (t, receiverId: string) =>
  t.none(`
    UPDATE messages SET message_read = TRUE 
    WHERE message_receiver = $1`, receiverId)
  .catch(e => { throw Boom.conflict('Failed to set messages as read.', { data: e }); })

export const getAllMessagesByType = (t, messageType) =>
  t.any('SELECT * FROM messages WHERE message_type = $1', messageType)
  .catch(e => { throw Boom.conflict('Failed to set messages as read.', { data: e }); })

export const getUnreadMessagesByType = (t, receiverId: string, messageType: string) =>
  t.any(`
    SELECT message_sender, message_type, message_data
    FROM messages 
    WHERE message_receiver = $1 AND message_type = $2 AND message_read IS FALSE
    ORDER BY message_id ASC`
    , [receiverId, messageType]) 
  .tap(() => setMessagesAsReadByType(t, receiverId, messageType))
  .catch(e => { throw Boom.conflict('Failed to get messages.', { data: e }); })

const setMessagesAsReadByType = (t, receiverId: string, messageType: string) =>
  t.none(`
    UPDATE messages SET message_read = TRUE 
    WHERE message_receiver = $1 AND message_type = $2 AND message_read IS FALSE`
    , [receiverId, messageType])
  .catch(e => { throw Boom.conflict('Failed to set messages as read.', { data: e }); })

const insertMessage = (t, message: IInsertMessage) =>
  t.none(`
    INSERT INTO messages 
    (message_sender, message_receiver, message_type, message_data) 
    VALUES 
    ($1, $2, $3, $4)`
    , [message.messageSender, message.messageReceiver, message.messageType, message.messageData])
  .catch(e => { throw Boom.conflict('Failed insert message.', { data: e }); })

export const insertMessageAsStaff = (t, message: IPreInsertMessage) => 
  getStaffConnection(t, message.messageSender)
  .then(controllerId => 
    insertMessage(t, {
      ...message,
      messageReceiver: controllerId
    })
  )

export const insertMessageAsController = (t, message: IPreInsertMessage) =>
  getControllerConnections(t, message.messageSender)
  .then(connections => 
    Promise.map(connections, connection => 
      insertMessage(t, {
        ...message,
        messageReceiver: connection.staff_id_ref
      })
    )
  )
  .catch(e => { throw Boom.conflict('Failed insert messages.', { data: e }); })

/*
    ENUMS 
*/ 

export enum DBTables {
  USERS       = 'users',
  STAFF       = 'staff',
  CARDS       = 'cards',
  TICKETS     = 'tickets',
  EVENTS      = 'events',
  ENTRIES     = 'entries',
  CONNECTIONS = 'connections',
  CONTROLLERS = 'controllers',
  MESSAGES    = 'messages'
}

/*
    INTERFACES 
*/ 

interface IInsertUser {
  userEmail:    string,
  userName:     string,
  userBirthday: string,
  userPicture:  string
} 

interface IInsertStaff {
  staffEmail:    string,
  staffName:     string,
  staffPassword: string,
  staffType:     string
}

interface IInsertEvent {
  eventName:        string,
  eventDescription: string,
  eventDate:        string,
  eventTickets:     string
  eventPrice:       string
  eventMinAge:     string
  eventPicture:     string
}

interface IInsertMessage {
  messageSender:   string,
  messageReceiver: string,
  messageData:     string,
  messageType:     string
}

interface IPreInsertMessage {
  messageSender:   string,
  messageData:     string,
  messageType:     string
}
