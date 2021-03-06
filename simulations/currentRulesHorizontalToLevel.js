const runStrategyAsync = require('../use_cases/runStrategyAsync.js')
const rulesetName = 'current'
const strategies = ['horizontalToL1', 'horizontalToL3', 'horizontalToL5', 'horizontalToL7', 'expandHorizontal']

module.exports = (...args) => runStrategyAsync(strategies, rulesetName, ...args)
