const test = require('tape');
const Result = require('../entities/result.js')
const Gotchiverse = require('../entities/gotchiverse.js')
const Player = require('../entities/player.js')
const Parcel = require('../entities/player.js')
const Altar = require('../entities/altar.js')
const { pipe, addArrays } = require('../utils.js')

test('Result.create', (t) => {
    const playerAltar = pipe(Altar.create(), Altar.addLevel)
    const playerParcel = pipe(Parcel.create('spacious'), [Parcel.addTokens, 'fud', 100], [Parcel.addInstallation, playerAltar])
    const qualifiedPlayer = pipe(Player.create(), [Player.addParcel, playerParcel], [Player.addParcel, playerParcel])
    let verse = pipe(Gotchiverse.create(), [Gotchiverse.addTime, 100], [Gotchiverse.addPlayer, qualifiedPlayer])
    const result = Result.create(verse, 0, 0, 'a_use_case')
    t.equals(result.blockTime, verse.currentTime, 'result has a block time')
    t.equals(result.playerIndex, 0, 'result has playerIndex')
    t.equals(result.parcelIndex, 0, 'result has playerIndex')
    t.equals(result.useCaseName, 'a_use_case', 'result has use case')
    t.equals(result.parcelTotals.tokens.fud, 100, 'fud shown in parcel total')
    t.equals(result.playerTotals.installations.altar[0], 2, 'player has 2 L1 altars')
    t.deepEquals(result.playerTotals.installations.altar, addArrays(result.parcelTotals.installations.altar, result.parcelTotals.installations.altar), 'Player installation sum is equal to parcel installation sums')
    t.end()
})

