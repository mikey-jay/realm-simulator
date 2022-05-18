const test = require('tape');
const Simulation = require('../entities/simulation.js')
const {runSimulation} = require('../use_cases/runSimulation.js')
const Parcel = require('../entities/parcel.js')
const Bot = require('../entities/bot.js')
const Gotchiverse = require('../entities/gotchiverse.js')
const { pipe } = require('../utils.js')

test('runSimulation', (t) => {
    const burnFudBot = pipe(Bot.create('burnOneFud'), [Bot.addTokens, 'fud', 3], [Bot.addParcel, Parcel.create('partner')])
    const sim = pipe(Simulation.create('testRules', 8, 3), [Simulation.addBot, burnFudBot], [Simulation.addBot, burnFudBot], runSimulation)
    t.equals(Gotchiverse.getTokenBalance(sim.gotchiverse.players[0], 'fud'), 0, 'All fud has been burned by player 1')
    t.equals(Gotchiverse.getTokenBalance(sim.gotchiverse.players[1], 'fud'), 0, 'All fud has been burned by player 2')
    t.true(sim.gotchiverse.currentTime >= sim.endTime, 'end time has been reached')
    t.true(sim.gotchiverse.currentTime <= sim.endTime + sim.passTimeBlocks, 'no extra blocks')
    t.end()
})