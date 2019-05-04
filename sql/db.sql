--DROP TABLES
DROP TABLE users;
DROP TABLE entries;
DROP TABLE cards;
DROP TABLE tickets;
DROP TABLE staff;
DROP TABLE events;

-- CREATE TABLES
CREATE TABLE users (
    user_id       SERIAL PRIMARY KEY,
    user_email    TEXT UNIQUE NOT NULL
    user_name     TEXT NOT NULL
    user_birthday DATE NOT NULL
    user_picture  TEXT NOT NULL
);

CREATE TABLE cards (
    card_id     SERIAL PRIMARY KEY,
    user_id_ref INTEGER NOT NULL REFERENCES users(user_id)
);

CREATE TABLE staff (
    staff_id       INTEGER PRIMARY KEY,
    staff_email    TEXT NOT NULL,
    staff_name     TEXT NOT NULL
    staff_password TEXT DEFAULT '123456' NOT NULL
    staff_type     INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE entries (
    entry_id    SERIAL PRIMARY KEY,
    card_id_ref INTEGER NOT NULL REFERENCES cards(card_id)
    entry_date  DATE NOT NULL DEFAULT CURRENT_DATE
    entry_valid BOOLEAN NOT NULL DEFAULT TRUE

);

CREATE TABLE events (
    event_id          SERIAL PRIMARY KEY,
    event_name        TEXT NOT NULL
    event_description TEXT NOT NULL
    event_date        DATE NOT NULL
    event_tickets     INTEGER NOT NULL
    event_price       NUMERIC NOT NULL
    event_min_age     INTEGER NOT NULL
);

CREATE TABLE tickets (
    ticket_id    SERIAL NOT NULL,
    card_id_ref  INTEGER REFERENCES cards(card_id),
    event_id_ref INTEGER REFERENCES users(user_id),
    used         BOOLEAN NOT NULL DEFAULT FALSE
    PRIMARY KEY (ticket_id, card_id_ref, event_id_ref)
);

-- TEST DATA
INSERT INTO users 
(user_email, user_name, user_birthday, user_picture)
VALUES
INSERT INTO cards 

INSERT INTO staff 
(staff_email, staff_name, staff_type)
VALUES 
('test_admin@test.com',   'test_admin' ,  0), 
('test_tickets@test.com', 'test_tickets', 1), 
('test_entry@test.com',   'test_entry'    2)
; 

INSERT INTO events 





