const test = require('tape');
const { emptyReservoirs } = require('../use_cases/emptyReservoirs.js')
const { pipe } = require('../utils.js')
const Reservoir = require('../entities/reservoir.js')
const Parcel = require('../entities/parcel.js')
const Player = require('../entities/player.js')
const Gotchiverse = require('../entities/gotchiverse.js')
const Wallet = require('../entities/wallet.js')

test('emptyReservoirs', (t) => {
    const rules = require('../rulesets/testRules.js')
    const token1 = 'fomo'
    const token2 = 'kek'
    const reservoirBalance = 100
    const reservoirL2 = pipe(Reservoir.create(token1), Reservoir.addLevel, Reservoir.addLevel)
    const reservoirL1 = pipe(Reservoir.create(token1), Reservoir.addLevel, [Reservoir.addAlchemica, reservoirBalance])
    const differentTypeReservoir = pipe(Reservoir.create(token2), Reservoir.addLevel, [Reservoir.addAlchemica, reservoirBalance])
    const spilloverRateL2 = rules.installations[reservoirL2.type].spilloverRates[reservoirL2.level - 1]
    const spilloverRateL1 = rules.installations[reservoirL1.type].spilloverRates[reservoirL1.level - 1]
    const capacityL2 = rules.installations[reservoirL2.type].capacities[reservoirL2.level - 1]
    const capacityL1 = rules.installations[reservoirL1.type].capacities[reservoirL1.level - 1]

    // calculate spillover as a weighted average
    const totalSpilloverRate = (spilloverRateL2 * capacityL2 + spilloverRateL1 * capacityL1) / (capacityL2 + capacityL1)
    
    let playerParcel = pipe(Parcel.create('reasonable'), [Parcel.addInstallation, reservoirL1], [Parcel.addInstallation, reservoirL2], [Parcel.addInstallation, differentTypeReservoir]) 
    let qualifiedPlayer = pipe(Player.create(), [Player.addParcel, playerParcel])
    
    let verse = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, qualifiedPlayer])

    const result = emptyReservoirs(verse, 0, 0)
    t.equals(Reservoir.getBalance(result.players[0].parcels[0].installations[0]), 0, 'reservoir is empty')
    t.equals(Player.getTokenBalance(result.players[0], token1), reservoirBalance * (1 - totalSpilloverRate), 'player has reservoir balance less spillover')
    t.equals(Wallet.getTokenBalance(result.spillover, token1), reservoirBalance * totalSpilloverRate, 'spillover wallet has spillover')
    t.equals(Player.getTokenBalance(result.players[0], token2), reservoirBalance * (1 - spilloverRateL1), 'player has reservoir (second type) balance less spillover')

    t.end()
})