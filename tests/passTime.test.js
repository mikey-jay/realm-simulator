const test = require('tape');
const { pipe } = require('../utils.js')
const { passTime } = require('../use_cases/passTime.js')
const Reservoir = require('../entities/reservoir.js')
const Harvester = require('../entities/harvester.js')
const Maker = require('../entities/maker.js')
const Parcel = require('../entities/parcel.js')
const Player = require('../entities/player.js')
const Gotchiverse = require('../entities/gotchiverse.js')
const Wallet = require('../entities/wallet.js')

test('passTime', (t) => {
    const rules = require('../rulesets/testRules.js')
    const token1 = 'kek'
    const reservoirL1 = pipe(Reservoir.create(token1), Reservoir.addLevel)
    const harvesterL1 = pipe(Harvester.create(token1), Harvester.addLevel)
    const makerInProgress = pipe(Maker.create(), Maker.addLevel)
    makerInProgress.buildLevel += 1
    makerInProgress.timeComplete = rules.passTimeBlocks
    const humbleParcel = pipe(Parcel.create('humble'),  [Parcel.addAlchemica, token1, rules.installations[reservoirL1.type].capacities[reservoirL1.level - 1]], [Parcel.addInstallation, harvesterL1], [Parcel.addInstallation, reservoirL1], [Parcel.addInstallation, makerInProgress])

    let qualifiedPlayer = pipe(Player.create(), [Player.addParcel, humbleParcel])
    
    let verse = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, qualifiedPlayer])

    const result = passTime(verse)
    const daysPassed = rules.passTimeBlocks * rules.secondsPerBlock / 60 / 60 / 24
    t.equals(result.currentTime, rules.passTimeBlocks, 'current time has advanced')
    t.equals(Player.getTokenBalance(result.players[0], token1) + Wallet.getTokenBalance(result.spillover, token1), Math.min(rules.installations[reservoirL1.type].capacities[reservoirL1.level - 1], rules.installations[harvesterL1.type].harvestRates[harvesterL1.level - 1] * daysPassed), 'player balance plus spillover balance equals lesser of harvest amount or reservoir capacity')
    t.equals(result.players[0].parcels[0].installations[2].level, 2, 'maker has finished upgrading')
    t.end()
})