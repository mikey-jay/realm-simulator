const test = require('tape');
const Harvester = require('../entities/harvester.js')
const tokens = ['beavis', 'butthead']

 

test('Harvester.create', (t) => {

    tokens.forEach( (token) => {
        const a = Harvester.create(token)
        t.equal(a.type, `harvester_${token}`, 'installation type matches')
        t.equal(a.resourceToken, token, `${token} token matches`)
    })
    t.end()
})

