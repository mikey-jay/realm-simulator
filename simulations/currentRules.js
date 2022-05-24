const Simulation = require('../entities/simulation.js')
const {runSimulation} = require('../use_cases/runSimulation.js')
const Parcel = require('../entities/parcel.js')
const Bot = require('../entities/bot.js')
const { pipe } = require('../utils.js')

const rulesetName = 'current'
const rules = require(`../rulesets/${rulesetName}.js`)

const startingAlchemica = rules.avgBaseAlchemicaPerParcel.spacious
const horizontalBot = pipe(Bot.create('expandHorizontal'), [Bot.addTokens, startingAlchemica], [Bot.addParcel, Parcel.create('spacious')])
const verticalBot = pipe(Bot.create('expandVertical'), [Bot.addTokens, startingAlchemica], [Bot.addParcel, Parcel.create('spacious')])
module.exports = (harvestFrequencyHrs, endTimeDays) => pipe(Simulation.create(rulesetName, harvestFrequencyHrs, endTimeDays), [Simulation.addBot, horizontalBot], [Simulation.addBot, verticalBot], runSimulation)