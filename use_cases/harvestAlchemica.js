const parcel = require('../entities/parcel.js')
const Parcel = require('../entities/parcel.js')
const Reservoir = require('../entities/reservoir.js')


function harvestAlchemica(gotchiverseIn, playerIndex, parcelIndex, installationIndex, blockCount) {
    const gotchiverseOut = structuredClone(gotchiverseIn)
    const playerParcel = gotchiverseOut.players[playerIndex].parcels[parcelIndex]
    const playerHarvester = playerParcel.installations[installationIndex]
    const rules = gotchiverseOut.rules
    const useReservoirType = gotchiverseOut.rules.installations[playerHarvester.type].useReservoirType
    const oneDayInBlocks = 60 * 60 * 24 / rules.secondsPerBlock

    if (playerHarvester.class != 'harvester') throw new Error('Can only harvest alchemica from harvesters')

    const harvestRate = rules.installations[playerHarvester.type].harvestRates[playerHarvester.level - 1]
    let harvestQtyRemaining = harvestRate * (blockCount / oneDayInBlocks)

    for (let i = 0 ; i < gotchiverseOut.players[playerIndex].parcels[parcelIndex].installations.length && harvestQtyRemaining > 0 ; i++) {
        if (gotchiverseOut.players[playerIndex].parcels[parcelIndex].installations[i].type == useReservoirType) {
            const reservoirCapacity = rules.installations[useReservoirType].capacities[gotchiverseOut.players[playerIndex].parcels[parcelIndex].installations[i].level - 1]
            const reservoirBalance = Reservoir.getBalance(gotchiverseOut.players[playerIndex].parcels[parcelIndex].installations[i])
            const parcelBalance = Parcel.getTokenBalance(gotchiverseOut.players[playerIndex].parcels[parcelIndex], playerHarvester.resourceToken)
            const harvestQty = Math.max(0, Math.min(reservoirCapacity - reservoirBalance, harvestQtyRemaining, parcelBalance))
            gotchiverseOut.players[playerIndex].parcels[parcelIndex].installations[i] = Reservoir.addAlchemica(gotchiverseOut.players[playerIndex].parcels[parcelIndex].installations[i], harvestQty)
            gotchiverseOut.players[playerIndex].parcels[parcelIndex] = Parcel.removeAlchemica(gotchiverseOut.players[playerIndex].parcels[parcelIndex], playerHarvester.resourceToken, harvestQty)
            harvestQtyRemaining -= harvestQty
        }
    }

    return gotchiverseOut
}

module.exports = {
    harvestAlchemica
}