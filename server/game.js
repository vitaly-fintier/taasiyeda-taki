const UNKNOWN = 'unknown';
const CARD_VALUES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '?', 'stop'];
const CARD_COLORS = ['red', 'blue', 'green', 'yellow', 'special'];

let cardIdCounter = 0;

/**
 * @param {Array<any>} deck 
 */
function shuffleDeck(deck) {
    return deck.sort(() => Math.random < 0.5 ? -1 : 1);
}

function createDeck() {
    const deck = [];
    // only colors and numbers at first
    CARD_VALUES.slice(0, 8).forEach(value => {
        CARD_COLORS.slice(0, 3).forEach(color => {
            for (let i = 0; i < 4; i++) {
                deck.push({
                    color,
                    value,
                    id: cardIdCounter++
                });
            }
        })
    });
    CARD_VALUES.slice(8).forEach(value => {
        for (let i = 0; i < 4; i++) {
            deck.push({
                color: 'special',
                value,
                id: cardIdCounter++
            });
        }
    });
    return shuffleDeck(deck);
}

class Game {
    constructor() {
        this.players = [];
        this.cards = [];
        this.currentPlaying = 0;
        this.deck = createDeck();
        this.cardOnTop = this.takeCardFromDeck();
    }

    playerHasCard(player, cardId) {
        if (player.cards) {
            const foundCard = player.cards.find(card => card.id.toString() === cardId);
            return foundCard;
        }
        return false;
    }

    allowedToPlayCard(card) {
        const { color, value } = this.cardOnTop;
        if (card.color === color || card.value === value || card.color === 'special' || this.cardOnTop.color === 'special') {
            return true;
        }
    }

    playACard(player, cardId) {
        const cardToPlay = this.playerHasCard(player, cardId);
        if (this.currentPlaying === player.playerId && cardToPlay && this.allowedToPlayCard(cardToPlay)) {
            const cardIdx = player.cards.indexOf(cardToPlay);
            player.cards.splice(cardIdx, 1);
            this.cardOnTop = cardToPlay;
            if (cardToPlay.value === 'stop') {
                this.nextRound();
            }
            this.nextRound();
        }
    }

    takeCardFromDeck() {
        if (this.deck.length) {
            return this.deck.pop();
        }
    }

    canAddPlayer () {
        return this.deck.length > 7;
    }

    addPlayer(player) {
        const cards = [];
        if (this.deck.length > 7) {
            for (let i = 0; i < 7; i++) {
                cards.push(this.takeCardFromDeck());
            }
        }
        this.players.push(player);
        player.cards = cards;
    }

    canTakeCard() {
        return this.deck.length > 0;
    }

    nextRound() {
        this.currentPlaying++;
        if (this.currentPlaying >= this.players.length) {
            this.currentPlaying = 0;
        }
    }
}

module.exports = Game;