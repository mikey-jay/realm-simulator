const runStrategyAsync = require('../use_cases/runStrategyAsync.js')
const rulesetName = 'harvesterRecipeCLowerMaker'
const strategies = ['expandVertical', 'expandHorizontal']

module.exports = (...args) => runStrategyAsync(strategies, rulesetName, ...args)