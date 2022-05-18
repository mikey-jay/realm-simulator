const test = require('tape');
const Result = require('../entities/result.js')
const Gotchiverse = require('../entities/gotchiverse.js')
const Player = require('../entities/player.js')
const Parcel = require('../entities/player.js')
const { pipe } = require('../utils.js')

test('Result.create', (t) => {
    const qualifiedPlayer = pipe(Player.create(), [Player.addParcel, Parcel.create('spacious')])
    let verse = pipe(Gotchiverse.create(), [Gotchiverse.addTime, 100], [Gotchiverse.addPlayer, qualifiedPlayer])
    const result = Result.create(verse, 0, 0, 'a_use_case')
    t.equals(result.blockTime, verse.currentTime, 'result has a block time')
    t.equals(result.playerIndex, 0, 'result has playerIndex')
    t.equals(result.parcelIndex, 0, 'result has playerIndex')
    t.equals(result.useCaseName, 'a_use_case', 'result has use case')
    t.end()
})

