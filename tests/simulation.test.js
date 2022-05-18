const test = require('tape');
const Simulation = require('../entities/simulation.js')
const rules = require('../rulesets/testRules.js')
const { pipe } = require('../utils.js')
 

test('Simulation.create', (t) => {
    const sim = Simulation.create('testRules')
    t.equals(sim.rulesetName, 'testRules', 'has rulesetName')
    t.true(sim.passTimeBlocks > 0, 'has a passTime > 0')

    t.deepEquals(sim.gotchiverse.rules, rules, 'has gotchiverse rules')
    t.end()
})

test('Simulation.addBot', (t) => {
    const bot = { foo: 'bar', hello: 'world' }
    const sim = pipe(Simulation.create('testRules'), [Simulation.addBot, bot])
    t.deepEquals(sim.bots[0], bot, 'bot is added')
    t.end()
})

test('Simulation.addResult', (t) => {
    const result = { money: 'a little', parcels: 'a lot' }
    const sim = pipe(Simulation.create('testRules'), [Simulation.addResult, result])
    t.deepEquals(sim.results[0], result, 'result is added')
    t.end()
})