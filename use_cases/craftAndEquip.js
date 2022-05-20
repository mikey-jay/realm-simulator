const Installation = require('../entities/installation.js')
const Harvester = require('../entities/harvester.js')
const Reservoir = require('../entities/reservoir.js')
const Maker = require('../entities/installation.js')
const Altar = require('../entities/installation.js')
const Parcel = require('../entities/parcel.js')
const { craftUpgrade } = require('./craftUpgrade.js')

function craftAndEquipInstallation (gotchiverseIn, playerIndex, parcelIndex, installationTypeOrFactory, ...factoryArgs) {
    let gotchiverseOut = structuredClone(gotchiverseIn)
    let installation = (typeof installationTypeOrFactory == 'function') ? installationTypeOrFactory(...factoryArgs) : Installation.create(installationTypeOrFactory)

    if (hasReachedMaxOfType(gotchiverseOut, playerIndex, parcelIndex, installation.type))
        throw new Error (`maximum installations of type ${installation.type} has been reached for this parcel`)

    if (hasReachedMaxOfClass(gotchiverseOut, playerIndex, parcelIndex, installation.class))
        throw new Error (`maximum installations of class ${installation.class} has been reached for this parcel`)
    
    const missingPrerequisiteTypes = getMissingPrerequisiteTypes(gotchiverseOut, playerIndex, parcelIndex, installation.type)

    if (missingPrerequisiteTypes.length > 0)
        throw new Error (`parcel is missing prerequisite installation types: ${missingPrerequisiteTypes.join(',')}`)

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

const craftAndEquipFudReservoir = (...args) => craftAndEquipReservoir (...args, 'fud')
const craftAndEquipFomoReservoir = (...args) => craftAndEquipReservoir (...args, 'fomo')
const craftAndEquipAlphaReservoir = (...args) => craftAndEquipReservoir (...args, 'alpha')
const craftAndEquipKekReservoir = (...args) => craftAndEquipReservoir (...args, 'kek')

function craftAndEquipMaker(gotchiverseIn, playerIndex, parcelIndex) {
    return craftAndEquipInstallation(gotchiverseIn, playerIndex, parcelIndex, Maker.create)
}

function hasReachedMaxOfType (gotchiverseIn, playerIndex, parcelIndex, installationType) {
    let parcelSize = gotchiverseIn.players[playerIndex].parcels[parcelIndex].size
    let maxInstallationsAllowed = gotchiverseIn.rules.installations[installationType].maxQuantityPerParcel[parcelSize]

    return ((typeof maxInstallationsAllowed != 'undefined') && Parcel.getInstallationTypeCount(gotchiverseIn.players[playerIndex].parcels[parcelIndex], installationType) >= maxInstallationsAllowed)
}

function hasReachedMaxOfClass (gotchiverseIn, playerIndex, parcelIndex, installationClass) {
    let parcelSize = gotchiverseIn.players[playerIndex].parcels[parcelIndex].size
    let maxClassInstallationsAllowedPerParcelSize = gotchiverseIn.rules.maxQuantityPerInstallationClass[installationClass]
    let maxClassInstallationsAllowed = (typeof maxClassInstallationsAllowedPerParcelSize != 'undefined') ? maxClassInstallationsAllowedPerParcelSize[parcelSize] : undefined

    return ((typeof maxClassInstallationsAllowed != 'undefined') && Parcel.getInstallationClassCount(gotchiverseIn.players[playerIndex].parcels[parcelIndex], installationClass) >= maxClassInstallationsAllowed)
}

function getMissingPrerequisiteTypes (gotchiverseIn, playerIndex, parcelIndex, installationType) {
    const prerequisites = gotchiverseIn.rules.installations[installationType].prerequisites
    return prerequisites.filter((type) => Parcel.getInstallationTypeCount(gotchiverseIn.players[playerIndex].parcels[parcelIndex], type) < 1)
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
    craftAndEquipKekHarvester,
    craftAndEquipFudReservoir,
    craftAndEquipFomoReservoir,
    craftAndEquipAlphaReservoir,
    craftAndEquipKekReservoir,
    hasReachedMaxOfClass,
    hasReachedMaxOfType,
    getMissingPrerequisiteTypes
}