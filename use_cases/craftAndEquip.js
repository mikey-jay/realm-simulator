const Installation = require('../entities/installation.js')
const parcel = require('../entities/parcel.js')
const Parcel = require('../entities/parcel.js')
const { craftUpgrade } = require('./craftUpgrade.js')
const { spendOnCrafting } = require('./spendOnCrafting.js')

function craftAndEquipInstallation (gotchiverseIn, playerIndex, parcelIndex, installationType) {
    let gotchiverseOut = structuredClone(gotchiverseIn)
    let installation = Installation.create(installationType)
    let parcelSize = gotchiverseOut.players[playerIndex].parcels[parcelIndex].size
    let maxInstallationsAllowed = gotchiverseOut.rules.installations[installation.type].maxQuantityPerParcel[parcelSize]
    const prerequisites = gotchiverseOut.rules.installations[installation.type].prerequisites

    if ((typeof maxInstallationsAllowed != 'undefined') && Parcel.getInstallationTypeCount(gotchiverseOut.players[playerIndex].parcels[parcelIndex], installation.type) >= maxInstallationsAllowed)
        throw new Error (`maximum installations of type ${installation.type} has been reached for this parcel`)
    
    prerequisites.forEach((type) => {
        if (Parcel.getInstallationTypeCount(gotchiverseOut.players[playerIndex].parcels[parcelIndex], type) < 1)
            throw new Error (`parcel is missing prerequisite installation type ${type}`)
    })

    installation.width = gotchiverseOut.rules.installations[installation.type].width
    installation.height = gotchiverseOut.rules.installations[installation.type].height

    gotchiverseOut.players[playerIndex].parcels[parcelIndex] = Parcel.addInstallation(gotchiverseIn.players[playerIndex].parcels[parcelIndex], installation)

    // upgrade from level 0 to level 1
    return craftUpgrade(gotchiverseOut, playerIndex, parcelIndex, gotchiverseOut.players[playerIndex].parcels[parcelIndex].installations.length - 1)
}

function craftAndEquipAltar(gotchiverseIn, playerIndex, parcelIndex) {
    return craftAndEquipInstallation(gotchiverseIn, playerIndex, parcelIndex, 'altar')
}

function craftAndEquipReservoir(gotchiverseIn, playerIndex, parcelIndex) {
    return craftAndEquipInstallation(gotchiverseIn, playerIndex, parcelIndex, 'reservoir')
}

function craftAndEquipHarvester(gotchiverseIn, playerIndex, parcelIndex) {
    return craftAndEquipInstallation(gotchiverseIn, playerIndex, parcelIndex, 'harvester')
}

function craftAndEquipMaker(gotchiverseIn, playerIndex, parcelIndex) {
    return craftAndEquipInstallation(gotchiverseIn, playerIndex, parcelIndex, 'maker')
}

module.exports = {
    craftAndEquipInstallation,
    craftAndEquipAltar,
    craftAndEquipReservoir,
    craftAndEquipHarvester,
    craftAndEquipMaker
}