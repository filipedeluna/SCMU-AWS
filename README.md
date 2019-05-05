SCMU-AWS

USERS\
GET /users - devolve todos os users\
GET /users?email=exemplo@email.com - devolve id do utilizador com este email\
GET /user/(idUser) - devolve informacao do user com o seguinte id\
GET /user/(idUser)/picture - devolve imagem do user com o seguinte id\
POST /users - cria um utilizador novo. enviar o json seguinte { user_email: sring, user_name: sring, user_birthday: "YYYY-MM-DD", user_picture: base64 }\
...

-------------------------------------------------

STAFF\
GET /staff - devolve toda a staff\
...

-------------------------------------------------

CARDS\
GET /cards - devolve todos os cards\
...

-------------------------------------------------

TICKETS\
GET /tickets - devolve todos os tickets\
...

-------------------------------------------------

ENTRIES\
GET /entries - devolve todas as entries (entradas)\
...

-------------------------------------------------

EVENTS\
GET /evetns - devolve todos os events\
...

-------------------------------------------------