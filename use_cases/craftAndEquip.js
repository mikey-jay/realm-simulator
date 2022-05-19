const Installation = require('../entities/installation.js')
const Harvester = require('../entities/harvester.js')
const Reservoir = require('../entities/reservoir.js')
const Maker = require('../entities/installation.js')
const Altar = require('../entities/installation.js')
const Parcel = require('../entities/parcel.js')
const { craftUpgrade } = require('./craftUpgrade.js')
const { spendOnCrafting } = require('./spendOnCrafting.js')

function craftAndEquipInstallation (gotchiverseIn, playerIndex, parcelIndex, installationTypeOrFactory, ...factoryArgs) {
    let gotchiverseOut = structuredClone(gotchiverseIn)
    let installation = (typeof installationTypeOrFactory == 'function') ? installationTypeOrFactory(...factoryArgs) : Installation.create(installationTypeOrFactory)
    let parcelSize = gotchiverseOut.players[playerIndex].parcels[parcelIndex].size
    let maxInstallationsAllowed = gotchiverseOut.rules.installations[installation.type].maxQuantityPerParcel[parcelSize]
    let maxClassInstallationsAllowedPerParcelSize = gotchiverseOut.rules.maxQuantityPerInstallationClass[installation.class]
    let maxClassInstallationsAllowed = (typeof maxClassInstallationsAllowedPerParcelSize != 'undefined') ? maxClassInstallationsAllowedPerParcelSize[parcelSize] : undefined

    const prerequisites = gotchiverseOut.rules.installations[installation.type].prerequisites

    if ((typeof maxInstallationsAllowed != 'undefined') && Parcel.getInstallationTypeCount(gotchiverseOut.players[playerIndex].parcels[parcelIndex], installation.type) >= maxInstallationsAllowed)
        throw new Error (`maximum installations of type ${installation.type} has been reached for this parcel`)

    if ((typeof maxClassInstallationsAllowed != 'undefined') && Parcel.getInstallationClassCount(gotchiverseOut.players[playerIndex].parcels[parcelIndex], installation.class) >= maxClassInstallationsAllowed)
        throw new Error (`maximum installations of class ${installation.class} has been reached for this parcel`)
        
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
    return craftAndEquipInstallation(gotchiverseIn, playerIndex, parcelIndex, Altar.create)
}

function craftAndEquipReservoir(gotchiverseIn, playerIndex, parcelIndex, resourceToken) {
    return craftAndEquipInstallation(gotchiverseIn, playerIndex, parcelIndex, Reservoir.create, resourceToken)
}

function craftAndEquipHarvester(gotchiverseIn, playerIndex, parcelIndex, resourceToken) {
    return craftAndEquipInstallation(gotchiverseIn, playerIndex, parcelIndex, Harvester.create, resourceToken)
}

const craftAndEquipFudHarvester = (...args) => craftAndEquipHarvester (...args, 'fud')
const craftAndEquipFomoHarvester = (...args) => craftAndEquipHarvester (...args, 'fomo')
const craftAndEquipAlphaHarvester = (...args) => craftAndEquipHarvester (...args, 'alpha')
const craftAndEquipKekHarvester = (...args) => craftAndEquipHarvester (...args, 'kek')

function craftAndEquipMaker(gotchiverseIn, playerIndex, parcelIndex) {
    return craftAndEquipInstallation(gotchiverseIn, playerIndex, parcelIndex, 'maker')
}

module.exports = {
    craftAndEquipInstallation,
    craftAndEquipAltar,
    craftAndEquipReservoir,
    craftAndEquipHarvester,
    craftAndEquipMaker,
    craftAndEquipFudHarvester,
    craftAndEquipFomoHarvester,
    craftAndEquipAlphaHarvester,
    craftAndEquipKekHarvester
}