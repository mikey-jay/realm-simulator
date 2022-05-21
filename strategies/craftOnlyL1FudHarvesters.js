const Player = require('../entities/player.js')
const Parcel = require('../entities/parcel.js')
const Installation = require('../entities/installation.js')
const { craftAndEquipFudHarvester, hasReachedMaxOfType, hasReachedMaxOfClass, getMissingPrerequisiteTypes, craftAndEquipAltar, craftAndEquipMaker, craftAndEquipFomoHarvester, craftAndEquipAlphaHarvester, craftAndEquipKekHarvester, craftAndEquipFudReservoir, craftAndEquipFomoReservoir, craftAndEquipAlphaReservoir, craftAndEquipKekReservoir } = require('../use_cases/craftAndEquip.js')
const { addObjectKeys } = require('../utils.js')
const { upgradeLowestLevelAltar, upgradeLowestLevelMaker, upgradeLowestLevelFudHarvester, upgradeLowestLevelFomoHarvester, upgradeLowestLevelAlphaHarvester, upgradeLowestLevelKekHarvester, upgradeLowestLevelFudReservoir, upgradeLowestLevelFomoReservoir, upgradeLowestLevelAlphaReservoir, upgradeLowestLevelKekReservoir, upgradeHighestLevelAltar, upgradeHighestLevelMaker, upgradeHighestLevelFudHarvester, upgradeHighestLevelFomoHarvester, upgradeHighestLevelAlphaHarvester, upgradeHighestLevelKekHarvester, upgradeHighestLevelFudReservoir, upgradeHighestLevelFomoReservoir, upgradeHighestLevelAlphaReservoir, upgradeHighestLevelKekReservoir, getMaxConcurrentUpgradeLimit } = require('../use_cases/craftUpgrade.js')
const expandHorizontal = require('./expandHorizontal.js')

module.exports = (verseIn, playerIndex, parcelIndex) => expandHorizontal(verseIn, playerIndex, parcelIndex, ['fud'])