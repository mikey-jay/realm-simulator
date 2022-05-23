const test = require('tape');
const Parcel = require('../entities/parcel.js')
const Maker = require('../entities/maker.js')
const Harvester = require('../entities/harvester.js')
const Reservoir = require('../entities/reservoir.js')
const Altar = require('../entities/altar.js')
const Player = require('../entities/player.js')
const Gotchiverse = require('../entities/gotchiverse.js')
const { pipe } = require('../utils.js');
const expandVertical = require('../strategies/expandVertical.js');

test('expandHorizontal - all else equal, choose fud', (t) => {
    const rules = require('../rulesets/testRules.js')
    
    let altarL1 = pipe(Altar.create(), Altar.addLevel)
    let reservoirL9 = { ...Reservoir.create('fud'), buildLevel: 9, level: 9 }
    let harvesterL1 = pipe(Harvester.create('fud'), Harvester.addLevel)
    let testParcel = pipe(Parcel.create('spacious'), [Parcel.addInstallation, harvesterL1], [Parcel.addInstallation, reservoirL9], [Parcel.addInstallation, altarL1], [Parcel.addTokens, rules.parcelTokenAllocation, 0.01])
    let testPlayer = pipe(Player.create(), [Player.addParcel, testParcel], [Player.addTokens, rules.installations.harvester_fud.buildCosts[1]])
    let verse = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, testPlayer])

    t.equals(expandVertical(verse, 0, 0).name, 'upgradeLowestLevelFudHarvester', 'upgrade before crafting')

    t.end()
})

test('expandVertical - if cannot upgrade, then craft', (t) => {
    const rules = require('../rulesets/testRules.js')
    
    let altarL1 = pipe(Altar.create(), Altar.addLevel)
    let reservoirL9 = { ...Reservoir.create('fud'), buildLevel: 9, level: 9 }
    let harvester = pipe(Harvester.create('fud'), Harvester.addLevel)
    harvester.level = 9
    harvester.buildLevel = 9
    let testParcel = pipe(Parcel.create('spacious'), [Parcel.addInstallation, harvester], [Parcel.addInstallation, reservoirL9], [Parcel.addInstallation, altarL1], [Parcel.addTokens, rules.parcelTokenAllocation, 0.01])
    let testPlayer = pipe(Player.create(), [Player.addParcel, testParcel], [Player.addTokens, rules.installations.harvester_fud.buildCosts[1]])
    let verse = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, testPlayer])
    const result = expandVertical(verse, 0, 0, ['fud'])
    t.equals(result.name, 'craftAndEquipFudHarvester', 'upgrade before crafting')

    t.end()
})