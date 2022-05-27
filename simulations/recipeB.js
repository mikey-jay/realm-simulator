const runStrategyAsync = require('../use_cases/runStrategyAsync.js')
const rulesetName = 'harvesterRecipeB'
const strategies = ['expandVertical', 'expandHorizontal']

module.exports = (...args) => runStrategyAsync(strategies, rulesetName, ...args)