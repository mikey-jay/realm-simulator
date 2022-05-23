const Player = require('../entities/player.js')
const Parcel = require('../entities/parcel.js')
const Installation = require('../entities/installation.js')
const { craftAndEquipFudHarvester, hasReachedMaxOfType, hasReachedMaxOfClass, getMissingPrerequisiteTypes, craftAndEquipAltar, craftAndEquipMaker, craftAndEquipFomoHarvester, craftAndEquipAlphaHarvester, craftAndEquipKekHarvester, craftAndEquipFudReservoir, craftAndEquipFomoReservoir, craftAndEquipAlphaReservoir, craftAndEquipKekReservoir } = require('../use_cases/craftAndEquip.js')
const { addObjectKeys, pipe } = require('../utils.js')
const { upgradeLowestLevelAltar, upgradeLowestLevelMaker, upgradeLowestLevelFudHarvester, upgradeLowestLevelFomoHarvester, upgradeLowestLevelAlphaHarvester, upgradeLowestLevelKekHarvester, upgradeLowestLevelFudReservoir, upgradeLowestLevelFomoReservoir, upgradeLowestLevelAlphaReservoir, upgradeLowestLevelKekReservoir, upgradeHighestLevelAltar, upgradeHighestLevelMaker, upgradeHighestLevelFudHarvester, upgradeHighestLevelFomoHarvester, upgradeHighestLevelAlphaHarvester, upgradeHighestLevelKekHarvester, upgradeHighestLevelFudReservoir, upgradeHighestLevelFomoReservoir, upgradeHighestLevelAlphaReservoir, upgradeHighestLevelKekReservoir, getMaxConcurrentUpgradeLimit } = require('../use_cases/craftUpgrade.js')
const { getWalletValueInFudTerms } = require('../use_cases/getWalletValueInFudTerms.js')

module.exports = (verseIn, playerIndex, parcelIndex, tokensToFarm = ['fud', 'fomo', 'alpha', 'kek'], upgradeHarvestersBeforeCraftingMore = false) => {
    const mostAbundantToken = getMostAbundantTokenInParcel(verseIn, playerIndex, parcelIndex, tokensToFarm)
    const args = [verseIn, playerIndex, parcelIndex, mostAbundantToken]
    const canCraftAHarvester = !hasReachedMaxOfClass(verseIn, playerIndex, parcelIndex, 'harvester')
    const canUpgradeAHarvester =
        getLowestBuildLevelOfHarvesters(verseIn, playerIndex, parcelIndex, mostAbundantToken) < verseIn.rules.installations[`harvester_${mostAbundantToken}`].maxLevel
        && Parcel.getInstallationTypeCount(verseIn.players[playerIndex].parcels[parcelIndex], `harvester_${mostAbundantToken}`)
    if (upgradeHarvestersBeforeCraftingMore) {
        return canUpgradeAHarvester ? upgradeLowestLevelHarvesterOfType(...args) : craftHarvestersOfType(...args)
    }
    return canCraftAHarvester ? craftHarvestersOfType(...args) : upgradeLowestLevelHarvesterOfType(...args) 
}

function getLowestBuildLevelOfHarvesters(verseIn, playerIndex, parcelIndex, token) {
    const myParcel = verseIn.players[playerIndex].parcels[parcelIndex]
    const lowestBuildLevelHarvester = Parcel.getIndexOfLowestBuildLevelInstallation(myParcel, `harvester_${token}`)
    return lowestBuildLevelHarvester.buildLevel || 0
}

function getLowestBuildLevelOfHarvesters(verseIn, playerIndex, parcelIndex, token) {
    const myParcel = verseIn.players[playerIndex].parcels[parcelIndex]
    const lowestBuildLevelHarvesterIndex = Parcel.getIndexOfLowestBuildLevelInstallation(myParcel, `harvester_${token}`)
    const lowestBuildLevelHarvester = myParcel.installations[lowestBuildLevelHarvesterIndex]
    if (typeof lowestBuildLevelHarvester == 'undefined')
        return 0
    return lowestBuildLevelHarvester.buildLevel
}

function doesReservoirNeedUpgrade(verseIn, playerIndex, parcelIndex, token) {
    const harvesterType = `harvester_${token}`
    const reservoirType = `reservoir_${token}`
    const me = verseIn.players[playerIndex]
    const myParcel = me.parcels[parcelIndex]
    const reservoirCount = Parcel.getInstallationTypeCount(myParcel, reservoirType)
    const maxReservoirEmptiesPerDay = verseIn.rules.maxReservoirEmptiesPerDay
    const totalHarvestRate = getTotalHarvestRates(verseIn, playerIndex, parcelIndex)[token]
    const totalReservoirCapacity = getTotalReservoirCapacitiesIncludingUpgradesInProgress(verseIn, playerIndex, parcelIndex)[token]

    if (totalReservoirCapacity == 0 || totalHarvestRate / totalReservoirCapacity > maxReservoirEmptiesPerDay)
        return true

    return false

}

