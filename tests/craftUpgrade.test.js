const test = require('tape');
const { craftUpgrade } = require('../use_cases/craftUpgrade.js')
const { pipe } = require('../utils.js')
const Installation = require('../entities/installation.js')
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

    /**
     * NEXT UP - maker level limits simultaneous upgrades
     * THEN - on to harvesting use cases (see google doc)
     */


    t.end()
});