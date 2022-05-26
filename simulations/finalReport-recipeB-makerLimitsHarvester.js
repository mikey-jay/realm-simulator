const runStrategyAsync = require('../use_cases/runStrategyAsync.js')
const rulesetName = 'recipeBAndMakerLimitsHarvester'
const strategies = ['expandVertical', 'expandHorizontal', 'horizontalToL1', 'onlyL1FudHarvesters']

module.exports = (...args) => runStrategyAsync(strategies, rulesetName, ...args)