function craftHarvestersOfType(verseIn, playerIndex, parcelIndex, tokenToFarm) {
    const harvesterType = `harvester_${tokenToFarm}`
    const reservoirType = `reservoir_${tokenToFarm}`
    const me = verseIn.players[playerIndex]
    const myParcel = me.parcels[parcelIndex]
    const reservoirCount = Parcel.getInstallationTypeCount(myParcel, reservoirType)
    const maxReservoirEmptiesPerDay = verseIn.rules.maxReservoirEmptiesPerDay
    const totalHarvestRate = getTotalHarvestRates(verseIn, playerIndex, parcelIndex)[tokenToFarm]
    const totalReservoirCapacity = getTotalReservoirCapacitiesIncludingUpgradesInProgress(verseIn, playerIndex, parcelIndex)[tokenToFarm]

    if (reservoirCount == 0)
        return craftNewInstallation(verseIn, playerIndex, parcelIndex, reservoirType)

    if (doesReservoirNeedUpgrade(verseIn, playerIndex, parcelIndex, tokenToFarm))
        return upgradeLowestLevelInstallation(verseIn, playerIndex, parcelIndex, reservoirType)

    return craftNewInstallation(verseIn, playerIndex, parcelIndex, harvesterType)
}

function getTotalHarvestRates(verseIn, playerIndex, parcelIndex) {
    const harvesters = Parcel.getInstallationsOfClass(verseIn.players[playerIndex].parcels[parcelIndex], 'harvester').filter((h) => h.level > 0)
    const getHarvestRate = (h) => {
        let rate = { fud: 0, fomo: 0, alpha: 0, kek: 0 }
        rate[h.resourceToken] = verseIn.rules.installations[h.type].harvestRates[h.level - 1]
        return rate
    }
    const harvestRates = harvesters.map(getHarvestRate)
    const totalHarvestRate = harvestRates.reduce((total, current) => addObjectKeys(total, current), { fud: 0, fomo: 0, alpha: 0, kek: 0 })
    return totalHarvestRate
}

function getTotalReservoirCapacitiesIncludingUpgradesInProgress(verseIn, playerIndex, parcelIndex) {
    const reservoirs = Parcel.getInstallationsOfClass(verseIn.players[playerIndex].parcels[parcelIndex], 'reservoir').filter((h) => h.level > 0)
    const getReservoirCapacity = (r) => {
        let capacity = { fud: 0, fomo: 0, alpha: 0, kek: 0 }
        capacity[r.resourceToken] = verseIn.rules.installations[r.type].capacities[r.buildLevel - 1]
        return capacity
    }
    const reservoirCapacities = reservoirs.map(getReservoirCapacity)
    const totalReservoirCapacities = reservoirCapacities.reduce((total, current) => addObjectKeys(total, current), { fud: 0, fomo: 0, alpha: 0, kek: 0 })
    return totalReservoirCapacities
}

const upgradeLowestLevelInstallation = (...args) => upgradeInstallation(...args, true)
const upgradeHighestLevelInstallation = (...args) => upgradeInstallation(...args, false)

const upgradeLowestLevelHarvesterOfType = (gotchiverseIn, playerIndex, parcelIndex, token) => {
    const installationTypeToUpgrade = doesReservoirNeedUpgrade(gotchiverseIn, playerIndex,parcelIndex, token) ? `reservoir_${token}` : `harvester_${token}`
    return upgradeLowestLevelInstallation(gotchiverseIn, playerIndex, parcelIndex, installationTypeToUpgrade)
}

