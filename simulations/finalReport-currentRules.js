const runStrategyAsync = require('../use_cases/runStrategyAsync.js')
const rulesetName = 'current'
const strategies = ['expandHorizontal', 'horizontalToL1', 'horizontalToL6', 'onlyL1FudHarvesters', 'onlyL2FudHarvesters']

module.exports = (...args) => runStrategyAsync(strategies, rulesetName, ...args)