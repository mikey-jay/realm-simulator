const test = require('tape');
const craftOnlyL1FudHarvesters = require('../strategies/craftOnlyL1FudHarvesters.js')
const Parcel = require('../entities/parcel.js')
const Maker = require('../entities/maker.js')
const Harvester = require('../entities/harvester.js')
const Reservoir = require('../entities/reservoir.js')
const Altar = require('../entities/altar.js')
const Player = require('../entities/player.js')
const Gotchiverse = require('../entities/gotchiverse.js')
const { pipe } = require('../utils.js')

test('craftOnlyL1FudHarvesters - all prerequisites met', (t) => {
    const rules = require('../rulesets/testRules.js')
    
    let altarL1 = pipe(Altar.create(), Altar.addLevel)
    let reservoirL9 = { ...Reservoir.create('fud'), buildLevel: 9, level: 9 }
    let testParcel = pipe(Parcel.create('spacious'), [Parcel.addInstallation, reservoirL9], [Parcel.addInstallation, altarL1], [Parcel.addTokens, 'fud', 100000])
    let testPlayer = pipe(Player.create(), [Player.addParcel, testParcel], [Player.addTokens, rules.installations.harvester_fud.buildCosts[0]])
    let verse = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, testPlayer])

    t.equals(craftOnlyL1FudHarvesters(verse, 0, 0).name, 'craftAndEquipFudHarvester', 'all prerequisites are met - return craft harvester use case')

    t.end()
})

test('craftOnlyL1FudHarvesters - insufficient funds', (t) => {
    const rules = require('../rulesets/testRules.js')
    
    let altarL1 = pipe(Altar.create(), Altar.addLevel)
    let reservoirL9 = { ...Reservoir.create('fud'), buildLevel: 9, level: 9 }
    let testParcel = pipe(Parcel.create('spacious'), [Parcel.addInstallation, reservoirL9], [Parcel.addInstallation, altarL1], [Parcel.addTokens, 'fud', 100000])
    let testPlayer = pipe(Player.create(), [Player.addParcel, testParcel])
    let verse = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, testPlayer])

    t.false(craftOnlyL1FudHarvesters(verse, 0, 0))

    t.end()
})

test('craftOnlyL1FudHarvesters - already reached max installation count', (t) => {
    const rules = require('../rulesets/testRules.js')

    rules.installations.harvester_fud.maxQuantityPerParcel.humble = 1
    
    let altarL1 = pipe(Altar.create(), Altar.addLevel)
    let fudHarvesterL1 = pipe(Harvester.create('fud'), Harvester.addLevel)
    let reservoirL9 = { ...Reservoir.create('fud'), buildLevel: 9, level: 9 }
    let testParcel = pipe(Parcel.create('humble'), [Parcel.addInstallation, reservoirL9], [Parcel.addInstallation, altarL1], [Parcel.addInstallation, fudHarvesterL1],[Parcel.addTokens, 'fud', 100000])
    let testPlayer = pipe(Player.create(), [Player.addParcel, testParcel], [Player.addTokens, rules.installations.harvester_fud.buildCosts[0]])
    let verse = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, testPlayer])

    t.false(craftOnlyL1FudHarvesters(verse, 0, 0))

    t.end()
})

test('craftOnlyL1FudHarvesters - missing preqrequisite - build prerequisite first', (t) => {
    const rules = require('../rulesets/testRules.js')
    rules.installations.harvester_fud.prerequisites = ['altar']
    let altarL1 = pipe(Altar.create(), Altar.addLevel)
    let fudHarvesterL1 = pipe(Harvester.create('fomo'), Harvester.addLevel)
    let reservoirL9 = { ...Reservoir.create('fud'), buildLevel: 9, level: 9 }
    let testParcel = pipe(Parcel.create('humble'), [Parcel.addInstallation, reservoirL9], [Parcel.addInstallation, fudHarvesterL1],[Parcel.addTokens, 'fud', 100000])
    let testPlayer = pipe(Player.create(), [Player.addParcel, testParcel], [Player.addTokens, rules.installations.harvester_fud.buildCosts[0]])
    let verse = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, testPlayer])

    t.equals(craftOnlyL1FudHarvesters(verse, 0, 0).name, 'craftAndEquipAltar')

    t.end()
})