function upgradeInstallation(gotchiverseIn, playerIndex, parcelIndex, installationType, upgradeLowest = true) {

    const me = gotchiverseIn.players[playerIndex]
    const myParcel = me.parcels[parcelIndex]

    const installationToUpgrade = myParcel.installations[Parcel.getIndexOfLowestLevelInstallation(myParcel, installationType)]
    
    if (typeof installationToUpgrade == 'undefined')
        return false

    if (installationToUpgrade.level < installationToUpgrade.buildLevel)
        return false
    
    if (installationToUpgrade.level >= gotchiverseIn.rules.installations[installationType].maxLevel)
        return false

    const buildCosts = gotchiverseIn.rules.installations[installationType].buildCosts[installationToUpgrade.level]
    if (!Player.hasSufficientTokens(me, buildCosts))
        return false
    
    const levelPrerequisite = gotchiverseIn.rules.installations[installationType].levelPrerequisite
    if (typeof levelPrerequisite != 'undefined') {
        const limiter = myParcel.installations[Parcel.getIndexOfHighestLevelInstallation(myParcel, levelPrerequisite)]
        if (typeof limiter == 'undefined')
            return craftNewInstallation(gotchiverseIn, playerIndex, parcelIndex, levelPrerequisite)
        if (limiter.level <= installationToUpgrade.level)
            return upgradeHighestLevelInstallation(gotchiverseIn, playerIndex, parcelIndex, levelPrerequisite)
    }

    let concurrentUpgrades = Parcel.getCurrentUpgradeCount(gotchiverseIn.players[playerIndex].parcels[parcelIndex])
    let maxConcurrentUpgradeLimit = getMaxConcurrentUpgradeLimit(gotchiverseIn, playerIndex, parcelIndex)
    let canCraftAMaker = Parcel.getInstallationTypeCount(myParcel, 'maker') < gotchiverseIn.rules.installations.maker.maxQuantityPerParcel[myParcel.size]

    if (concurrentUpgrades >= maxConcurrentUpgradeLimit)
        return canCraftAMaker ? craftAndEquipMaker : false

    if (installationType != 'maker') {
        const lowestLevelMaker = myParcel.installations[Parcel.getIndexOfLowestLevelInstallation(myParcel, 'maker')]

        if (!canCraftAMaker && (typeof lowestLevelMaker != 'undefined') && concurrentUpgrades >= maxConcurrentUpgradeLimit - 1) {
            const canUpgradeMaker = (lowestLevelMaker.level >= lowestLevelMaker.buildLevel) && (lowestLevelMaker.level < gotchiverseIn.rules.installations.maker.maxLevel)
            if (canUpgradeMaker)
                return upgradeLowestLevelInstallation(gotchiverseIn, playerIndex, parcelIndex, 'maker')
        }
    }

    switch (installationType) {
        case 'altar':
            return upgradeLowest ? upgradeLowestLevelAltar : upgradeHighestLevelAltar
        case 'maker':
            return upgradeLowest ? upgradeLowestLevelMaker : upgradeHighestLevelMaker
        case 'harvester_fud':
            return upgradeLowest ? upgradeLowestLevelFudHarvester : upgradeHighestLevelFudHarvester
        case 'harvester_fomo':
            return upgradeLowest ? upgradeLowestLevelFomoHarvester : upgradeHighestLevelFomoHarvester
        case 'harvester_alpha':
            return upgradeLowest ? upgradeLowestLevelAlphaHarvester : upgradeHighestLevelAlphaHarvester
        case 'harvester_kek':
            return upgradeLowest ? upgradeLowestLevelKekHarvester : upgradeHighestLevelKekHarvester
        case 'reservoir_fud':
            return upgradeLowest ? upgradeLowestLevelFudReservoir : upgradeHighestLevelFudReservoir
        case 'reservoir_fomo':
            return upgradeLowest ? upgradeLowestLevelFomoReservoir : upgradeHighestLevelFomoReservoir
        case 'reservoir_alpha':
            return upgradeLowest ? upgradeLowestLevelAlphaReservoir : upgradeHighestLevelAlphaReservoir
        case 'reservoir_kek':
            return upgradeLowest ? upgradeLowestLevelKekReservoir  : upgradeHighestLevelKekReservoir
    }
}

function craftNewInstallation(verseIn, playerIndex, parcelIndex, installationType) {
    const installationClass = verseIn.rules.installations[installationType].class
    const me = verseIn.players[playerIndex]
    const myParcel = me.parcels[parcelIndex]
    const buildCosts = verseIn.rules.installations[installationType].buildCosts[0]
    const prerequisite = getMissingPrerequisiteTypes(verseIn, playerIndex, parcelIndex, installationType)[0]

    if (prerequisite == 'altar')
        return craftAndEquipAltar
    if (!Parcel.hasSpaceForInstallation(myParcel, Installation.create(installationType)))
        return false
    if (hasReachedMaxOfType(verseIn, playerIndex, parcelIndex, installationType))
        return false
    if (hasReachedMaxOfClass(verseIn, playerIndex, parcelIndex, installationClass))
        return false
    if (!Player.hasSufficientTokens(me, buildCosts))
        return false

    switch (installationType) {
        case 'altar':
            return craftAndEquipAltar
        case 'maker':
            return craftAndEquipMaker
        case 'harvester_fud':
            return craftAndEquipFudHarvester
        case 'harvester_fomo':
            return craftAndEquipFomoHarvester
        case 'harvester_alpha':
            return craftAndEquipAlphaHarvester
        case 'harvester_kek':
            return craftAndEquipKekHarvester
        case 'reservoir_fud':
            return craftAndEquipFudReservoir
        case 'reservoir_fomo':
            return craftAndEquipFomoReservoir
        case 'reservoir_alpha':
            return craftAndEquipAlphaReservoir
        case 'reservoir_kek':
            return craftAndEquipKekReservoir
    }
}