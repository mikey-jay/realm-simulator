const test = require('tape');
const Result = require('../entities/result.js')
const Gotchiverse = require('../entities/gotchiverse.js')
const { pipe } = require('../utils.js')

test('Result.create', (t) => {
    let verse = pipe(Gotchiverse.create(), [Gotchiverse.addTime, 100])
    const result = Result.create(verse, 2, 'a_use_case')
    t.equals(result.blockTime, verse.currentTime, 'result has a block time')
    t.equals(result.playerIndex, 2, 'result has playerIndex')
    t.equals(result.useCaseName, 'a_use_case', 'result has use case')

    t.end()
})

