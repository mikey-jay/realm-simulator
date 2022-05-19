const Player = require('../entities/player.js')
const Parcel = require('../entities/parcel.js')
const {subtractObjectKeys} = require('../utils.js')

function create(gotchiverse, playerIndex, parcelIndex, useCaseName, lastResult = { playerTotals: {}, parcelTotals: {} }) {
    const playerTotals = {
        tokens: structuredClone(gotchiverse.players[playerIndex].tokens),
        parcels: Player.getTotalParcels(gotchiverse.players[playerIndex]),
        installations: Player.getTotalInstallations(gotchiverse.players[playerIndex])
    }
    const parcelTotals = {
        tokens: structuredClone(gotchiverse.players[playerIndex].parcels[parcelIndex].tokens),
        installations: Parcel.getTotalInstallations(gotchiverse.players[playerIndex].parcels[parcelIndex])    
    }
    const playerChange = subtractObjectKeys(playerTotals, lastResult.playerTotals)
    const parcelChange = subtractObjectKeys(parcelTotals, lastResult.parcelTotals)
    return { blockTime: gotchiverse.currentTime, playerIndex, parcelIndex, useCaseName, playerTotals, parcelTotals, playerChange, parcelChange }
}

module.exports = {
    create
}