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
    t.equals(verse.players[0].parcels[0].installations[0].width, rules.installations.altar.width, 'has width matching rules')
    t.equals(verse.players[0].parcels[0].installations[0].height, rules.installations.altar.height, 'has height matching rules')
    t.deepEqual(verse.players[0].tokens, zeroTokens)
    t.throws(() => craftAndEquipAltar(Gotchiverse.addPlayer(Gotchiverse.create(rules), noParcelsPlayer), 0, 0), 'throws if player does not have a parcel')
    t.throws(() => craftAndEquipAltar(Gotchiverse.addPlayer(Gotchiverse.create(rules), noMoneyPlayer), 0, 0), 'throws if player does not have enough funds')

    verse.rules.installations.altar.maxQuantityPerParcel = {
        'humble': 1,
        'reasonable': 1,
        'spacious': 1,
        'partner': 1
    }

    verse.players[0] = Player.addTokens(verse.players[0], rules.installations.altar.buildCosts[0])

    t.throws(() => craftAndEquipAltar(verse, 0, 0), 'throw if try to build more than the maximum allowed ')


    verse.rules.installations.altar.maxQuantityPerParcel = {
        'humble': undefined,
        'reasonable': undefined,
        'spacious': undefined,
        'partner': undefined
    }

    t.doesNotThrow(() => craftAndEquipAltar(verse, 0, 0), 'do not throw if not maximum defined')

    let rulesInstantBuild = structuredClone(rules)
    rulesInstantBuild.installations.altar.buildTime[0] = 0
    let verseInstantBuild = craftAndEquipAltar(Gotchiverse.addPlayer(Gotchiverse.create(rulesInstantBuild), qualifiedPlayer), 0, 0)
    t.equals(verseInstantBuild.players[0].parcels[0].installations[0].buildTimeRemaining, rulesInstantBuild.installations.altar.buildTime[0], 'build time is correct (no build time)')
    t.equals(verseInstantBuild.players[0].parcels[0].installations[0].level, 1, 'instant build should advance immediately to level 1')

    let rulesWithBuildTime = structuredClone(rules)
    rulesWithBuildTime.installations.altar.buildTime[0] = 267846
    let verseWithBuildTime = craftAndEquipAltar(Gotchiverse.addPlayer(Gotchiverse.create(rulesWithBuildTime), qualifiedPlayer), 0, 0)
    t.equals(verseWithBuildTime.players[0].parcels[0].installations[0].buildTimeRemaining, rulesWithBuildTime.installations.altar.buildTime[0], 'build time is correct (has build time)')

    t.end();
});
