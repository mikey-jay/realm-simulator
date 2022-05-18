const Player = require('../entities/player.js')
module.exports = function burnOneFud (verseIn, playerIndex) {
    const verseOut = structuredClone(verseIn)
    verseOut.players[playerIndex] = Player.removeTokens(verseOut.players[playerIndex], 1, 'fud')
    return verseOut
}