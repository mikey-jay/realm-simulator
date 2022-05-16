const test = require('tape');
const Reservoir = require('../entities/reservoir.js')
const tokens = ['taco', 'bell']

 

test('Reservoir.create', (t) => {

    const a = Reservoir.create(tokens[0])

    tokens.forEach( (token) => {
        const a = Reservoir.create(token)
        t.equal(a.type, `reservoir_${token}`, 'installation type matches')
        t.equal(a.resourceToken, token, `${token} token matches`)
    })

    t.throws(() => Reservoir.create(), 'throws if no token is specified')
    t.end()
})

test('Reservoir.addAlchemica', (t) => {
    r = Reservoir.create(tokens[0])
    let r1 = Reservoir.addAlchemica(r, 250)
    t.equal(r1.tokens[r.resourceToken], 250)
    let r2 = Reservoir.addAlchemica(r1, 200)
    t.equal(r2.tokens[r.resourceToken], 450)
    t.end()
})

test('Reservoir.removeAlchemica', (t) => {
    const r = Reservoir.create(tokens[0])
    let r1 = Reservoir.addAlchemica(r, 250)
    let r2 = Reservoir.removeAlchemica(r1, 100)
    t.equal(r2.tokens[r2.resourceToken], 150)
    t.end()
})

