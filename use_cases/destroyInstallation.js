const { pipe, addObjectKeys } = require('../utils.js')
const Reservoir = require('../entities/reservoir.js')
const Parcel = require('../entities/parcel.js')
const Player = require('../entities/player.js')
const Gotchiverse = require('../entities/gotchiverse.js')
const Wallet = require('../entities/wallet.js')

function destroyInstallation(gotchiverseIn, playerIndex, parcelIndex, installationIndex) {
    let gotchiverseOut = structuredClone(gotchiverseIn)
    const installationToDestroy = gotchiverseOut.players[playerIndex].parcels[parcelIndex].installations[installationIndex]
    const destroyValue = getDestroyValueOfInstallation(gotchiverseOut, playerIndex, parcelIndex, installationIndex)
    gotchiverseOut.players[playerIndex].parcels[parcelIndex] = Parcel.removeInstallation(gotchiverseOut.players[playerIndex].parcels[parcelIndex], installationIndex)
    gotchiverseOut.players[playerIndex] = Player.addTokens(gotchiverseOut.players[playerIndex], destroyValue)
    return gotchiverseOut
}

function destroyAllInstallations(gotchiverseIn, playerIndex, parcelIndex) {
    let gotchiverseOut = structuredClone(gotchiverseIn)
    while (gotchiverseOut.players[playerIndex].parcels[parcelIndex].installations.length > 0)
        gotchiverseOut = destroyInstallation(gotchiverseOut, playerIndex, parcelIndex, 0)
    return gotchiverseOut
}

function getDestroyValueOfAllInstallations(gotchiverseIn, playerIndex, parcelIndex) {
    let destroyValue = Wallet.create().tokens
    for (let i = 0 ; i < gotchiverseIn.players[playerIndex].parcels[parcelIndex].installations.length ; i++) {
        destroyValue = addObjectKeys(destroyValue, getDestroyValueOfInstallation(gotchiverseIn, playerIndex, parcelIndex, i))
    }
    return destroyValue
}

function getDestroyValueOfInstallation(gotchiverseIn, playerIndex, parcelIndex, installationIndex) {
    const installationToDestroy = gotchiverseIn.players[playerIndex].parcels[parcelIndex].installations[installationIndex]
    const buildCosts = gotchiverseIn.rules.installations[installationToDestroy.type].buildCosts
    const destroyRate = gotchiverseIn.rules.destroyInstallationValueRate
    const totalCostOfInstallation = buildCosts.slice(0,installationToDestroy.buildLevel).reduce((total, current) => addObjectKeys(total, current), {})
    return pipe(Wallet.create(), [Wallet.addTokens, totalCostOfInstallation, destroyRate]).tokens
}

module.exports = {
    destroyInstallation,
    destroyAllInstallations,
    getDestroyValueOfAllInstallations
}