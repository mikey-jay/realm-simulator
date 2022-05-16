const test = require('tape');
const { craftAndEquipInstallation } = require('../use_cases/craftAndEquip.js')
const Installation = require('../entities/installation.js')
const Parcel = require('../entities/parcel.js')
const Player = require('../entities/player.js')
const Gotchiverse = require('../entities/gotchiverse.js')
const Wallet = require('../entities/wallet.js')
const { pipe } = require('../utils.js')

test('craftAndEquipInstallation', (t) => {

    let humbleParcel = Parcel.create('humble')
    let spaciousParcel = Parcel.create('spacious')
    const rules = require('../rulesets/testRules.js')
    const installTypes = Object.keys(rules.installations)

    installTypes.forEach( (type) => {
        let zeroTokens = {}
        Object.keys(rules.installations[type].buildCosts[0]).forEach((token) => zeroTokens[token] = 0)
        const noMoneyNoParcelsPlayer = pipe(Player.create(), [Player.addTokens, zeroTokens])
        const noParcelsPlayer = Player.addTokens(noMoneyNoParcelsPlayer, rules.installations[type].buildCosts[0])
        const noMoneyPlayer = Player.addParcel(Player.addParcel(noMoneyNoParcelsPlayer, humbleParcel), spaciousParcel)
        const qualifiedPlayer = Player.addTokens(noMoneyPlayer, rules.installations[type].buildCosts[0])
    
        // take prerequisites out of the picture for this test
        rules.installations[type].prerequisites = []
        rules.installations[type].levelPrerequisite = undefined

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
        t.equals(verseInstantBuild.players[0].parcels[0].installations[0].timeComplete, verseInstantBuild.currentTime, 'complete time is correct (no build time)')
        t.equals(verseInstantBuild.players[0].parcels[0].installations[0].level, 1, 'instant build should advance immediately to level 1')

        let rulesWithBuildTime = structuredClone(rules)
        rulesWithBuildTime.installations[type].buildTime[0] = 9
        let verseWithBuildTime = pipe(Gotchiverse.create(rulesWithBuildTime), [Gotchiverse.addTime, 1], [Gotchiverse.addPlayer, qualifiedPlayer], [craftAndEquipInstallation, 0, 0, type])
        t.equals(verseWithBuildTime.players[0].parcels[0].installations[0].timeComplete, rulesWithBuildTime.installations[type].buildTime[0] + verseWithBuildTime.currentTime, 'build time is correct (has build time)')
        t.equals(verseWithBuildTime.players[0].parcels[0].installations[0].level, 0, 'non-instant build should show as level 0')
    })

    t.end();
});

test('craftAndEquipInstallation - crafting revenue distribution', (t) => {
    const rules = require('../rulesets/testRules.js')
    const installType = 'altar'
    const buildCost = rules.installations[installType].buildCosts[0]
    const humbleParcel = Parcel.create('humble')
    const qualifiedPlayer = pipe(Player.create(), [Player.addTokens, buildCost], [Player.addParcel, humbleParcel])
    const verse = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, qualifiedPlayer], [craftAndEquipInstallation, 0, 0, installType])
    
    Object.keys(rules.craftingRevenueDistribution).forEach((w) => {
        let distroShare = pipe(Wallet.create(), [Wallet.addTokens, buildCost, rules.craftingRevenueDistribution[w]])
        t.deepEqual(verse[w], distroShare, `${w} gets ${rules.craftingRevenueDistribution[w] * 100}% of crafting revenue`)
    });
    t.end();
});


test('craftAndEquipInstallation - installation prerequisites', (t) => {
    const rules = require('../rulesets/testRules.js')
    const installTypes = Object.keys(rules.installations)

    const type = installTypes[0]
    const prereqType = installTypes[1]

    rules.installations[type].prerequisites = [prereqType]
    rules.installations[prereqType].prerequisites = []

    const humbleParcel = Parcel.create('humble')
    let qualifiedPlayer = pipe(Player.create(), [Player.addParcel, humbleParcel], [Player.addTokens, rules.installations[type].buildCosts[0]], [Player.addTokens, rules.installations[prereqType].buildCosts[0]])
    let verse = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, qualifiedPlayer])
    t.throws(() => craftAndEquipInstallation(verse, 0, 0, type), 'cannot craft installation before prerequisite')
    t.doesNotThrow(() => pipe(verse, [craftAndEquipInstallation, 0, 0, prereqType], [craftAndEquipInstallation, 0, 0, type]), 'does not throw if prereq is installed first')
    
    t.end();
});