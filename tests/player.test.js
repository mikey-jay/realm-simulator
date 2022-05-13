const test = require('tape');
const Player = require('../entities/player.js')
const tokens = ['BTC', 'ETH']

test('Tape is working', (t) => { t.true(true); t.end(); });

test('Player.addTokens', (t) => {
    const g = Player.create()
    tokens.forEach((token) => {
        let g1 = Player.addTokens(g, token, 250)
        t.equal(g1.tokens[token], 250)
        let g2 = Player.addTokens(g1, token, 200)
        t.equal(g2.tokens[token], 450)
    })
    t.end()
})

test('Player.removeTokens', (t) => {
    const p = Player.create()
    tokens.forEach((token) => {
        let p1 = Player.addTokens(p, token, 250)
        let p2 = Player.removeTokens(p1, token, 100)
        t.equal(p2.tokens[token], 150)
    })
    t.end()
})

test('Player.addParcel', (t) => {
    const p = Player.create()
    t.equal(p.parcels.length, 0, 'player has no parcels')
    const p1 = Player.addParcel(p, { size: 'humble' })
    const p2 = Player.addParcel(p1, { size: 'reasonable'})
    t.equal(p2.parcels.length, 2, 'should be 2 parcels')
    t.end()
})

test('Player.removeParcel', (t) => {
    const p = Player.create()
    t.equal(p.parcels.length, 0, 'player has no parcels')
    const p1 = Player.addParcel(p, { size: 'humble' })
    const p2 = Player.removeParcel(p1,0)
    t.equal(p2.parcels.length, 0, 'should be no parcels')
    t.end()
})