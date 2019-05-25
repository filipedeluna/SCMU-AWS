SCMU-AWS

USERS\
GET  /users - devolve todos os users\
GET  /users?email=exemplo@email.com - devolve id do user com este email\
GET  /users/picture?email=exemplo@email.com - devolve imagem do user com o seguinte id\
POST /users - cria um user novo. enviar o json seguinte { userEmail: string, userName: sring, userBirthday: "YYYY-MM-DD", userPicture: base64 }\
...

-------------------------------------------------

STAFF\
GET  /staff - devolve toda a staff\
GET  /staff?email=exemplo@email.com - devolve informacao do staff com este email\
POST /staff - cria um staff novo. enviar o json seguinte { staffEmail: string, staffName: string, staffPassword: string, staffType: 0, 1 ou 2 }\
...

-------------------------------------------------

CARDS\
GET  /cards - devolve todos os cards\
GET  /cards?email=exemplo@email.com - devolve os cartoes com este email\
GET  /cards/(cardId) - devolve o user associado ao cartao\
POST /cards - adiciona um card a um user - enviar o json seguinte { cardId, userEmail }\
DELETE /cards - apaga todos os cards, tickets e entries\
...

-------------------------------------------------

TICKETS\
GET /tickets - devolve todos os tickets\
GET /tickets/card/(cardId) - devolve todos os tickets de um cartao\
GET /tickets/event/(eventId) - devolve todos os tickets de um evento\
GET /tickets/(cardId)/(eventId) - verifica se o ticket ja foi usado\
POST /tickets/buy - cria um ticket novo. enviar o json seguinte { cardId: string, eventId: string }\
POST /tickets/use - verifica se o ticket ja foi usado, se nao, usa, e regista a entrada { cardId: string, eventId: string }\
PATCH /tickets - mete um ticket a usado. enviar o json seguinte { cardId: string, eventId: string }\
...

-------------------------------------------------

EVENTS\
GET /events - devolve todos os events\
GET /events/(eventId) - devolve evento com o id\
GET /events/(eventId)/picture - devolve foto do evento com id\
GET /events/(eventId)/tickets - devolve bilhetes disponiveis para um evento\
POST /events - cria um evento. enviar o json seguinte { eventName: string, eventDescription: string, eventDate: 'YYYY-MM-DD', eventTickets: string, eventPrice: string, eventMinAge: string, eventPicture: fotoBase64 }\
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
POST /controllers - regista um controlador e faz reset todas as conexoes/mensagens. enviar o json seguinte { controllerId: string }\
...

-------------------------------------------------

CONNECTIONS\
GET /connections - devolve todos as conexoes\
POST /connections - regista uma conexao e faz reset a todas as conexoes/mensagens enviar o json seguinte { staffId: string,  controllerId: string }\
...

-------------------------------------------------

MESSAGES\
GET /messages - devolve todos as mensagens\
GET /message?type=MESSAGE_TYPE - devolve todos as mensagens de um tipo\
GET /messages?email=exemplo@email.com - devolve todas as mensagens de um staff com email\
GET /messages?controller=12341&type=MESSAGE_TYPE - devolve todos as mensagens por ler de um controlador com id, mete como lidas, e do tipo MESSAGE_TYPE. MESSAGE_TYPE não ser incluido para receber todas\
GET /messages - devolve todos as mensagens\
GET /messages?email=exemplo@email.com&type=MESSAGE_TYPE - devolve todas as mensagens por ler em que um  staff com email é o receptor, mete como lidas, e do tipo MESSAGE_TYPE. MESSAGE_TYPE pode nao ser incluido para receber todas\
GET /messages?controller=12341&type=MESSAGE_TYPE - devolve todas as mensagens, mete como lidas, de um controlador com id e do tipo MESSAGE_TYPE. MESSAGE_TYPE pode ser nulo para receber todas\
POST /messages?staff=(staffemail) - regista uma mensagem de um staff para o arduino a ques esta subscrito { messageType: string, messageData: {} } a messageData não pode ir vazia.. tem de ter no minimo um {}\
POST /messages?controller=(controllerid) - regista uma mensagem de um controller para todo o staff subscrito { messageType: string, messageData: {} } a messageData não pode ir vazia.. tem de ter no minimo um {} \
...

-------------------------------------------------
