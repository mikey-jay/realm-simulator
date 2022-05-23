const test = require('tape');
const Parcel = require('../entities/parcel.js')
const Player = require('../entities/player.js')
const Gotchiverse = require('../entities/gotchiverse.js')
const { pipe } = require('../utils.js');
const { getParcelTokensInOrderOfAbundance } = require('../use_cases/getParcelTokensInOrderOfAbundance.js');

test('getParcelTokensInOrderOfAbundance', (t) => {
    const rules = require('../rulesets/testRules.js')
    const alchemica = { fud: 10, fomo: 10, alpha: 7.5, kek: 0.5 } // alpha, fomo, fud, kek
    const testParcel = pipe(Parcel.create('spacious'), [Parcel.addAlchemica, alchemica])
    const testPlayer = pipe(Player.create(), [Player.addParcel, testParcel])
    const verse = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, testPlayer])
    const sortedTokens = getParcelTokensInOrderOfAbundance(verse, 0, 0)
    t.deepEquals(sortedTokens, ['alpha', 'fomo', 'fud', 'kek'], 'returns tokens in correct order')
    const sortedTokensWithoutFomo = getParcelTokensInOrderOfAbundance(verse, 0, 0, ['fud', 'alpha', 'kek'])
    t.deepEquals(sortedTokensWithoutFomo, ['alpha', 'fud', 'kek'], 'returns tokens in correct order without fomo')

    t.end()
})