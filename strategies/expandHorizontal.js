const Player = require('../entities/player.js')
const Parcel = require('../entities/parcel.js')
const Installation = require('../entities/installation.js')
const { craftAndEquipFudHarvester, hasReachedMaxOfType, hasReachedMaxOfClass, getMissingPrerequisiteTypes, craftAndEquipAltar, craftAndEquipMaker, craftAndEquipFomoHarvester, craftAndEquipAlphaHarvester, craftAndEquipKekHarvester, craftAndEquipFudReservoir, craftAndEquipFomoReservoir, craftAndEquipAlphaReservoir, craftAndEquipKekReservoir } = require('../use_cases/craftAndEquip.js')
const { addObjectKeys, pipe, sumArray } = require('../utils.js')
const { upgradeLowestLevelAltar, upgradeLowestLevelMaker, upgradeLowestLevelFudHarvester, upgradeLowestLevelFomoHarvester, upgradeLowestLevelAlphaHarvester, upgradeLowestLevelKekHarvester, upgradeLowestLevelFudReservoir, upgradeLowestLevelFomoReservoir, upgradeLowestLevelAlphaReservoir, upgradeLowestLevelKekReservoir, upgradeHighestLevelAltar, upgradeHighestLevelMaker, upgradeHighestLevelFudHarvester, upgradeHighestLevelFomoHarvester, upgradeHighestLevelAlphaHarvester, upgradeHighestLevelKekHarvester, upgradeHighestLevelFudReservoir, upgradeHighestLevelFomoReservoir, upgradeHighestLevelAlphaReservoir, upgradeHighestLevelKekReservoir, getMaxConcurrentUpgradeLimit } = require('../use_cases/craftUpgrade.js')
const { getParcelTokensInOrderOfAbundance } = require('../use_cases/getParcelTokensInOrderOfAbundance.js')
const { getIndexOfHighestLevelInstallation, getIndexOfLowestLevelInstallation } = require('../entities/parcel.js')
const { getTotalHarvestRates } = require('../use_cases/getTotalHarvestRates.js')

module.exports = (verseIn, playerIndex, parcelIndex, tokensToFarm = ['fud', 'fomo', 'alpha', 'kek'], upgradeHarvestersBeforeCraftingMore = false, maxLevelOfHarvesters = 9) => {
    const tokensInOrderOfAbundance = getParcelTokensInOrderOfAbundance(verseIn, playerIndex, parcelIndex, tokensToFarm)
    const maxDesiredAltarLevel = getMaximumDesiredAltarLevel(verseIn, playerIndex, parcelIndex)
    maxLevelOfHarvesters = Math.min(maxLevelOfHarvesters, maxDesiredAltarLevel)
    for (let i = 0 ; i < tokensInOrderOfAbundance.length ; i++) {
        const craftStrategy = craftOrUpgradeHarvestersOfToken(verseIn, playerIndex, parcelIndex, tokensInOrderOfAbundance[i], upgradeHarvestersBeforeCraftingMore, maxLevelOfHarvesters)
        if (craftStrategy)
            return craftStrategy
    }
    return false
}

