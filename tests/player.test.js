const test = require('tape');
const Player = require('../entities/player.js')
const tokens = ['BTC', 'ETH']
const { pipe } = require('../utils.js')
const Parcel = require('../entities/parcel.js')
const Altar = require('../entities/altar.js')
const Harvester = require('../entities/harvester.js')
 

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


test('Player.getTotalParcels', (t) => {
    const noParcels = { humble: 0, reasonable: 0, spacious: 0, partner: 0 }
    t.deepEquals(pipe(Player.create(), Player.getTotalParcels), noParcels, 'no parcels returns all zero count')

    const w = pipe(Player.create(), [Player.addParcel, Parcel.create('humble')], [Player.addParcel, Parcel.create('reasonable')], [Player.addParcel, Parcel.create('reasonable')], [Player.addParcel, Parcel.create('partner')], [Player.addParcel, Parcel.create('spacious')])
    const totalParcels = { humble: 1, reasonable: 2, spacious: 1, partner: 1 }
    t.deepEquals(Player.getTotalParcels(w), totalParcels, 'has parcels returns correct counts')

    t.end()
})

test('Player.getTotalInstallations', (t) => {
    const noInstallations = { }
    t.deepEquals(pipe(Player.create(), Player.getTotalInstallations), noInstallations, 'no installations returns blank')

    const altarL1 = pipe(Altar.create(), Altar.addLevel)
    const altarL2 = Altar.addLevel(altarL1)
    const fudHarvesterL1 = pipe(Harvester.create('fud'), Harvester.addLevel)
    const fudHarvesterL2 = Harvester.addLevel(fudHarvesterL1)
    const kekHarvesterL3 = pipe(Harvester.create('kek'), Harvester.addLevel, Harvester.addLevel, Harvester.addLevel)

    const parcel1 = pipe(Parcel.create('humble'), [Parcel.addInstallation, altarL1], [Parcel.addInstallation, fudHarvesterL1])
    const parcel2 = pipe(Parcel.create('reasonable'), [Parcel.addInstallation, altarL2], [Parcel.addInstallation, fudHarvesterL2], [Parcel.addInstallation, kekHarvesterL3])

    const w = pipe(Player.create(), [Player.addParcel, parcel1], [Player.addParcel, parcel2])
    const totalInstallations = { altar: [1,1,0,0,0,0,0,0,0], harvester_fud: [1,1,0,0,0,0,0,0,0], harvester_kek: [0,0,1,0,0,0,0,0,0] }
    t.deepEquals(Player.getTotalInstallations(w), totalInstallations, 'has installations returns correct counts')
    t.end()
})