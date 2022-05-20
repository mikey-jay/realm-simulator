
const { spendOnCrafting } = require('./spendOnCrafting.js')
const Parcel = require('../entities/parcel.js')

function craftUpgrade(gotchiverseIn, playerIndex, parcelIndex, installationIndex) {
    let gotchiverseOut = structuredClone(gotchiverseIn)
    const installationType = gotchiverseOut.players[playerIndex].parcels[parcelIndex].installations[installationIndex].type
    const buildLevel = ++gotchiverseOut.players[playerIndex].parcels[parcelIndex].installations[installationIndex].buildLevel
    const currentLevel = gotchiverseOut.players[playerIndex].parcels[parcelIndex].installations[installationIndex].level
    const buildTime = gotchiverseOut.rules.installations[installationType].buildTime[buildLevel - 1]

    if (buildLevel > currentLevel + 1) throw new Error('Can\'t upgrade while an upgrade is already in progress')
    if (buildLevel > 9) throw new Error('Can\'t upgrade - maximum installation level of 9 reached')

    if (buildLevel > getMaxLevelOfInstallationType(gotchiverseIn, playerIndex, parcelIndex, installationType)) throw new Error(`${installationType} cannot exceed maximum level of the highest level ${levelPrerequisite}`)

    let maxConcurrentUpgrades = gotchiverseOut.rules.maxConcurrentUpgrades
    if (typeof maxConcurrentUpgrades != 'undefined') {
        let concurrentUpgrades = Parcel.getCurrentUpgradeCount(gotchiverseOut.players[playerIndex].parcels[parcelIndex])
        const makerLevelCount = Parcel.getInstallationLevelCount(gotchiverseOut.players[playerIndex].parcels[parcelIndex], 'maker')
        for (let l = 0 ; l < makerLevelCount.length ; l++)
            maxConcurrentUpgrades += makerLevelCount[l] * gotchiverseOut.rules.installations.maker.concurrentUpgradeIncreases[l]
        if (concurrentUpgrades > maxConcurrentUpgrades) throw new Error(`Maximum concurrent upgrade limit of ${maxConcurrentUpgrades} has been reached`)
    }
 
    gotchiverseOut.players[playerIndex].parcels[parcelIndex].installations[installationIndex].timeComplete = gotchiverseOut.currentTime + buildTime
    const buildCosts = gotchiverseOut.rules.installations[installationType].buildCosts[buildLevel - 1]
    gotchiverseOut = spendOnCrafting(gotchiverseOut, playerIndex, buildCosts)
    gotchiverseOut = levelUpIfUpgradeComplete(gotchiverseOut, playerIndex, parcelIndex, installationIndex)
    return gotchiverseOut
}

function levelUpIfUpgradeComplete(gotchiverseIn, playerIndex, parcelIndex, installationIndex) {
    const gotchiverseOut = structuredClone(gotchiverseIn)
    if (gotchiverseOut.players[playerIndex].parcels[parcelIndex].installations[installationIndex].timeComplete <= gotchiverseOut.currentTime)
        gotchiverseOut.players[playerIndex].parcels[parcelIndex].installations[installationIndex].level = gotchiverseOut.players[playerIndex].parcels[parcelIndex].installations[installationIndex].buildLevel
    return gotchiverseOut
}

function upgradeLowestLevelInstallationOfType(gotchiverseIn, playerIndex, parcelIndex, installationType) {
    const playerParcel = gotchiverseIn.players[playerIndex].parcels[parcelIndex]
    return craftUpgrade(gotchiverseIn, playerIndex, parcelIndex, Parcel.getIndexOfLowestLevelInstallation(playerParcel, installationType))
}

function upgradeHighestLevelInstallationOfType(gotchiverseIn, playerIndex, parcelIndex, installationType) {
    const playerParcel = gotchiverseIn.players[playerIndex].parcels[parcelIndex]
    return craftUpgrade(gotchiverseIn, playerIndex, parcelIndex, Parcel.getIndexOfHighestLevelInstallation(playerParcel, installationType))
}

