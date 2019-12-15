const express = require('express');
const path = require('path');
const Game = require('./game');

const server = express();
const staticFiles = path.resolve(__dirname, '../client');
const session = require('express-session');

let game = new Game();
let sessionPlayers = [];
let playerCounter = 0;

server.use(session({
    secret: '1',
    cookie: {},
    resave: true,
    saveUninitialized: true
}));

server.use('/join/', (req, res, next) => {
    if (!req.query['name']) {
        res.status(401);
        res.send('Not a valid name');
        return;
    }
    for (let check of sessionPlayers) {
        if (check.sessionID === req.sessionID) 
        res.redirect('/');
        next(false);
    }
    console.log('Player joined: ', req.query['name'], req.sessionID);
    const playerData = {
        name: req.query['name'],
        playerId: playerCounter++,
        sessionID: req.sessionID
    };
    sessionPlayers.push(playerData);
    game.addPlayer(playerData);
    res.redirect('/');
    next();
});

server.use('/play', (req, res, next) => {
    const cardId = req.query.cardId;
    const player = game.players.find(player => player.sessionID === req.sessionID);

    if (player && cardId) {
        const card = game.playerHasCard(player, cardId);
        if (!card) {
            res.status(403);
            res.send('Oh no!');
            return next(false);
        }
        console.log('Player', player.name, 'is playing', card.color, card.value, card.id);
        game.playACard(player, cardId);
        res.status(200);
        res.send('ok');
        return next();
    } else if(player) {
        console.log('Player', player.name, 'has no card. move next.');
        game.playNoCard(player)
        res.status(200);
        res.send('ok');
    } else {
        res.status(403);
        res.send('Oh no!');
        return next(false);
    }
});

server.use('/gameStatus', (req, res, next) => {
    let found = false;
    for (check of sessionPlayers) {
        if (check.sessionID === req.sessionID) {
            found = check;
            break;
        }
    }
    if (!found) {
        console.log('player not found ', req.sessionID);
        res.status(403);
        return next(false);
    }
    const {currentPlaying, cardOnTop, players, deck} = game;
    const playerData = players.find(player => player.sessionID === req.sessionID);
    const status = {
        cardOnTop,
        players: players.map(player => player.name),
        currentPlaying: players.find(player => player.playerId === currentPlaying).name,
        playerId: req.sessionID,
        cards: playerData.cards,
        remainingCards: deck.length
    };
    res.send(status);
});

server.use(express.static(staticFiles));

server.listen(process.env.PORT || 8080);