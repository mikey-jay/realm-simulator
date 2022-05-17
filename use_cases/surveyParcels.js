const { pipe } = require('../utils.js')
const Reservoir = require('../entities/reservoir.js')
const Parcel = require('../entities/parcel.js')
const Player = require('../entities/player.js')
const Gotchiverse = require('../entities/gotchiverse.js')
const Wallet = require('../entities/wallet.js')

function surveySingleParcel (gotchiverseIn, playerIndex, parcelIndex) {
    let gotchiverseOut = structuredClone(gotchiverseIn)
    const parcelSize = gotchiverseOut.players[playerIndex].parcels[parcelIndex].size
    const distributionRate = gotchiverseOut.rules.surveyingRoundDistributionRates[gotchiverseOut.currentRound - 1]
    const baseAlchemica = gotchiverseOut.rules.avgBaseAlchemicaPerParcel[parcelSize]
    gotchiverseOut.players[playerIndex].parcels[parcelIndex] = Parcel.addAlchemica(gotchiverseOut.players[playerIndex].parcels[parcelIndex], baseAlchemica, distributionRate)
    gotchiverseOut = Wallet.removeTokens(gotchiverseOut, baseAlchemica, distributionRate)
    return gotchiverseOut
}

function surveyParcelsAndAdvanceRound (gotchiverseIn) {
    let gotchiverseOut = structuredClone(gotchiverseIn)
    gotchiverseOut = Gotchiverse.addRound(gotchiverseOut)
    for (let playerIndex = 0 ; playerIndex < gotchiverseOut.players.length ; playerIndex++) {
        for (let parcelIndex = 0 ; parcelIndex < gotchiverseOut.players[playerIndex].parcels.length ; parcelIndex++) {
            gotchiverseOut = surveySingleParcel(gotchiverseOut, playerIndex, parcelIndex)
        }
    }
    return gotchiverseOut
}

module.exports = {
    surveySingleParcel,
    surveyParcels: surveyParcelsAndAdvanceRound,
    surveyParcelsAndAdvanceRound
}