test('craftOnlyL1FudHarvesters - no space for installation', (t) => {
    const rules = require('../rulesets/testRules.js')
    
    let altarL1 = pipe(Altar.create(), Altar.addLevel)
    let reservoirL9 = { ...Reservoir.create('fud'), buildLevel: 9, level: 9 }
    let testParcel = pipe(Parcel.create('spacious'), [Parcel.addInstallation, reservoirL9], [Parcel.addInstallation, altarL1], [Parcel.addTokens, 'fud', 100000])
    let testPlayer = pipe(Player.create(), [Player.addParcel, testParcel], [Player.addTokens, rules.installations.harvester_fud.buildCosts[0]])

    let verse = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, testPlayer])

    verse.players[0].parcels[0].height = 2
    verse.players[0].parcels[0].width = 2

    t.false(craftOnlyL1FudHarvesters(verse, 0, 0))

    t.end()
})

test('craftOnlyL1FudHarvesters - craft a reservoir first', (t) => {
    const rules = require('../rulesets/testRules.js')
    
    let altarL1 = pipe(Altar.create(), Altar.addLevel)
    let testParcel = pipe(Parcel.create('spacious'), [Parcel.addInstallation, altarL1], [Parcel.addTokens, 'fud', 100000])
    let testPlayer = pipe(Player.create(), [Player.addParcel, testParcel], [Player.addTokens, rules.installations.harvester_fud.buildCosts[0]])
    let verse = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, testPlayer])

    t.equals(craftOnlyL1FudHarvesters(verse, 0, 0).name, 'craftAndEquipFudReservoir', 'missing reservoir - craft one first')

    t.end()
})

test('craftOnlyL1FudHarvesters - upgrade reservoir if there is not enough capacity to meet emptying frequency', (t) => {
    const rules = require('../rulesets/testRules.js')
    
    let altarL1 = pipe(Altar.create(), Altar.addLevel)
    let reservoirL1 = pipe(Reservoir.create('fud'), Reservoir.addLevel)
    let harvesterL1 = pipe(Harvester.create('fud'), Harvester.addLevel)
    let testParcel = pipe(Parcel.create('spacious'), [Parcel.addInstallation, harvesterL1], [Parcel.addInstallation, harvesterL1], [Parcel.addInstallation, reservoirL1], [Parcel.addInstallation, altarL1], [Parcel.addTokens, 'fud', 100000])
    let testPlayer = pipe(Player.create(), [Player.addParcel, testParcel], [Player.addTokens, rules.installations.reservoir_fud.buildCosts[1]])
    let verse = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, testPlayer])
    verse.rules.installations.reservoir_fud.capacities[0] = 1
    t.equals(craftOnlyL1FudHarvesters(verse, 0, 0).name, 'upgradeLowestLevelFudReservoir')

    t.end()
})

test('craftOnlyL1FudHarvesters - do not upgrade reservoir if one is already being upgraded', (t) => {
    const rules = require('../rulesets/testRules.js')
    
    let altarL1 = pipe(Altar.create(), Altar.addLevel)
    let reservoirL1 = pipe(Reservoir.create('fud'), Reservoir.addLevel)
    reservoirL1.buildLevel = 2
    let harvesterL1 = pipe(Harvester.create('fud'), Harvester.addLevel)
    let testParcel = pipe(Parcel.create('spacious'), [Parcel.addInstallation, harvesterL1], [Parcel.addInstallation, harvesterL1], [Parcel.addInstallation, reservoirL1], [Parcel.addInstallation, altarL1], [Parcel.addTokens, 'fud', 100000])
    let testPlayer = pipe(Player.create(), [Player.addParcel, testParcel], [Player.addTokens, rules.installations.reservoir_fud.buildCosts[1]])
    let verse = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, testPlayer])
    verse.rules.installations.reservoir_fud.capacities[0] = 1
    t.false(craftOnlyL1FudHarvesters(verse, 0, 0))

    t.end()
})

