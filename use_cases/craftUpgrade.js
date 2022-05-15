
const { spendOnCrafting } = require('./spendOnCrafting.js')

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

module.exports = {
   craftUpgrade,
   levelUpIfUpgradeComplete
}