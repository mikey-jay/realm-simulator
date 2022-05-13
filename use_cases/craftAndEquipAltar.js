const Altar = require('../entities/altar.js')
const Parcel = require('../entities/parcel.js')
const Player = require('../entities/player.js')

module.exports = function (gotchiverseIn, playerIndex, parcelIndex) {
    let gotchiverseOut = structuredClone(gotchiverseIn)
    let a = Altar.create()
    let parcelSize = gotchiverseOut.players[playerIndex].parcels[parcelIndex].size
    let maxAltarsAllowed = gotchiverseOut.rules.installations[a.type].maxQuantityPerParcel[parcelSize]
    if ((typeof maxAltarsAllowed != 'undefined') && Parcel.getInstallationTypeCount(gotchiverseOut.players[playerIndex].parcels[parcelIndex], a.type) >= maxAltarsAllowed)
        throw new Error (`maximum installations of type ${a.type} has been reached for this parcel`)
    a.width = gotchiverseOut.rules.installations[a.type].width
    a.height = gotchiverseOut.rules.installations[a.type].height
    a = Altar.addBuildTime(a, gotchiverseOut.rules.installations.altar.buildTime[0])
    if (a.buildTimeRemaining <= 0)
        a.level = a.buildLevel
    gotchiverseOut.players[playerIndex].parcels[parcelIndex] = Parcel.addInstallation(gotchiverseIn.players[playerIndex].parcels[parcelIndex], a)
    gotchiverseOut.players[playerIndex] = Player.removeTokens(gotchiverseOut.players[playerIndex], gotchiverseOut.rules.installations.altar.buildCosts[0])
    return gotchiverseOut
}