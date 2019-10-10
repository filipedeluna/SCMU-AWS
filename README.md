SCMU-AWS

This was a project for an IoT course. My group's project idea was to create a cloud-based solution for security checkpoints and ticket stores for events. An Arduino with multiple sensors was used coupled with an Android App. Staff could sell tickets to users, validate users' tickets, and etc.

I was tasked with creating a Node.js Web Service hosted in AWS that would manage the communication bewtween terminals (Arduinos) and the Android App (Security staff). All the data was in a Postgres Database in the same machine.

Other functionalities were adding users, events, cards for users that would store tickets for events, users and event pictures and data, etc.

Typescript was used with pg-promise and express. The service was set-up using systemd to prevent crashes and automatically restart.

Routes:

USERS\
GET  /users - get all users\
GET  /users?email=exemplo@email.com - get user id by email\
GET  /users/picture?email=exemplo@email.com - get user image by id\
POST /users - create new user { userEmail: string, userName: sring, userBirthday: "YYYY-MM-DD", userPicture: base64 }\
...

-------------------------------------------------

STAFF\
GET  /staff - get staff\
GET  /staff?email=exemplo@email.com - get staff info\
POST /staff - create new staff { staffEmail: string, staffName: string, staffPassword: string, staffType: 0, 1 ou 2 }\
...

-------------------------------------------------

CARDS\
GET  /cards - get cards\
GET  /cards?email=exemplo@email.com - get cards by email\
GET  /cards/(cardId) - get card user\
POST /cards - add card to user { cardId, userEmail }\
DELETE /cards - reset cards, tickets and entries\
...

-------------------------------------------------

TICKETS\
GET /tickets - get tickets\
GET /tickets/card/(cardId) - get all tickets for card\
GET /tickets/event/(eventId) - get all tickets for event\
GET /tickets/(cardId)/(eventId) - verify if ticket has been used\
POST /tickets/buy - create ticket { cardId: string, eventId: string }\
POST /tickets/use - use ticket { cardId: string, eventId: string }\
PATCH /tickets - set ticket as used { cardId: string, eventId: string }\
...

-------------------------------------------------

EVENTS\
GET /events - get events\
GET /events/(eventId) - get event by id\
GET /events/(eventId)/picture - get event picture\
GET /events/(eventId)/tickets - get event tickets\
POST /events - create event { eventName: string, eventDescription: string, eventDate: 'YYYY-MM-DD', eventTickets: string, eventPrice: string, eventMinAge: string, eventPicture: fotoBase64 }\
...

-------------------------------------------------

ENTRIES\
GET /entries - get entries (entradas)\
GET /entries/card/(cardId) - get card entries\
GET /entries/(eventId) - get event entries\
GET /entries/(eventId)/(cardId) - get card entries\
POST /entries - register entry { cardId: string, eventId: string }\
...

-------------------------------------------------

CONTROLLERS\
GET /controllers - get controllers\
POST /controllers - register controller and reset old controller data { controllerId: string }\
...

-------------------------------------------------

CONNECTIONS\
GET /connections - get connections\
POST /connections - register connection and reset connection data { staffId: string,  controllerId: string }\
...

-------------------------------------------------

MESSAGES\
GET /messages - get messages\
GET /message?type=MESSAGE_TYPE - get all messages with type\
GET /messages?email=exemplo@email.com - get all messages from staff\
GET /messages?controller=12341&type=MESSAGE_TYPE - get all unread messages from controller, set as read. use MESSAGE_TYPE to filter or nothing to get all\
GET /messages?email=exemplo@email.com&type=MESSAGE_TYPE - get all unread messages from staff, set as read. use MESSAGE_TYPE to filter or nothing to get all\
POST /messages?staff=(staffemail) - send message from staff to controller { messageType: string, messageData: {} } a messageData  {}\
POST /messages?controller=(controllerid) - multicast message to all staff registered in controller { messageType: string, messageData: {} } a messageData não pode ir vazia.. tem de ter no minimo um {} \
...

-------------------------------------------------