function craftOrUpgradeHarvestersOfToken (verseIn, playerIndex, parcelIndex, tokenToFarm, upgradeHarvestersBeforeCraftingMore = false, maxLevelOfHarvesters = 9) {
    const args = [verseIn, playerIndex, parcelIndex, tokenToFarm]
    const canCraftAHarvester = !hasReachedMaxOfClass(verseIn, playerIndex, parcelIndex, 'harvester') && !(hasReachedMaxOfType(verseIn, playerIndex, parcelIndex, `harvester_${tokenToFarm}`) && !doesUpgradingMakerIncreaseHarvesterLimit(verseIn, playerIndex, parcelIndex, tokenToFarm))
    const maxDesiredHarvestRate = getMaximumDesiredHarvestRate(verseIn, playerIndex, parcelIndex, tokenToFarm)
    const currentHarvestRate = getTotalHarvestRates(verseIn, playerIndex, parcelIndex)[tokenToFarm]
    const myParcel = verseIn.players[playerIndex].parcels[parcelIndex]
    if (isLastRound(verseIn) && Parcel.getTokenBalance(myParcel, tokenToFarm) <= 0)
        return false
    if (currentHarvestRate >= maxDesiredHarvestRate)
        return false
    const allHarvestersAreAtMaxLevel = getLowestBuildLevelOfHarvesters(verseIn, playerIndex, parcelIndex, tokenToFarm) >= Math.min(verseIn.rules.installations[`harvester_${tokenToFarm}`].maxLevel, maxLevelOfHarvesters)
    const hasAHarvester = Parcel.getInstallationTypeCount(verseIn.players[playerIndex].parcels[parcelIndex], `harvester_${tokenToFarm}`) > 0
    const canUpgradeAHarvester = hasAHarvester && !allHarvestersAreAtMaxLevel
    if (upgradeHarvestersBeforeCraftingMore && canUpgradeAHarvester)
        return upgradeLowestLevelHarvesterOfType(...args)
    if (canCraftAHarvester)
        return craftHarvestersOfType(...args)
    if (canUpgradeAHarvester)
        return upgradeLowestLevelHarvesterOfType(...args)
    return false
}

function doesUpgradingMakerIncreaseHarvesterLimit (verseIn, playerIndex, parcelIndex, tokenToFarm) {
    const myParcel = verseIn.players[playerIndex].parcels[parcelIndex]
    const makerIndex = Parcel.getIndexOfHighestLevelInstallation(myParcel, 'maker')
    const myMaker = myParcel.installations[makerIndex]
    const harvesterQtyIncreases = verseIn.rules.installations.maker.harvesterQtyIncreases
    let makerLevel = 0
    if (typeof myMaker != 'undefined')
        makerLevel = myMaker.level
    const remainingQtyIncreases = Math.max(...harvesterQtyIncreases.slice(makerLevel))
    return remainingQtyIncreases > 0
}

function isLastRound(verseIn) {
    return verseIn.rules.surveyingRoundStartTimes.filter((time) => time > verseIn.currentTime).length == 0
}

function getBlocksRemainingInGame(verseIn) {
    const gameLengthInBlocks = verseIn.rules.surveyingRoundStartTimes[verseIn.rules.surveyingRoundStartTimes.length - 1] + verseIn.rules.surveyingRoundBlocks
    return gameLengthInBlocks - verseIn.currentTime
}

function getDaysRemainingInAct(verseIn) {
    const actLengthInBlocks = verseIn.rules.surveyingActBlocks
    const secondsPerBlock = verseIn.rules.secondsPerBlock
    const blocksRemainingInAct = actLengthInBlocks - verseIn.currentTime
    const daysRemainingInAct = blocksRemainingInAct * secondsPerBlock / 60 / 60 / 24
    return daysRemainingInAct
}

function getAlchemicaRemainingInAct(verseIn, playerIndex, parcelIndex, token) {
    const myParcel = verseIn.players[playerIndex].parcels[parcelIndex]
    const numDistributionsSoFar = verseIn.rules.surveyingRoundStartTimes.filter((t) => t < verseIn.currentTime).length
    const pctOfAlchemicaInRemainingDistributions = sumArray(verseIn.rules.surveyingRoundDistributionRates.slice(numDistributionsSoFar))
    return pctOfAlchemicaInRemainingDistributions * verseIn.rules.avgBaseAlchemicaPerParcel[myParcel.size][token]
}

