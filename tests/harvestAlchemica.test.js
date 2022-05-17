const test = require('tape');
const { harvestWithSingleHarvester, harvestAlchemica } = require('../use_cases/harvestAlchemica.js')
const { pipe } = require('../utils.js')
const Harvester = require('../entities/harvester.js')
const Reservoir = require('../entities/reservoir.js')
const Parcel = require('../entities/parcel.js')
const Player = require('../entities/player.js')
const Gotchiverse = require('../entities/gotchiverse.js')

test('harvestWithSingleHarvester', (t) => {
    const rules = require('../rulesets/testRules.js')

    const fudHarvesterL1 = pipe(Harvester.create('fud'), Harvester.addLevel)
    const fudReservoirL1 = pipe(Reservoir.create('fud'), Reservoir.addLevel)

    const startingFudInParcel = rules.installations.harvester_fud.harvestRates[0] * 2.5 // enough for 2 day test - runs out on 3rd day
    const oneDayInBlocks = 60 * 60 * 24 / rules.secondsPerBlock

    const noReservoirsParcel = pipe(Parcel.create('spacious'), [Parcel.addInstallation, fudHarvesterL1], [Parcel.addAlchemica, 'fud', startingFudInParcel])
    const noReservoirsPlayer = pipe(Player.create(), [Player.addParcel, noReservoirsParcel])
    const qualifiedParcel = pipe(noReservoirsParcel, [Parcel.addInstallation, fudReservoirL1], [Parcel.addInstallation, fudReservoirL1], [Parcel.addInstallation, fudReservoirL1])
    const qualifiedPlayer = pipe(Player.create(), [Player.addParcel, qualifiedParcel])

    // if the installation passed is not a harvester, throws
    t.throws(() => pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, qualifiedPlayer], [harvestWithSingleHarvester, 0, 0, 1]), 'throws if the installation is not a harvester')

    // set the rules so that the reservoir can only hold one day of fud
    rules.installations.reservoir_fud.capacities[0] = rules.installations.harvester_fud.harvestRates[0]
  
    const oneDayResult = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, qualifiedPlayer], [harvestWithSingleHarvester, 0, 0, 0, oneDayInBlocks])
    t.equals(oneDayResult.players[0].parcels[0].tokens.fud, startingFudInParcel - rules.installations.harvester_fud.harvestRates[0], 'harvesting a full day takes a full harvest rate from the parcel')
    const noReservoirsResult = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, noReservoirsPlayer], [harvestWithSingleHarvester, 0, 0, 0, oneDayInBlocks])
    t.equals(noReservoirsResult.players[0].parcels[0].tokens.fud, startingFudInParcel, 'harvesting with no reservoirs removes no alchemica from the parcel')
    const halfDayResult = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, qualifiedPlayer], [harvestWithSingleHarvester, 0, 0, 0, oneDayInBlocks / 2])
    t.equals(halfDayResult.players[0].parcels[0].tokens.fud, startingFudInParcel - rules.installations.harvester_fud.harvestRates[0] / 2, 'harvesting a half day takes a half day of harvest rate from the parcel')
    t.equals(halfDayResult.players[0].parcels[0].installations[1].tokens.fud, rules.installations.harvester_fud.harvestRates[0] / 2, 'harvested alchemica is in the reservoir')
    t.deepEqual(halfDayResult.players[0].parcels[0].installations[2].tokens, {}, 'second reservoir is empty')

    const twoDayResult = harvestWithSingleHarvester(oneDayResult, 0, 0, 0, oneDayInBlocks)
    t.equals(twoDayResult.players[0].parcels[0].installations[1].tokens.fud, rules.installations.reservoir_fud.capacities[0], 'first reservoir has not changed')
    t.equals(twoDayResult.players[0].parcels[0].installations[2].tokens.fud, rules.installations.harvester_fud.harvestRates[0], 'second reservoir is full on the second day')

    const threeDayResult = harvestWithSingleHarvester(twoDayResult, 0, 0, 0, oneDayInBlocks)
    t.equals(threeDayResult.players[0].parcels[0].tokens.fud, 0, 'third day - cannot harvest more alchemica than is in the parcel')
    t.equals(threeDayResult.players[0].parcels[0].installations[3].tokens.fud, rules.installations.harvester_fud.harvestRates[0] /  2, 'third reservoir is only half full on the third day - alchemica has run out')

    t.end()

})

test('harvestAlchemica', (t) => {
    const rules = require('../rulesets/testRules.js')

    const fudHarvesterL1 = pipe(Harvester.create('fud'), Harvester.addLevel)
    const fudReservoirL1 = pipe(Reservoir.create('fud'), Reservoir.addLevel)
    const alphaHarvesterL1 = pipe(Harvester.create('alpha'), Harvester.addLevel)
    const alphaReservoirL1 = pipe(Reservoir.create('alpha'), Reservoir.addLevel)

    // set the rules so that the reservoir can only hold one day of fud
    rules.installations.reservoir_fud.capacities[0] = rules.installations.harvester_fud.harvestRates[0]
    rules.installations.reservoir_alpha.capacities[0] = rules.installations.harvester_alpha.harvestRates[0]

    const startingFudInParcel = rules.installations.harvester_fud.harvestRates[0] * 2.5 // enough for 2 day test - runs out on 3rd day
    const startingAlphaInParcel = rules.installations.harvester_alpha.harvestRates[0] * 2.5 // enough for 2 day test - runs out on 3rd day
    const oneDayInBlocks = 60 * 60 * 24 / rules.secondsPerBlock

    const qualifiedParcel = pipe(Parcel.create('spacious'), [Parcel.addAlchemica, 'fud', startingFudInParcel], [Parcel.addAlchemica, 'alpha', startingAlphaInParcel], [Parcel.addInstallation, fudHarvesterL1], [Parcel.addInstallation, alphaHarvesterL1], [Parcel.addInstallation, fudReservoirL1], [Parcel.addInstallation, alphaReservoirL1])
    const qualifiedPlayer = pipe(Player.create(), [Player.addParcel, qualifiedParcel], [Player.addParcel, qualifiedParcel])
    const qualifiedPlayer2 = pipe(Player.create(), [Player.addParcel, qualifiedParcel])

    // set the rules so that the reservoir can only hold one day of fud
    rules.installations.reservoir_fud.capacities[0] = rules.installations.harvester_fud.harvestRates[0]

    const oneDayResult = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, qualifiedPlayer], [Gotchiverse.addPlayer, qualifiedPlayer2], [harvestAlchemica, oneDayInBlocks])
    t.equals(oneDayResult.players[0].parcels[0].tokens.fud, startingFudInParcel - rules.installations.harvester_fud.harvestRates[0], 'fud harvesters have harvested')
    t.equals(oneDayResult.players[0].parcels[0].tokens.alpha, startingAlphaInParcel - rules.installations.harvester_alpha.harvestRates[0], 'alpha harvesters have harvested')
    t.equals(oneDayResult.players[0].parcels[1].tokens.fud, startingFudInParcel - rules.installations.harvester_fud.harvestRates[0], 'second parcel was harvested')
    t.equals(oneDayResult.players[1].parcels[0].tokens.fud, startingFudInParcel - rules.installations.harvester_fud.harvestRates[0], 'second player\'s parcel was harvested')

    t.end()
})