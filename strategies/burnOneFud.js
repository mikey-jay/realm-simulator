const Player = require('../entities/player.js')

module.exports = function burnOneFud (verseIn, playerIndex, parcelIndex) {
    if (Player.getTokenBalance(verseIn.players[playerIndex], 'fud') >= 1)
        return burnFud
    return false
}

const burnFud = (verseIn, playerIndex, parcelIndex) => {
    const verseOut = structuredClone(verseIn)
    verseOut.players[playerIndex] = Player.removeTokens(verseOut.players[playerIndex], 'fud', 1)
    return verseOut
}