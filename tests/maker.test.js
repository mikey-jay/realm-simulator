const test = require('tape');
const Maker = require('../entities/maker.js')

 

test('Maker.create', (t) => {
    const m = Maker.create()
    t.equal(m.type, 'maker', 'installation type matches')
    t.end()
})

