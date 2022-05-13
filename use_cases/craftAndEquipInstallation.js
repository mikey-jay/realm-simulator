const Installation = require('../entities/installation.js')
const Parcel = require('../entities/parcel.js')
const Player = require('../entities/player.js')

module.exports = function (gotchiverseIn, playerIndex, parcelIndex, installationType) {
    let gotchiverseOut = structuredClone(gotchiverseIn)
    let installation = Installation.create(installationType)
    let parcelSize = gotchiverseOut.players[playerIndex].parcels[parcelIndex].size
    let maxInstallationsAllowed = gotchiverseOut.rules.installations[installation.type].maxQuantityPerParcel[parcelSize]
    if ((typeof maxInstallationsAllowed != 'undefined') && Parcel.getInstallationTypeCount(gotchiverseOut.players[playerIndex].parcels[parcelIndex], installation.type) >= maxInstallationsAllowed)
        throw new Error (`maximum installations of type ${installation.type} has been reached for this parcel`)
    installation.width = gotchiverseOut.rules.installations[installation.type].width
    installation.height = gotchiverseOut.rules.installations[installation.type].height
    installation = Installation.addBuildTime(installation, gotchiverseOut.rules.installations[installationType].buildTime[0])
    if (installation.buildTimeRemaining <= 0)
        installation.level = installation.buildLevel
    gotchiverseOut.players[playerIndex].parcels[parcelIndex] = Parcel.addInstallation(gotchiverseIn.players[playerIndex].parcels[parcelIndex], installation)
    gotchiverseOut.players[playerIndex] = Player.removeTokens(gotchiverseOut.players[playerIndex], gotchiverseOut.rules.installations[installationType].buildCosts[0])
    return gotchiverseOut
}