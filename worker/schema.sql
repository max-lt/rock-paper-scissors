DROP TABLE IF EXISTS players;
CREATE TABLE players (
  id VARCHAR(36), -- uuid
  name VARCHAR(255), 
  wins INT, 
  draws INT,
  games INT,
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS games;
CREATE TABLE games (
  id VARCHAR(36), -- uuid
  player VARCHAR(36), -- uuid
  state VARCHAR(8), -- prepare, settle
  hash VARCHAR(40), -- sha1
  nonce VARCHAR(8), -- 8 random characters
  result VARCHAR(4), -- win, lose, draw
  userGuess VARCHAR(8), -- rock, paper, scissors
  computerGuess VARCHAR(8), -- rock, paper, scissors
  PRIMARY KEY (id)
);
