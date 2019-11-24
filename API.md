# client-server API

## get status

GET `/server/gameStatus`

expected response:
```json
{
    currentPlaying: 1,
    playerId: 1,
    cardOnTop: {
        color: 'green',
        value: '4'
    },
    remainingCards: 15,
    players: ['Moshe', 'Riki'],
    cards: [
        [{
            color: 'unknown',
            value: 'unknown'
        }],
        [
            {
                color: 'red',
                value: '3'
            },
            {
                color: 'blue',
                value: '7',
            },
            {
                color: 'special',
                value: 'stop'
            }
        ]
    ]
}
```