const upgradeLowestLevelFudHarvester = (...args) => upgradeLowestLevelInstallationOfType(...args, 'harvester_fud')
const upgradeLowestLevelFomoHarvester = (...args) => upgradeLowestLevelInstallationOfType(...args, 'harvester_fomo')
const upgradeLowestLevelAlphaHarvester = (...args) => upgradeLowestLevelInstallationOfType(...args, 'harvester_alpha')
const upgradeLowestLevelKekHarvester = (...args) => upgradeLowestLevelInstallationOfType(...args, 'harvester_kek')
const upgradeLowestLevelFudReservoir = (...args) => upgradeLowestLevelInstallationOfType(...args, 'reservoir_fud')
const upgradeLowestLevelFomoReservoir = (...args) => upgradeLowestLevelInstallationOfType(...args, 'reservoir_fomo')
const upgradeLowestLevelAlphaReservoir = (...args) => upgradeLowestLevelInstallationOfType(...args, 'reservoir_alpha')
const upgradeLowestLevelKekReservoir = (...args) => upgradeLowestLevelInstallationOfType(...args, 'reservoir_kek')
const upgradeLowestLevelMaker = (...args) => upgradeLowestLevelInstallationOfType(...args, 'maker')
const upgradeLowestLevelAltar = (...args) => upgradeLowestLevelInstallationOfType(...args, 'altar')
const upgradeHighestLevelFudHarvester = (...args) => upgradeHighestLevelInstallationOfType(...args, 'harvester_fud')
const upgradeHighestLevelFomoHarvester = (...args) => upgradeHighestLevelInstallationOfType(...args, 'harvester_fomo')
const upgradeHighestLevelAlphaHarvester = (...args) => upgradeHighestLevelInstallationOfType(...args, 'harvester_alpha')
const upgradeHighestLevelKekHarvester = (...args) => upgradeHighestLevelInstallationOfType(...args, 'harvester_kek')
const upgradeHighestLevelFudReservoir = (...args) => upgradeHighestLevelInstallationOfType(...args, 'reservoir_fud')
const upgradeHighestLevelFomoReservoir = (...args) => upgradeHighestLevelInstallationOfType(...args, 'reservoir_fomo')
const upgradeHighestLevelAlphaReservoir = (...args) => upgradeHighestLevelInstallationOfType(...args, 'reservoir_alpha')
const upgradeHighestLevelKekReservoir = (...args) => upgradeHighestLevelInstallationOfType(...args, 'reservoir_kek')
const upgradeHighestLevelMaker = (...args) => upgradeHighestLevelInstallationOfType(...args, 'maker')
const upgradeHighestLevelAltar = (...args) => upgradeHighestLevelInstallationOfType(...args, 'altar')

function levelUpAllCompletedUpgrades(gotchiverseIn) {
    let gotchiverseOut = structuredClone(gotchiverseIn)
    for (let playerIndex = 0 ; playerIndex < gotchiverseOut.players.length ; playerIndex++) {
        for (let parcelIndex = 0 ; parcelIndex < gotchiverseOut.players[playerIndex].parcels.length ; parcelIndex++) {
           for (let installationIndex = 0 ; installationIndex < gotchiverseOut.players[playerIndex].parcels[parcelIndex].installations.length ; installationIndex++) {
               gotchiverseOut = levelUpIfUpgradeComplete(gotchiverseOut, playerIndex, parcelIndex, installationIndex)
           }
        }
    }
    return gotchiverseOut
}

function getMaxLevelOfInstallationType(gotchiverseIn, playerIndex, parcelIndex, installationType) {
    const levelPrerequisite = gotchiverseIn.rules.installations[installationType].levelPrerequisite

    if (typeof levelPrerequisite == 'undefined') return gotchiverseIn.rules.installations[installationType].maxLevel

    return Math.max(0,...gotchiverseIn.players[playerIndex].parcels[parcelIndex].installations.filter((i) => levelPrerequisite == i.type).map((i) => i.level))
}

module.exports = {
   craftUpgrade,
   levelUpIfUpgradeComplete,
   levelUpAllCompletedUpgrades,
   upgradeLowestLevelInstallationOfType,
   upgradeLowestLevelFudHarvester,
   upgradeLowestLevelFomoHarvester,
   upgradeLowestLevelAlphaHarvester,
   upgradeLowestLevelKekHarvester,
   upgradeLowestLevelFudReservoir,
   upgradeLowestLevelFomoReservoir,
   upgradeLowestLevelAlphaReservoir,
   upgradeLowestLevelKekReservoir,
   upgradeLowestLevelAltar,
   upgradeLowestLevelMaker,
   upgradeHighestLevelInstallationOfType,
    upgradeHighestLevelFudHarvester,
    upgradeHighestLevelFomoHarvester,
    upgradeHighestLevelAlphaHarvester,
    upgradeHighestLevelKekHarvester,
    upgradeHighestLevelFudReservoir,
    upgradeHighestLevelFomoReservoir,
    upgradeHighestLevelAlphaReservoir,
    upgradeHighestLevelKekReservoir,
    upgradeHighestLevelAltar,
    upgradeHighestLevelMaker,
   getMaxLevelOfInstallationType
}