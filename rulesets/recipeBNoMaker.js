const currentRules = require('./harvesterRecipeB.js')

const newRules = structuredClone(currentRules)

newRules.maxConcurrentUpgrades = 9999

module.exports = newRules