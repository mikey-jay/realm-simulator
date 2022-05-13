const test = require('tape');
const Ruleset = require('../entities/ruleset.js')

 

test('Ruleset.create', (t) => {
    rules = Ruleset.create('testRules')
    Object.keys(rules.installations).forEach((type) => {
        const i = rules.installations[type]
        t.true(i.maxLevel > 0, `${type} installation has a max level > 0`)
        t.equal(i.buildTime.length, i.maxLevel, `${type} installation has build times for each level`)
    })
    t.end()
})

