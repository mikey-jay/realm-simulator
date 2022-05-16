const test = require('tape');
const Harvester = require('../entities/harvester.js')
const tokens = ['beavis', 'butthead']

 

test('Harvester.create', (t) => {

    const a = Harvester.create( tokens[0] )
    t.equal(a.type, 'harvester', 'installation type matches')

    tokens.forEach( (token) => {
        const a = Harvester.create(token)
        t.equal(a.resourceToken, token, `${token} token matches`)
    })
    t.end()
})

