SCMU-AWS

USERS\
GET /users - devolve todos os users\
GET /users?email=exemplo@email.com - devolve id do user com este email\
GET /user/(idUser) - devolve informacao do user com o seguinte id\
GET /user/(idUser)/picture - devolve imagem do user com o seguinte id\
POST /users - cria um user novo. enviar o json seguinte { user_email: sring, user_name: sring, user_birthday: "YYYY-MM-DD", user_picture: base64 }\
...

-------------------------------------------------

STAFF\
GET /staff - devolve toda a staff\
GET /staff?email=exemplo@email.com - devolve id do staff com este email\
GET /staff/(idStaff) - devolve informacao do staff com o seguinte id\
POST /staff - cria um staff novo. enviar o json seguinte { staff_email: string, staff_name: string, staff_password: string, staff_type: 0, 1 ou 2 }\
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