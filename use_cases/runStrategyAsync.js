const Simulation = require('../entities/simulation.js')
const {runSimulation} = require('../use_cases/runSimulation.js')
const Parcel = require('../entities/parcel.js')
const Bot = require('../entities/bot.js')
const { pipe } = require('../utils.js')

module.exports = async (strategies, rulesetName, harvestFrequencyHrs, endTimeDays, parcelSize = 'spacious') => {
    const rules = require(`../rulesets/${rulesetName}.js`)
    const startingAlchemica = rules.avgBaseAlchemicaPerParcel.spacious
    const runStrategy = (strategyName) => {
        const strategyBot = pipe(Bot.create(strategyName), [Bot.addTokens, startingAlchemica], [Bot.addParcel, Parcel.create(parcelSize)])
        return pipe(Simulation.create(rulesetName, harvestFrequencyHrs, endTimeDays), [Simulation.addBot, strategyBot], runSimulation)
    }
    const runStrategyAsync = (strategyName) => new Promise((resolve, reject) => {
        const strategyNum = strategies.indexOf(strategyName) + 1
        const numStrategies = strategies.length
        console.log(`\nRunning strategy (${strategyNum}/${numStrategies}) ${strategyName} with ${parcelSize} parcel...`)
        resolve(runStrategy(strategyName))
    })    
    const sims = strategies.map(runStrategyAsync)
    return Promise.all(sims)
}
