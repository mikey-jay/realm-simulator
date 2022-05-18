const Player = require('../entities/player.js')

function create(gotchiverse, playerIndex, parcelIndex, useCaseName) {
    const playerTotals = {
        tokens: structuredClone(gotchiverse.players[playerIndex].tokens),
        parcels: Player.getTotalParcels(gotchiverse.players[playerIndex]),
        installations: Player.getTotalInstallations(gotchiverse.players[playerIndex])
    }
    return { blockTime: gotchiverse.currentTime, playerIndex, parcelIndex, useCaseName, playerTotals }
}

module.exports = {
    create
}