const Simulation = require('../entities/simulation.js')
const {runSimulation} = require('../use_cases/runSimulation.js')
const Parcel = require('../entities/parcel.js')
const Bot = require('../entities/bot.js')
const { pipe } = require('../utils.js')

const rulesetName = 'current'
const rules = require(`../rulesets/${rulesetName}.js`)

const startingAlchemica = rules.avgBaseAlchemicaPerParcel.spacious
const botL1 = pipe(Bot.create('horizontalToL1'), [Bot.addTokens, startingAlchemica], [Bot.addParcel, Parcel.create('spacious')])
const botL3 = pipe(Bot.create('horizontalToL3'), [Bot.addTokens, startingAlchemica], [Bot.addParcel, Parcel.create('spacious')])
const botL5 = pipe(Bot.create('horizontalToL5'), [Bot.addTokens, startingAlchemica], [Bot.addParcel, Parcel.create('spacious')])
const botL7 = pipe(Bot.create('horizontalToL7'), [Bot.addTokens, startingAlchemica], [Bot.addParcel, Parcel.create('spacious')])
const botL9 = pipe(Bot.create('expandHorizontal'), [Bot.addTokens, startingAlchemica], [Bot.addParcel, Parcel.create('spacious')])
module.exports = (harvestFrequencyHrs, endTimeDays) => pipe(Simulation.create(rulesetName, harvestFrequencyHrs, endTimeDays), [Simulation.addBot, botL1], [Simulation.addBot, botL3], [Simulation.addBot, botL5], [Simulation.addBot, botL7], [Simulation.addBot, botL9],runSimulation)