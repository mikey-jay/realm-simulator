const runStrategyAsync = require('../use_cases/runStrategyAsync.js')
const rulesetName = 'makerLimitsHarvesterQty'
const strategies = ['expandHorizontal', 'expandVertical']

module.exports = (...args) => runStrategyAsync(strategies, rulesetName, ...args)