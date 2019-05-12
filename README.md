SCMU-AWS

USERS\
GET  /users - devolve todos os users\
GET  /users?email=exemplo@email.com - devolve id do user com este email\
GET  /users/(idUser) - devolve informacao do user com o seguinte id\
GET  /users/(idUser)/picture - devolve imagem do user com o seguinte id\
POST /users - cria um user novo. enviar o json seguinte { user_email: sring, user_name: sring, user_birthday: "YYYY-MM-DD", user_picture: base64 }\
...

-------------------------------------------------

STAFF\
GET  /staff - devolve toda a staff\
GET  /staff?email=exemplo@email.com - devolve id do staff com este email\
GET  /staff/(idStaff) - devolve informacao do staff com o seguinte id\
POST /staff - cria um staff novo. enviar o json seguinte { staff_email: string, staff_name: string, staff_password: string, staff_type: 0, 1 ou 2 }\
...

-------------------------------------------------

CARDS\
GET  /cards - devolve todos os cards\
GET  /cards/(cardId)/user - devolve o user associado ao cartao\
GET  /cards/user/(userId) - devolve todos os cartoes associados ao user\
POST /cards - adiciona um card a um user - enviar o json seguinte { card_id, user_id }\
...

-------------------------------------------------

TICKETS\
GET /tickets - devolve todos os tickets\
GET /tickets/card/(cardId) - devolve todos os tickets de um cartao\
GET /tickets/event/(eventId) - devolve todos os tickets de um evento\
GET /tickets/(cardId)/(eventId) - verifica se o ticket ja foi usado\
POST /tickets - cria um ticket novo. enviar o json seguinte { cardId: string, eventId: string }\
PATCH /tickets - mete um ticket a usado. enviar o json seguinte { cardId: string, eventId: string }\
...

-------------------------------------------------

EVENTS\
GET /events - devolve todos os events\
GET /events/(eventId) - devolve evento com o id\
GET /events/(eventId)/picture - devolve foto do evento com id\
GET /events/(eventId)/tickets - devolve bilhetes disponiveis para um evento\
POST /events - cria um evento. enviar o json seguinte { event_name: string, event_description: string, event_date: 'YYYY-MM-DD', event_tickets: string, event_price: string, event_min_age: string, event_picture: fotoBase64 }\
...

-------------------------------------------------

ENTRIES\
GET /entries - devolve todas as entries (entradas)\
GET /entries/card/(cardId) - devolve todas as entries de um cartao\
GET /entries/(eventId) - devolve todas as entries de um evento\
GET /entries/(eventId)/(cardId) - devolve todas as entries de um evento para um cartao\
POST /entries - regista uma entry. enviar o json seguinte { cardId: string, eventId: string }\
...

-------------------------------------------------

CONTROLLERS\
GET /controllers - devolve todos os controladores\
POST /controllers - regista um controlador. enviar o json seguinte { controllerId: string, controllerIp: string }\
...

-------------------------------------------------

CONNECTIONS\
GET /connections - devolve todos as conexoes\
POST /connections - regista uma conexao. enviar o json seguinte { staffId: string, staffIp: string, staffIp: controllerId }\
...

-------------------------------------------------
