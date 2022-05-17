const Reservoir = require('../entities/reservoir.js')
const Parcel = require('../entities/parcel.js')
const Player = require('../entities/player.js')
const Wallet = require('../entities/wallet.js')

const { getWeightedAverage } = require('../utils.js')
const player = require('../entities/player.js')

function emptyReservoirs (gotchiverseIn, playerIndex, parcelIndex) {
    const gotchiverseOut = structuredClone(gotchiverseIn)
    const reservoirIndexes = Parcel.getInstallationClassIndexes(gotchiverseOut.players[playerIndex].parcels[parcelIndex], 'reservoir')
    const reservoirTypes = [...new Set(reservoirIndexes.map((i) => gotchiverseOut.players[playerIndex].parcels[parcelIndex].installations[i].type))]

    reservoirTypes.forEach((type) => {
        const reservoirIndexes = Parcel.getInstallationTypeIndexes(gotchiverseOut.players[playerIndex].parcels[parcelIndex], type)
        const spilloverRate = getTotalReservoirSpilloverRateFromParcel(gotchiverseOut, playerIndex, parcelIndex, type)
        reservoirIndexes.forEach((i) => {
            const reservoirBalance = Reservoir.getBalance(gotchiverseOut.players[playerIndex].parcels[parcelIndex].installations[i])
            const resourceToken = gotchiverseOut.players[playerIndex].parcels[parcelIndex].installations[i].resourceToken
            const spillover = reservoirBalance * spilloverRate
            gotchiverseOut.players[playerIndex].parcels[parcelIndex].installations[i] = Reservoir.removeAlchemica(gotchiverseOut.players[playerIndex].parcels[parcelIndex].installations[i], reservoirBalance)
            gotchiverseOut.players[playerIndex] = Player.addTokens(gotchiverseOut.players[playerIndex], resourceToken, reservoirBalance - spillover)
            gotchiverseOut.spillover = Wallet.addTokens(gotchiverseOut.spillover, resourceToken, spillover)
        })
    })
    return gotchiverseOut
}

function getTotalReservoirSpilloverRateFromParcel (gotchiverseIn, playerIndex, parcelIndex, reservoirType) {
    const playerParcel = gotchiverseIn.players[playerIndex].parcels[parcelIndex]
    const reservoirLevelCounts = Parcel.getInstallationLevelCount(playerParcel, reservoirType)
    const reservoirCapacities = gotchiverseIn.rules.installations[reservoirType].capacities
    const spilloverRates = gotchiverseIn.rules.installations[reservoirType].spilloverRates
    let totalReservoirCapacityByLevel = []
    for (let i = 0 ; i < reservoirCapacities.length ; i++)
        totalReservoirCapacityByLevel.push(reservoirLevelCounts[i] * reservoirCapacities[i])
    return getWeightedAverage(spilloverRates, totalReservoirCapacityByLevel)
}

module.exports = {
    emptyReservoirs
}