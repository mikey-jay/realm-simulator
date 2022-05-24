const { pipe, addObjectKeys } = require('../utils.js')
const Reservoir = require('../entities/reservoir.js')
const Parcel = require('../entities/parcel.js')
const Player = require('../entities/player.js')
const Gotchiverse = require('../entities/gotchiverse.js')
const Wallet = require('../entities/wallet.js')

function destroyInstallation(gotchiverseIn, playerIndex, parcelIndex, installationIndex) {
    let gotchiverseOut = structuredClone(gotchiverseIn)
    const installationToDestroy = gotchiverseOut.players[playerIndex].parcels[parcelIndex].installations[installationIndex]
    const buildCosts = gotchiverseOut.rules.installations[installationToDestroy.type].buildCosts
    const destroyRate = gotchiverseOut.rules.destroyInstallationValueRate
    gotchiverseOut.players[playerIndex].parcels[parcelIndex] = Parcel.removeInstallation(gotchiverseOut.players[playerIndex].parcels[parcelIndex], installationIndex)
    const totalCostOfInstallation = buildCosts.slice(0,installationToDestroy.buildLevel).reduce((total, current) => addObjectKeys(total, current), {})
    gotchiverseOut.players[playerIndex] = Player.addTokens(gotchiverseOut.players[playerIndex], totalCostOfInstallation, destroyRate)
    return gotchiverseOut
}

module.exports = {
    destroyInstallation
}