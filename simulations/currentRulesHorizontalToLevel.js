const Simulation = require('../entities/simulation.js')
const {runSimulation} = require('../use_cases/runSimulation.js')
const Parcel = require('../entities/parcel.js')
const Bot = require('../entities/bot.js')
const { pipe } = require('../utils.js')

const rulesetName = 'current'
const rules = require(`../rulesets/${rulesetName}.js`)

const startingAlchemica = rules.avgBaseAlchemicaPerParcel.spacious

const strategies = ['horizontalToL1', 'horizontalToL3', 'horizontalToL5', 'horizontalToL7', 'expandHorizontal']

module.exports = async (harvestFrequencyHrs, endTimeDays) => {
    const runStrategy = (strategyName) => {
        const strategyBot = pipe(Bot.create(strategyName), [Bot.addTokens, startingAlchemica], [Bot.addParcel, Parcel.create('spacious')])
        return pipe(Simulation.create(rulesetName, harvestFrequencyHrs, endTimeDays), [Simulation.addBot, strategyBot], runSimulation)
    }
    const runStrategyAsync = (strategyName) => new Promise((resolve, reject) => {
        resolve(runStrategy(strategyName))
    })    
    const sims = strategies.map(runStrategyAsync)
    return Promise.all(sims)
}
