const test = require('tape');
const { harvestAlchemica } = require('../use_cases/harvestAlchemica.js')
const { pipe } = require('../utils.js')
const Harvester = require('../entities/harvester.js')
const Reservoir = require('../entities/reservoir.js')
const Parcel = require('../entities/parcel.js')
const Player = require('../entities/player.js')
const Gotchiverse = require('../entities/gotchiverse.js')

test('harvestAlchemica', (t) => {
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
    t.throws(() => pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, qualifiedPlayer], [harvestAlchemica, 0, 0, 1]), 'throws if the installation is not a harvester')

    // total amount of fud in the parcel has decreased by the amount in 1 day

    // set the rules so that the reservoir can only hold one day of fud
    rules.installations.reservoir_fud.capacities[0] = rules.installations.harvester_fud.harvestRates[0]
  
    const oneDayResult = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, qualifiedPlayer], [harvestAlchemica, 0, 0, 0, oneDayInBlocks])
    t.equals(oneDayResult.players[0].parcels[0].tokens.fud, startingFudInParcel - rules.installations.harvester_fud.harvestRates[0], 'harvesting a full day takes a full harvest rate from the parcel')
    const noReservoirsResult = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, noReservoirsPlayer], [harvestAlchemica, 0, 0, 0, oneDayInBlocks])
    t.equals(noReservoirsResult.players[0].parcels[0].tokens.fud, startingFudInParcel, 'harvesting with no reservoirs removes no alchemica from the parcel')
    const halfDayResult = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, qualifiedPlayer], [harvestAlchemica, 0, 0, 0, oneDayInBlocks / 2])
    t.equals(halfDayResult.players[0].parcels[0].tokens.fud, startingFudInParcel - rules.installations.harvester_fud.harvestRates[0] / 2, 'harvesting a half day takes a half day of harvest rate from the parcel')
    t.equals(halfDayResult.players[0].parcels[0].installations[1].tokens.fud, rules.installations.harvester_fud.harvestRates[0] / 2, 'harvested alchemica is in the reservoir')
    t.deepEqual(halfDayResult.players[0].parcels[0].installations[2].tokens, {}, 'second reservoir is empty')

    const twoDayResult = harvestAlchemica(oneDayResult, 0, 0, 0, oneDayInBlocks)
    t.equals(twoDayResult.players[0].parcels[0].installations[1].tokens.fud, rules.installations.reservoir_fud.capacities[0], 'first reservoir has not changed')
    t.equals(twoDayResult.players[0].parcels[0].installations[2].tokens.fud, rules.installations.harvester_fud.harvestRates[0], 'second reservoir is full on the second day')

    const threeDayResult = harvestAlchemica(twoDayResult, 0, 0, 0, oneDayInBlocks)
    t.equals(threeDayResult.players[0].parcels[0].tokens.fud, 0, 'third day - cannot harvest more alchemica than is in the parcel')
    t.equals(threeDayResult.players[0].parcels[0].installations[3].tokens.fud, rules.installations.harvester_fud.harvestRates[0] /  2, 'third reservoir is only half full on the third day - alchemica has run out')

    /**
     * 
     * NEXT - Harvester spillover
     * THEN - Empty reservoir use case
     * 
     * 
     */

    
    //t.doesNotThrow(() => pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, qualifiedPlayer], [harvestAlchemica, 0, 0, 0]), 'when there are reservoirs, does not throw')


    // the total amount of the alchemica in reservoirs and the verse spillover wallet equals the harvest rate

    // when the first reservoir is full, the alchemica flows into the next reservoir

    // when all reservoirs are full, only harvest enough to fill them

    // type of alchemica harvested matches the resourceToken

    t.end()

})