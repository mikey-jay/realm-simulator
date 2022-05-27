const runStrategyAsync = require('../use_cases/runStrategyAsync.js')
const rulesetName = 'current'
const strategies = ['expandVertical', 'expandHorizontal']

module.exports = (...args) => runStrategyAsync(strategies, rulesetName, ...args)