const test = require('tape');
const Altar = require('../entities/altar.js')

test('Tape is working', (t) => { t.true(true); t.end(); });

test('Altar.create', (t) => {
    const a = Altar.create()
    t.equal(a.type, 'altar', 'installation type matches')
    t.end()
})

