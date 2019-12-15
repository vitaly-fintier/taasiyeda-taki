const UNKNOWN = 'unknown';
const CARD_VALUES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '?', 'stop'];
const CARD_COLORS = ['red', 'blue', 'green', 'yellow', 'special'];

class Game {
    constructor () {
        this.playerNumber = 0;
        this.currentPlaying = 0;
        this.cardState = [];
        this.playACard = this.playACard.bind(this);
        this.playNoCard = this.playNoCard.bind(this);

        this.synchronize();

        this.htmlNodes = {
            status: document.querySelector('#status'),
            currentPlayer: document.querySelector('#currentPlayer'),
            cardOnTop: document.querySelector('#cardOnTop'),
            myCards: document.querySelector('#myCards'),
            nextPlayer: document.querySelector('#nextPlayer')
        }

        this.htmlNodes.myCards.addEventListener('click', this.playACard);
        this.htmlNodes.nextPlayer.click.addEventListener('click', this.playNoCard)

    }

    playACard(event) {
        console.log(event.target);
        const cardId = event.target.dataset.cardId;
        if (cardId) {
            fetch('/play?cardId=' + cardId).then(
                response => {
                    if (response.status !== 200) {
                        window.location.replace('/login.html');
                    }
                }
            )
        }
    }

    playNoCard() {
        fetch('/play').then(
            response => {
                if (response.status !== 200) {
                    window.location.replace('/login.html');
                }
            }
        )
    }

    synchronize() {
        // go to server, ask for the current state of the game
        fetch('/gameStatus').then(r => {
            if (r.status > 403) {
                window.location.replace('/login.html');
                return;
            }
            return r.json();
            }).then(status => {
            console.log(status);
            this.drawTheGame(status);
        });
        setTimeout(() => this.synchronize(), 1000);
    }

    playCard(card) {
        // validate card is acceptable
        const isCardValueOK = CARD_VALUES.includes(card.value);
        const isCardColorOK = CARD_COLORS.includes(card.color);
        if (!isCardColorOK || !isCardValueOK) {
            return;
        }
        // go to server, ask to play with a card
        const response = fetch('/playCard/' + card.color + ',' + card.value);
        response
            .then(() => this.synchronize())
            .catch(err => console.log('Invalid response: ' + err));
    }

    drawTheGame(status) {
        this.htmlNodes.currentPlayer.innerText = status.currentPlaying;
        this.htmlNodes.cardOnTop.innerText = status.cardOnTop.value;
        this.htmlNodes.cardOnTop.setAttribute('class', status.cardOnTop.color);
        this.htmlNodes.myCards.innerHTML = status.cards.map(card => `<div class="card"><span data-card-id="${card.id}" class="${card.color}">${card.value}</span></div>`).join('');
    }
}

window.taki = new Game();