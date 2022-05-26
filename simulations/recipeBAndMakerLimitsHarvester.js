const runStrategyAsync = require('../use_cases/runStrategyAsync.js')
const rulesetName = 'recipeBAndMakerLimitsHarvester'
const strategies = ['expandHorizontal', 'expandVertical']

module.exports = (...args) => runStrategyAsync(strategies, rulesetName, ...args)