const test = require('tape');
const craftAndEquipAltar = require('../use_cases/craftAndEquipAltar.js')
const Altar = require('../entities/altar.js')
const Parcel = require('../entities/parcel.js')
const Player = require('../entities/player.js')
const Gotchiverse = require('../entities/gotchiverse.js')
const rules = require('../rulesets/testRules.js')

 

test('craftAndEquipAltar', (t) => {
    let humbleParcel = Parcel.create('humble')
    let spaciousParcel = Parcel.create('spacious')
    let zeroTokens = {}
    Object.keys(rules.installations.altar.buildCosts[0]).forEach((token) => zeroTokens[token] = 0)
    const noMoneyNoParcelsPlayer = Player.addTokens(Player.create(), zeroTokens)
    const noParcelsPlayer = Player.addTokens(noMoneyNoParcelsPlayer, rules.installations.altar.buildCosts[0])
    const noMoneyPlayer = Player.addParcel(Player.addParcel(noMoneyNoParcelsPlayer, humbleParcel), spaciousParcel)
    const qualifiedPlayer = Player.addTokens(noMoneyPlayer, rules.installations.altar.buildCosts[0])
    let verse = craftAndEquipAltar(Gotchiverse.addPlayer(Gotchiverse.create(rules), qualifiedPlayer), 0, 0)
    t.equals(verse.players[0].parcels[0].installations.length, 1, 'there is one installation')
    t.equals(verse.players[0].parcels[0].installations[0].type, Altar.create().type, 'there is an installation of type altar')
    t.deepEqual(verse.players[0].tokens, zeroTokens)
    t.throws(() => craftAndEquipAltar(Gotchiverse.addPlayer(Gotchiverse.create(rules), noParcelsPlayer), 0, 0), 'throws if player does not have a parcel')
    t.throws(() => craftAndEquipAltar(Gotchiverse.addPlayer(Gotchiverse.create(rules), noMoneyPlayer), 0, 0), 'throws if player does not have enough funds')
    t.end();
});
