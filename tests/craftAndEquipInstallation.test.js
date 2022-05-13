const test = require('tape');
const craftAndEquipInstallation = require('../use_cases/craftAndEquipInstallation.js')
const Installation = require('../entities/installation.js')
const Parcel = require('../entities/parcel.js')
const Player = require('../entities/player.js')
const Gotchiverse = require('../entities/gotchiverse.js')
const rules = require('../rulesets/testRules.js')

test('craftAndEquipInstallation', (t) => {

    let humbleParcel = Parcel.create('humble')
    let spaciousParcel = Parcel.create('spacious')

    Installation.installationTypes.forEach( (type) => {
        let zeroTokens = {}
        Object.keys(rules.installations[type].buildCosts[0]).forEach((token) => zeroTokens[token] = 0)
        const noMoneyNoParcelsPlayer = Player.addTokens(Player.create(), zeroTokens)
        const noParcelsPlayer = Player.addTokens(noMoneyNoParcelsPlayer, rules.installations[type].buildCosts[0])
        const noMoneyPlayer = Player.addParcel(Player.addParcel(noMoneyNoParcelsPlayer, humbleParcel), spaciousParcel)
        const qualifiedPlayer = Player.addTokens(noMoneyPlayer, rules.installations[type].buildCosts[0])
    
        let verse = craftAndEquipInstallation(Gotchiverse.addPlayer(Gotchiverse.create(rules), qualifiedPlayer), 0, 0, type)
        t.equals(verse.players[0].parcels[0].installations.length, 1, 'there is one installation')
        t.equals(verse.players[0].parcels[0].installations[0].type, type, `there is an installation of type ${type}`)
        t.equals(verse.players[0].parcels[0].installations[0].width, rules.installations[type].width, 'has width matching rules')
        t.equals(verse.players[0].parcels[0].installations[0].height, rules.installations[type].height, 'has height matching rules')
        t.deepEqual(verse.players[0].tokens, zeroTokens)
        t.throws(() => craftAndEquipInstallation(Gotchiverse.addPlayer(Gotchiverse.create(rules), noParcelsPlayer), 0, 0, type), 'throws if player does not have a parcel')
        t.throws(() => craftAndEquipInstallation(Gotchiverse.addPlayer(Gotchiverse.create(rules), noMoneyPlayer), 0, 0, type), 'throws if player does not have enough funds')

        verse.rules.installations[type].maxQuantityPerParcel = {
            'humble': 1,
            'reasonable': 1,
            'spacious': 1,
            'partner': 1
        }

        verse.players[0] = Player.addTokens(verse.players[0], rules.installations[type].buildCosts[0])

        t.throws(() => craftAndEquipInstallation(verse, 0, 0, type), 'throw if try to build more than the maximum allowed ')


        verse.rules.installations[type].maxQuantityPerParcel = {
            'humble': undefined,
            'reasonable': undefined,
            'spacious': undefined,
            'partner': undefined
        }

        t.doesNotThrow(() => craftAndEquipInstallation(verse, 0, 0, type), 'do not throw if not maximum defined')

        let rulesInstantBuild = structuredClone(rules)
        rulesInstantBuild.installations[type].buildTime[0] = 0
        let verseInstantBuild = craftAndEquipInstallation(Gotchiverse.addPlayer(Gotchiverse.create(rulesInstantBuild), qualifiedPlayer), 0, 0, type)
        t.equals(verseInstantBuild.players[0].parcels[0].installations[0].buildTimeRemaining, rulesInstantBuild.installations[type].buildTime[0], 'build time is correct (no build time)')
        t.equals(verseInstantBuild.players[0].parcels[0].installations[0].level, 1, 'instant build should advance immediately to level 1')

        let rulesWithBuildTime = structuredClone(rules)
        rulesWithBuildTime.installations[type].buildTime[0] = 267846
        let verseWithBuildTime = craftAndEquipInstallation(Gotchiverse.addPlayer(Gotchiverse.create(rulesWithBuildTime), qualifiedPlayer), 0, 0, type)
        t.equals(verseWithBuildTime.players[0].parcels[0].installations[0].buildTimeRemaining, rulesWithBuildTime.installations[type].buildTime[0], 'build time is correct (has build time)')
    })

    t.end();
});
