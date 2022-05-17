
const { spendOnCrafting } = require('./spendOnCrafting.js')
const Parcel = require('../entities/parcel.js')

function craftUpgrade(gotchiverseIn, playerIndex, parcelIndex, installationIndex) {
    let gotchiverseOut = structuredClone(gotchiverseIn)
    const installationType = gotchiverseOut.players[playerIndex].parcels[parcelIndex].installations[installationIndex].type
    const buildLevel = ++gotchiverseOut.players[playerIndex].parcels[parcelIndex].installations[installationIndex].buildLevel
    const currentLevel = gotchiverseOut.players[playerIndex].parcels[parcelIndex].installations[installationIndex].level
    const levelPrerequisite = gotchiverseOut.rules.installations[installationType].levelPrerequisite
    const buildTime = gotchiverseOut.rules.installations[installationType].buildTime[buildLevel - 1]

    if (buildLevel > currentLevel + 1) throw new Error('Can\'t upgrade while an upgrade is already in progress')
    if (buildLevel > 9) throw new Error('Can\'t upgrade - maximum installation level of 9 reached')

    if (typeof levelPrerequisite != 'undefined') {
        const maxLevel = Math.max(0,...gotchiverseOut.players[playerIndex].parcels[parcelIndex].installations.filter((i) => levelPrerequisite == i.type).map((i) => i.level))
        if (buildLevel > maxLevel) throw new Error(`${installationType} cannot exceed maximum level of the highest level ${levelPrerequisite}`)
    }

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

module.exports = {
   craftUpgrade,
   levelUpIfUpgradeComplete,
   levelUpAllCompletedUpgrades
}