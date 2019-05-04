DROP TABLE users;

CREATE TABLE users (
    user_id serial PRIMARY KEY,
    user_name varchar (50) NOT NULL
);

INSERT INTO users (user_name) 
VALUES 
('filipe'), 
('rafael'), 
('ricardo')
; 