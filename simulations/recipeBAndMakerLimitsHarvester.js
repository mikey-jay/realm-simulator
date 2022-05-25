const runStrategyAsync = require('../use_cases/runStrategyAsync.js')
const rulesetName = 'recipeBAndMakerLimitsHarvester'
const strategies = ['expandHorizontal', 'expandVertical']

module.exports = (harvestFrequencyHrs, endTimeDays) => runStrategyAsync(strategies, rulesetName, harvestFrequencyHrs, endTimeDays)