test('craftOnlyL1FudHarvesters - upgrade level prerequisites before upgrading reservoir', (t) => {
    const rules = require('../rulesets/testRules.js')
    
    let altarL1 = pipe(Altar.create(), Altar.addLevel)
    let reservoirL1 = pipe(Reservoir.create('fud'), Reservoir.addLevel)
    let harvesterL1 = pipe(Harvester.create('fud'), Harvester.addLevel)
    let testParcel = pipe(Parcel.create('spacious'), [Parcel.addInstallation, harvesterL1], [Parcel.addInstallation, harvesterL1], [Parcel.addInstallation, reservoirL1], [Parcel.addInstallation, altarL1], [Parcel.addTokens, 'fud', 100000])
    let testPlayer = pipe(Player.create(), [Player.addParcel, testParcel], [Player.addTokens, rules.installations.reservoir_fud.buildCosts[1]])
    let verse = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, testPlayer])
    verse.rules.installations.reservoir_fud.capacities[0] = 1
    verse.rules.installations.reservoir_fud.levelPrerequisite = 'altar'
    t.equals(craftOnlyL1FudHarvesters(verse, 0, 0).name, 'upgradeHighestLevelAltar')

    t.end()
})

test('craftOnlyL1FudHarvesters - craft a maker if out of max concurrent upgrades', (t) => {
    const rules = require('../rulesets/testRules.js')
    
    let altarL1 = pipe(Altar.create(), Altar.addLevel)
    altarL1.buildLevel++
    let reservoirL1 = pipe(Reservoir.create('fud'), Reservoir.addLevel)
    let harvesterL1 = pipe(Harvester.create('fud'), Harvester.addLevel)
    let testParcel = pipe(Parcel.create('spacious'), [Parcel.addInstallation, harvesterL1], [Parcel.addInstallation, harvesterL1], [Parcel.addInstallation, reservoirL1], [Parcel.addInstallation, altarL1], [Parcel.addTokens, 'fud', 100000])
    let testPlayer = pipe(Player.create(), [Player.addParcel, testParcel], [Player.addTokens, rules.installations.reservoir_fud.buildCosts[1]])
    let verse = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, testPlayer])
    verse.rules.installations.reservoir_fud.capacities[0] = 1
    verse.rules.maxConcurrentUpgrades = 1
    t.equals(craftOnlyL1FudHarvesters(verse, 0, 0).name, 'craftAndEquipMaker')

    t.end()
})

test('craftOnlyL1FudHarvesters - upgrade a maker if upgrading another installation would max out concurrent upgrades', (t) => {
    const rules = require('../rulesets/testRules.js')
    
    let altarL1 = pipe(Altar.create(), Altar.addLevel)
    altarL1.buildLevel++
    let reservoirL1 = pipe(Reservoir.create('fud'), Reservoir.addLevel)
    let harvesterL1 = pipe(Harvester.create('fud'), Harvester.addLevel)
    let makerL1 = pipe(Maker.create('fud'), Maker.addLevel)
    let testParcel = pipe(Parcel.create('spacious'), [Parcel.addInstallation, makerL1], [Parcel.addInstallation, harvesterL1], [Parcel.addInstallation, harvesterL1], [Parcel.addInstallation, reservoirL1], [Parcel.addInstallation, altarL1], [Parcel.addTokens, 'fud', 100000])
    let testPlayer = pipe(Player.create(), [Player.addParcel, testParcel], [Player.addTokens, rules.installations.maker.buildCosts[1]])
    let verse = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, testPlayer])
    verse.rules.installations.reservoir_fud.capacities[0] = 1
    verse.rules.maxConcurrentUpgrades = 1
    t.equals(craftOnlyL1FudHarvesters(verse, 0, 0).name, 'upgradeLowestLevelMaker')

    t.end()
})