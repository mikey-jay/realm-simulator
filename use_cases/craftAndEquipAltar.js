const Altar = require('../entities/altar.js')
const Parcel = require('../entities/parcel.js')

module.exports = function (gotchiverseIn, playerIndex, parcelIndex) {
    let gotchiverseOut = { ...gotchiverseIn }
    let a = Altar.create()
    gotchiverseOut.players[playerIndex].parcels[parcelIndex] = Parcel.addInstallation(gotchiverseIn.players[playerIndex].parcels[parcelIndex], a)
    return gotchiverseOut
}