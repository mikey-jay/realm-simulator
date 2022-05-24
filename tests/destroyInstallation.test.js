const test = require('tape');
const { pipe, sumArray } = require('../utils.js')
const Reservoir = require('../entities/reservoir.js')
const Parcel = require('../entities/parcel.js')
const Player = require('../entities/player.js')
const Altar = require('../entities/altar.js')
const Harvester = require('../entities/harvester.js')
const Gotchiverse = require('../entities/gotchiverse.js')
const Wallet = require('../entities/wallet.js');
const { destroyInstallation, destroyAllInstallations, getDestroyValueOfAllInstallations } = require('../use_cases/destroyInstallation.js');

test('destroyInstallation - installation is removed and player is given the alchemica', (t) => {
    const rules = require('../rulesets/testRules.js')
    const testAltar = pipe(Altar.create(), Altar.addLevel, Altar.addLevel)
    const testParcel = pipe(Parcel.create('humble'), [Parcel.addInstallation, testAltar])
    const testPlayer = pipe(Player.create(), [Player.addParcel, testParcel])
    const verse = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, testPlayer])
    const result = destroyInstallation(verse, 0, 0, 0)
    const destroyRate = verse.rules.destroyInstallationValueRate
    const destroyValue = pipe(Wallet.create(), [Wallet.addTokens, verse.rules.installations.altar.buildCosts[0], destroyRate], [Wallet.addTokens, verse.rules.installations.altar.buildCosts[1], destroyRate])
    t.equals(result.players[0].parcels[0].installations.length, 0)
    t.deepEqual(result.players[0].tokens, destroyValue.tokens)
    t.end()
})

test('destroyAllInstallations - all installations are destroyed', (t) => {
    const rules = require('../rulesets/testRules.js')
    const testAltar = pipe(Altar.create(), Altar.addLevel, Altar.addLevel)
    const testHarvester = pipe(Harvester.create('fud'), Harvester.addLevel)
    const testParcel = pipe(Parcel.create('humble'), [Parcel.addInstallation, testHarvester], [Parcel.addInstallation, testAltar])
    const testPlayer = pipe(Player.create(), [Player.addParcel, testParcel])
    const verse = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, testPlayer])
    const result = destroyAllInstallations(verse, 0, 0)
    const destroyRate = verse.rules.destroyInstallationValueRate
    const destroyValue = pipe(Wallet.create(), [Wallet.addTokens, verse.rules.installations.harvester_fud.buildCosts[0], destroyRate],[Wallet.addTokens, verse.rules.installations.altar.buildCosts[0], destroyRate], [Wallet.addTokens, verse.rules.installations.altar.buildCosts[1], destroyRate])
    t.equals(result.players[0].parcels[0].installations.length, 0)
    t.deepEqual(result.players[0].tokens, destroyValue.tokens)
    t.end()
})

test('destroyAllInstallations - getDestroyValueOfAllInstallations', (t) => {
    const rules = require('../rulesets/testRules.js')
    const testAltar = pipe(Altar.create(), Altar.addLevel, Altar.addLevel)
    const testHarvester = pipe(Harvester.create('fud'), Harvester.addLevel)
    const testParcel = pipe(Parcel.create('humble'), [Parcel.addInstallation, testHarvester], [Parcel.addInstallation, testAltar])
    const testPlayer = pipe(Player.create(), [Player.addParcel, testParcel])
    const verse = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, testPlayer])
    const result = destroyAllInstallations(verse, 0, 0)
    const destroyRate = verse.rules.destroyInstallationValueRate
    const destroyValue = getDestroyValueOfAllInstallations(verse, 0, 0)
    t.deepEqual(result.players[0].tokens, destroyValue)
    t.end()
})