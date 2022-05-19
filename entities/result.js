const Player = require('../entities/player.js')
const Parcel = require('../entities/parcel.js')

function create(gotchiverse, playerIndex, parcelIndex, useCaseName) {
    const playerTotals = {
        tokens: structuredClone(gotchiverse.players[playerIndex].tokens),
        parcels: Player.getTotalParcels(gotchiverse.players[playerIndex]),
        installations: Player.getTotalInstallations(gotchiverse.players[playerIndex])
    }
    const parcelTotals = {
        tokens: structuredClone(gotchiverse.players[playerIndex].parcels[parcelIndex].tokens),
        installations: Parcel.getTotalInstallations(gotchiverse.players[playerIndex].parcels[parcelIndex])    
    }
    return { blockTime: gotchiverse.currentTime, playerIndex, parcelIndex, useCaseName, playerTotals, parcelTotals }
}

module.exports = {
    create
}