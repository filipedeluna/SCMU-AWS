-- DROP TABLES
DROP TABLE staff;
DROP TABLE entries;
DROP TABLE events;
DROP TABLE tickets;
DROP TABLE cards;
DROP TABLE users;

-- CREATE TABLES
CREATE TABLE users (
    user_id       SERIAL PRIMARY KEY,
    user_email    TEXT UNIQUE NOT NULL,
    user_name     TEXT NOT NULL,
    user_birthday DATE NOT NULL,
    user_picture  TEXT NOT NULL
);

CREATE TABLE cards (
    card_id     INTEGER PRIMARY KEY,
    user_id_ref INTEGER NOT NULL REFERENCES users(user_id)
);

CREATE TABLE staff (
    staff_id       SERIAL PRIMARY KEY,
    staff_email    TEXT UNIQUE NOT NULL,
    staff_name     TEXT NOT NULL,
    staff_password TEXT DEFAULT '123456' NOT NULL,
    staff_type     INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE entries (
    entry_id     SERIAL PRIMARY KEY,
    card_id_ref  INTEGER NOT NULL REFERENCES cards(card_id),
    event_id_ref INTEGER NOT NULL REFERENCES events(event_id),
    entry_date   DATE NOT NULL DEFAULT CURRENT_DATE,
    entry_valid  BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE events (
    event_id          SERIAL PRIMARY KEY,
    event_name        TEXT NOT NULL,
    event_description TEXT NOT NULL,
    event_date        DATE NOT NULL,
    event_tickets     INTEGER NOT NULL,
    event_price       NUMERIC NOT NULL,
    event_min_age     INTEGER NOT NULL,
    event_picture     TEXT NOT NULL
);

CREATE TABLE tickets (
    card_id_ref  INTEGER REFERENCES cards(card_id),
    event_id_ref INTEGER REFERENCES users(user_id),
    ticket_used  BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (card_id_ref, event_id_ref)
);

-- TEST DATA
INSERT INTO users 
(user_id, user_email, user_name, user_birthday, user_picture)
VALUES
(0, 'alex@test.com',   'Alex Santos',    '1994-03-12', 'alex.jpg'),
(1, 'julio@test.com',  'Júlio Luis',     '1991-08-23', 'julio.jpg'),
(2, 'luisa@test.com',  'Luisa Silva',    '1981-03-12', 'luisa.jpg'),
(3, 'maria@test.com',  'Maria Alves',    '1971-03-12', 'maria.jpg'),
(4, 'rajeet@test.com', 'Rajeet Punjabi', '2009-03-12', 'rajeet.jpg')
;

INSERT INTO cards 
(card_id, user_id_ref)
VALUES
(00000000, 0),
(11111111 ,1),
(22222222, 2),
(33333333, 3),
(44444444, 4)
;

INSERT INTO staff 
(staff_email, staff_name, staff_type)
VALUES 
('test_admin@test.com',   'test_admin' ,  0), 
('test_tickets@test.com', 'test_tickets', 1), 
('test_entry@test.com',   'test_entry',   2)
; 

INSERT INTO events 
(event_name, event_description, event_date, event_tickets, event_price, event_min_age)
VALUES
('Tomorrowland',   'Festa de música electrónica.', '2019-06-07', 3000, 150, 18),
('Festa Batatoon', 'Diversão para crianças.',      '2019-06-07', 50,   10,  8)
;



