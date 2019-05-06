SCMU-AWS
- Imagem evento
- none nos INSERTS
- verificar idade
- verificar idade antes de inserir em evento
- ip arduino staff
- Tabela ligacoes (idArduino, ipApp, ipArduino)

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
GET /tickets/card/(eventId) - devolve todos os tickets de um evento\
GET /tickets/(cardId)/(eventId) - verifica se os tickets foram usados\
POST /tickets - cria um ticket novo. enviar o json seguinte { cardId: string, eventId: string }\
PATCH /tickets - mete um ticket a usado. enviar o json seguinte { cardId: string, eventId: string }\
...

-------------------------------------------------

ENTRIES\
GET /entries - devolve todas as entries (entradas)\
GET /entries/card/(cardId) - devolve todas as entries de um cartao\
GET /entries/(eventId) - devolve todas as entries de um evento\
GET /entries/(eventId)/(cardId) - devolve todas as entries de um evento para um cartao\
POST /entries - regista uma entry. enviar o json seguinte { cardId: string, eventId: string }\\
...

-------------------------------------------------

EVENTS\
GET /evetns - devolve todos os events\
...

-------------------------------------------------