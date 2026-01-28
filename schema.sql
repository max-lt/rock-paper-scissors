-- Create players table
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    wins INTEGER NOT NULL DEFAULT 0,
    draws INTEGER NOT NULL DEFAULT 0,
    games INTEGER NOT NULL DEFAULT 0
);

-- Create games table
CREATE TABLE games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player UUID NOT NULL REFERENCES players(id),
    state VARCHAR(10) NOT NULL DEFAULT 'prepare' CHECK (state IN ('prepare', 'settle')),
    hash VARCHAR(40) NOT NULL,
    nonce VARCHAR(8),
    computer_guess VARCHAR(10) CHECK (computer_guess IN ('rock', 'paper', 'scissors')),
    user_guess VARCHAR(10) CHECK (user_guess IN ('rock', 'paper', 'scissors')),
    result VARCHAR(4) CHECK (result IN ('win', 'lose', 'draw'))
);

-- Index for leaderboard query
CREATE INDEX idx_players_games ON players(games) WHERE games > 0;
