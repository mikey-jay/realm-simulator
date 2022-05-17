const test = require('tape');
const { surveySingleParcel, surveyParcels } = require('../use_cases/surveyParcels.js')
const { pipe } = require('../utils.js')
const Parcel = require('../entities/parcel.js')
const Player = require('../entities/player.js')
const Gotchiverse = require('../entities/gotchiverse.js')
const Wallet = require('../entities/wallet.js')

test('surveySingleParcel', (t) => {
    const rules = require('../rulesets/testRules.js')

    const qualifiedPlayer = pipe(Player.create(), [Player.addParcel, Parcel.create('reasonable')], [Player.addParcel, Parcel.create('partner')])
    const verse = pipe(Gotchiverse.create(rules), [Gotchiverse.addAlchemica, rules.parcelTokenAllocation], Gotchiverse.addRound, [Gotchiverse.addPlayer, qualifiedPlayer], [Gotchiverse.addPlayer, qualifiedPlayer], [surveySingleParcel, 0, 0])
    
    t.deepEquals(verse.players[0].parcels[0].tokens, Wallet.addTokens(Wallet.create(), rules.avgBaseAlchemicaPerParcel[verse.players[0].parcels[0].size], rules.surveyingRoundDistributionRates[verse.currentRound - 1]).tokens, 'parcel has correct supply for this round')
    t.end()
})

test('surveyParcels', (t) => {
    const rules = require('../rulesets/testRules.js')

    const qualifiedPlayer = pipe(Player.create(), [Player.addParcel, Parcel.create('reasonable')], [Player.addParcel, Parcel.create('partner')])
    const verse = pipe(Gotchiverse.create(rules), [Gotchiverse.addAlchemica, rules.parcelTokenAllocation], [Gotchiverse.addPlayer, qualifiedPlayer], [Gotchiverse.addPlayer, qualifiedPlayer], surveyParcels)
    
    t.equals(verse.currentRound, 1, 'round has been advanced')
    t.deepEquals(verse.players[0].parcels[0].tokens, Wallet.addTokens(Wallet.create(), rules.avgBaseAlchemicaPerParcel[verse.players[0].parcels[0].size], rules.surveyingRoundDistributionRates[verse.currentRound - 1]).tokens, '1st player 1st parcel has correct supply for this round')
    t.deepEquals(verse.players[1].parcels[1].tokens, Wallet.addTokens(Wallet.create(), rules.avgBaseAlchemicaPerParcel[verse.players[1].parcels[1].size], rules.surveyingRoundDistributionRates[verse.currentRound - 1]).tokens, '2nd player 2nd parcel parcel has correct supply for this round')
    let totalFudDistributed = 0
    verse.players.forEach((p) => {
        p.parcels.forEach((land) => {
            totalFudDistributed += Wallet.getTokenBalance(land, 'fud')
        })
    })
    t.equals(Wallet.getTokenBalance(verse, 'fud') + totalFudDistributed, rules.parcelTokenAllocation.fud, 'tokens were distributed from gotchiverse supply')
    t.end()
})