function getMaximumDesiredHarvestRate(verseIn, playerIndex, parcelIndex, token) {
    const daysRemainingInAct = getDaysRemainingInAct(verseIn)
    const alchemicaRemainingInAct = getAlchemicaRemainingInAct(verseIn, playerIndex, parcelIndex, token)
    if (daysRemainingInAct <= 0)
        return verseIn.players[playerIndex].parcels[parcelIndex].tokens[token]
    const totalAlchemicaLeftToBeHarvested = verseIn.players[playerIndex].parcels[parcelIndex].tokens[token] + (alchemicaRemainingInAct || 0)
    const maxDesiredHarvestRate = totalAlchemicaLeftToBeHarvested / daysRemainingInAct
    return maxDesiredHarvestRate
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
    
    if (hasReachedMaxOfType(verseIn, playerIndex, parcelIndex, `harvester_${tokenToFarm}`) && doesUpgradingMakerIncreaseHarvesterLimit(verseIn, playerIndex, parcelIndex, tokenToFarm)) {
        return craftNewInstallation(verseIn, playerIndex, parcelIndex, 'maker') || upgradeHighestLevelInstallation(verseIn, playerIndex, parcelIndex, 'maker')
    }

    return craftNewInstallation(verseIn, playerIndex, parcelIndex, harvesterType)
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

function getMaximumDesiredAltarLevel(gotchiverseIn, playerIndex, parcelIndex) {
    const parcelSize = gotchiverseIn.players[playerIndex].parcels[parcelIndex].size
    switch (parcelSize) {
        case 'spacious':
            return 8
        case 'reasonable':
            return 6
        case 'humble':
            return 4
    }
    return gotchiverseIn.rules.installations.altar.maxLevel
}

function getMaximumDesiredMakerLevel(gotchiverseIn, playerIndex, parcelIndex) {
    const parcelSize = gotchiverseIn.players[playerIndex].parcels[parcelIndex].size
    switch (parcelSize) {
        case 'spacious':
            return 7
        case 'reasonable':
            return 3
        case 'humble':
            return 1
    }
    return gotchiverseIn.rules.installations.maker.maxLevel
}

function upgradeInstallation(gotchiverseIn, playerIndex, parcelIndex, installationType, upgradeLowest = true) {

    const me = gotchiverseIn.players[playerIndex]
    const myParcel = me.parcels[parcelIndex]

    const installationToUpgrade = upgradeLowest ? myParcel.installations[Parcel.getIndexOfLowestLevelInstallation(myParcel, installationType)] : myParcel.installations[Parcel.getIndexOfHighestLevelInstallation(myParcel, installationType)]
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
        if (limiter.level <= installationToUpgrade.level) {
            return upgradeHighestLevelInstallation(gotchiverseIn, playerIndex, parcelIndex, levelPrerequisite)
        }
    }

    let concurrentUpgrades = Parcel.getCurrentUpgradeCount(gotchiverseIn.players[playerIndex].parcels[parcelIndex])
    let maxConcurrentUpgradeLimit = getMaxConcurrentUpgradeLimit(gotchiverseIn, playerIndex, parcelIndex)
    let canCraftAMaker = Parcel.getInstallationTypeCount(myParcel, 'maker') < gotchiverseIn.rules.installations.maker.maxQuantityPerParcel[myParcel.size]

    if (concurrentUpgrades >= maxConcurrentUpgradeLimit)
        return canCraftAMaker ? craftAndEquipMaker : false

    // don't upgrade the maker if the installation we're currently upgrading is the maker, or its level prerequisite (altar)
    if (installationType != 'maker' && installationType != gotchiverseIn.rules.installations.maker.levelPrerequisite) {
        const lowestLevelMaker = myParcel.installations[Parcel.getIndexOfLowestLevelInstallation(myParcel, 'maker')]

        if (!canCraftAMaker && (typeof lowestLevelMaker != 'undefined') && concurrentUpgrades >= maxConcurrentUpgradeLimit - 1) {
            const maxDesiredMakerLevel = getMaximumDesiredMakerLevel(gotchiverseIn, playerIndex, parcelIndex)
            const canUpgradeMaker = (lowestLevelMaker.level >= lowestLevelMaker.buildLevel) && (lowestLevelMaker.level < gotchiverseIn.rules.installations.maker.maxLevel)
            if (canUpgradeMaker && lowestLevelMaker.buildLevel < maxDesiredMakerLevel)
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