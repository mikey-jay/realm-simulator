const Altar = require('../entities/altar.js')
const Parcel = require('../entities/parcel.js')
const Player = require('../entities/player.js')
const craftAndEquipInstallation = require('./craftAndEquipInstallation.js')

module.exports = function (gotchiverseIn, playerIndex, parcelIndex) {
    return craftAndEquipInstallation(gotchiverseIn, playerIndex, parcelIndex, Altar.create().type)
}