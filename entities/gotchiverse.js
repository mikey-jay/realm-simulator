const Wallet = require('./wallet.js')

function create (rules) {
    const wallet = Wallet.create()
    const dao = Wallet.create()
    const greatPortal = Wallet.create()
    const pixelCraft = Wallet.create()
    const burn = Wallet.create()
    return { rules, currentTime: 0, dao, greatPortal, pixelCraft, burn, players: [], ...wallet }
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

