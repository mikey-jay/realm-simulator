const test = require('tape');
const Simulation = require('../entities/simulation.js')
const {startSimulation} = require('../use_cases/startSimulation.js')
const Parcel = require('../entities/parcel.js')
const Bot = require('../entities/bot.js')
const Gotchiverse = require('../entities/gotchiverse.js')
const { pipe } = require('../utils.js')

test('startSimulation', (t) => {
    const rules = require('../rulesets/testRules.js')
    const doNothingBot = pipe(Bot.create('doNothing'), [Bot.addParcel, Parcel.create('humble')])
    const sim = pipe(Simulation.create('testRules'), [Simulation.addBot, doNothingBot], [Simulation.addBot, doNothingBot], startSimulation)
    t.true(Gotchiverse.getTokenBalance(sim.gotchiverse, 'kek') > 0, 'Add token supply to the gotchiverse')
    t.deepEquals(sim.gotchiverse.players[0].strategyName, 'doNothing')
    t.equals(sim.gotchiverse.players.length, 2, 'has two players')
    t.true(Parcel.getTokenBalance(sim.gotchiverse.players[1].parcels[0], 'fud') > 0, 'parcels have been surveyed')
    t.end()
})