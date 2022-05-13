const Wallet = require('./wallet.js')

function create (rules) {
    const wallet = Wallet.create()
    return { rules, players: [], ...wallet }
}

function addPlayer (gotchiverseIn, player) {
    const gotchiverseOut = structuredClone(gotchiverseIn)
    gotchiverseOut.players.push(player)
    return gotchiverseOut
}

module.exports = {
    create,
    addAlchemica: Wallet.addTokens,
    removeAlchemica: Wallet.removeTokens,
    addPlayer
}

