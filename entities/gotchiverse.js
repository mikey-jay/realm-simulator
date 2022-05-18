const Wallet = require('./wallet.js')

function create (rules) {
    const wallet = Wallet.create()
    const dao = Wallet.create()
    const greatPortal = Wallet.create()
    const pixelCraft = Wallet.create()
    const burn = Wallet.create()
    const spillover = Wallet.create()

    return { rules, currentTime: 0, currentRound: 0, dao, greatPortal, pixelCraft, burn, spillover, players: [], ...wallet }
}

function addPlayer (gotchiverseIn, player) {
    const gotchiverseOut = structuredClone(gotchiverseIn)
    gotchiverseOut.players.push(player)
    return gotchiverseOut
}

function addTime (gotchiverseIn, numBlocks) {
    const gotchiverseOut = structuredClone(gotchiverseIn)
    gotchiverseOut.currentTime += numBlocks
    return gotchiverseOut
}

function addRound (gotchiverseIn) {
    const gotchiverseOut = structuredClone(gotchiverseIn)
    gotchiverseOut.currentRound += 1
    return gotchiverseOut
}

module.exports = {
    ...Wallet,
    create,
    addAlchemica: Wallet.addTokens,
    removeAlchemica: Wallet.removeTokens,
    addPlayer,
    addTime,
    addRound
}

