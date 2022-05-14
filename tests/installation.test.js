const test = require('tape');
const Installation = require('../entities/installation.js')

 

test('Installation.create', (t) => {
    const i = Installation.create('harvester')
    t.equal(i.type, 'harvester', 'installation type matches')
    t.equal(i.timeComplete, 0, 'has time completed')
    t.equal(i.level, 0, 'current level starts at 0')
    t.equal(i.buildLevel, 1, 'pending build level starts at 1')
    t.throws(() => Installation.create('not_a_valid_type'), 'invalid installation type throws')
    t.end()
})

test('Installation.addLevel', (t) => {
    const i = Installation.addLevel(Installation.create('harvester'))
    t.equal(i.level, 1, 'add level changes level to 1')
    t.end()
})