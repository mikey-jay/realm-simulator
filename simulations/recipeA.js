const runStrategyAsync = require('../use_cases/runStrategyAsync.js')
const rulesetName = 'harvesterRecipeA'
const strategies = ['expandHorizontal', 'expandVertical']

module.exports = (...args) => runStrategyAsync(strategies, rulesetName, ...args)