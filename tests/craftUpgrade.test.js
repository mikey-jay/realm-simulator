const test = require('tape');
const { craftUpgrade } = require('../use_cases/craftUpgrade.js')
const { pipe } = require('../utils.js')
const Installation = require('../entities/installation.js')
const Harvester = require('../entities/harvester.js')
const Maker = require('../entities/maker.js')
const Parcel = require('../entities/parcel.js')
const Player = require('../entities/player.js')
const Gotchiverse = require('../entities/gotchiverse.js')

test('upgradeInstallation', (t) => {
    const rules = require('../rulesets/testRules.js')
    const installationType = 'altar'
    const startingLevel = 2
    const buildCosts = rules.installations[installationType].buildCosts[startingLevel]

    let zeroTokens = {}
    Object.keys(buildCosts).forEach((token) => zeroTokens[token] = 0)

    let installation = Installation.create(installationType)
    installation.level = startingLevel
    installation.buildLevel = startingLevel
    let parcelWithInstallation = pipe(Parcel.create('spacious'), [Parcel.addInstallation, installation])
    const qualifiedPlayer = pipe(Player.create(), [Player.addParcel, parcelWithInstallation], [Player.addTokens, buildCosts])
    let verse = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, qualifiedPlayer], [craftUpgrade, 0, 0, 0])
    t.equals(verse.players[0].parcels[0].installations[0].buildLevel, startingLevel + 1, 'buildLevel has increased')
    t.equals(verse.players[0].parcels[0].installations[0].level, startingLevel, 'current level has not increased')
    t.true(verse.players[0].parcels[0].installations[0].timeComplete > verse.currentTime, 'has a completion time in the future')
    t.deepEqual(verse.players[0].tokens, zeroTokens, 'player funds have been spent')

    // reset the player and start with an installation that has a buildLevel higher than its current level
    // (upgrade in progress case)
    verse.players[0] = structuredClone(qualifiedPlayer)
    verse.players[0].parcels[0].installations[0].level = startingLevel - 1
    t.throws(() => craftUpgrade(verse, 0, 0, 0), 'upgrading not allowed if another upgrade is in progress')

    // upgrade with no build time finishes instantly
    verse.players[0] = structuredClone(qualifiedPlayer)
    verse.rules.installations[installationType].buildTime[startingLevel] = 0
    let verse2 = craftUpgrade(verse, 0, 0, 0)
    t.equals(verse2.players[0].parcels[0].installations[0].level, startingLevel + 1, 'level also increases with 0 build time')

    // upgrades max out at L9
    verse.players[0] = Player.addTokens(qualifiedPlayer, rules.installations[installationType].buildCosts[8])
    verse.players[0].parcels[0].installations[0].level = 9
    verse.players[0].parcels[0].installations[0].buildLevel = 9
    t.throws(() => craftUpgrade(verse, 0, 0, 0), 'upgrading not allowed past level 9')

    // upgrades limited by another installation's level
    verse.players[0] = structuredClone(qualifiedPlayer)
    verse.players[0].parcels[0] = Parcel.addInstallation(verse.players[0].parcels[0], 'harvester')
    verse.players[0].parcels[0].installations[1].level = startingLevel
    verse.players[0].parcels[0].installations[1].buildLevel = startingLevel
    t.throws(() => craftUpgrade(verse, 0, 0, 1), 'upgrading not allowed if level is limited by another installation\'s level')

    t.end()
});

test('upgradeInstallation - concurrent upgrade limits', (t) => {
    const rules = require('../rulesets/testRules.js')
    const startingLevel = 2
    const harvesterUpgradeCosts = rules.installations['reservoir_fud'].buildCosts[startingLevel]

    // take prerequisite rules out of the picture
    rules.installations['harvester_fud'].prerequisites = []
    rules.installations['harvester_fud'].levelPrerequisite = undefined
    rules.maxConcurrentUpgrades = 1

    let harvester = Harvester.create('fud')
    harvester.level = startingLevel
    harvester.buildLevel = startingLevel
    let parcelWithInstallations = pipe(Parcel.create('spacious'), [Parcel.addInstallation, harvester], [Parcel.addInstallation, harvester])
    let maker = pipe(Maker.create(), Installation.addLevel)
    let parcelWithMaker = Parcel.addInstallation(parcelWithInstallations, maker)
    const playerWithoutMaker = pipe(Player.create(), [Player.addParcel, parcelWithInstallations], [Player.addTokens, harvesterUpgradeCosts, 2])
    const playerWithMaker = pipe(Player.create(), [Player.addParcel, parcelWithMaker], [Player.addTokens, harvesterUpgradeCosts, 2])

    t.doesNotThrow(() => pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, playerWithoutMaker], [craftUpgrade, 0, 0, 0]), 'trying to upgrade a single installation does not throw')
    t.throws(() => pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, playerWithoutMaker], [craftUpgrade, 0, 0, 0], [craftUpgrade, 0, 0, 1]), 'trying to upgrade a second installation throws')
    t.doesNotThrow(() => pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, playerWithMaker], [craftUpgrade, 0, 0, 0], [craftUpgrade, 0, 0, 1]), 'trying to upgrade a second installation with a maker does not throw')

    t.end()
});