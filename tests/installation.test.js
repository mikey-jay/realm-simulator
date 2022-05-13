const test = require('tape');
const Installation = require('../entities/installation.js')

 

test('Installation.create', (t) => {
    const i = Installation.create('harvester')
    t.equal(i.type, 'harvester', 'installation type matches')
    t.equal(i.buildTimeRemaining, 0, 'has a build time of zero')
    t.equal(i.level, 0, 'current level starts at 0')
    t.equal(i.buildLevel, 1, 'pending build level starts at 1')
    t.throws(() => Installation.create('not_a_valid_type'), 'invalid installation type throws')
    t.end()
})

test('Installation.addBuildTime', (t) => {
    const i = Installation.create('harvester')
    const i2 = Installation.addBuildTime(i, 1000)
    const i3 = Installation.addBuildTime(i2, 2000)
    t.equal(i2.buildTimeRemaining, 1000)
    t.equal(i3.buildTimeRemaining, 3000)
    t.end()
})

test('Installation.removeBuildTime', (t) => {
    const i = Installation.create('harvester')
    const i2 = Installation.addBuildTime(i, 1000)
    const i3 = Installation.removeBuildTime(i2, 1000)
    t.equal(i3.buildTimeRemaining, 0)
    t.end()
})

test('Installation.addLevel', (t) => {
    const i = Installation.addLevel(Installation.create('harvester'))
    t.equal(i.level, 1, 'add level changes level to 1')
    t.end()
})