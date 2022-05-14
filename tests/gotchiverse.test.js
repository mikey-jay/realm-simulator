const test = require('tape');
const Gotchiverse = require('../entities/gotchiverse.js')
const alchemicaTokens = ['peanut butter', 'jelly time']
const rules = { rule1: 'a rule', rule2: { rule2a: 'a subrule', rule2b: 'another subrule' }}

 

test('Gotchiverse.create', (t) => {
    const g = Gotchiverse.create(rules)
    t.equal(g.players.length, 0, 'there are no players')
    t.deepEqual(rules, g.rules, 'rules are set')
    const supplyWallets = ['pixelCraft', 'greatPortal', 'dao', 'burn']
    supplyWallets.forEach((wallet) => {
        console.log(wallet)
        t.notEqual(typeof g[wallet], 'undefined', `${wallet} wallet is defined`)
    })
    t.end()
})

test('Gotchiverse.addAlchemica', (t) => {
    const g = Gotchiverse.create(rules)
    alchemicaTokens.forEach((token) => {
        let g1 = Gotchiverse.addAlchemica(g, token, 50)
        t.equal(g1.tokens[token], 50)
        let g2 = Gotchiverse.addAlchemica(g1, token, 100)
        t.equal(g2.tokens[token], 150)
    })
    t.end()
})

test('Gotchiverse.removeAlchemica', (t) => {
    const g = Gotchiverse.create(rules)
    alchemicaTokens.forEach((token) => {
        let g1 = Gotchiverse.addAlchemica(g, token, 100)
        let g2 = Gotchiverse.removeAlchemica(g1, token, 75)
        t.equal(g2.tokens[token], 25)
    })
    t.end()
})

test('Gotchiverse.addPlayer', (t) => {
    const g = Gotchiverse.create(rules)
    let g1 = Gotchiverse.addPlayer(g, { name: 'player1' }, 100)
    t.equal(g1.players.length, 1, 'there is 1 player')
    let g2 = Gotchiverse.addPlayer(g1, { name: 'player1' }, 100)
    t.equal(g2.players.length, 2, 'there are 2 players')
    t.end()
})