const test = require('tape');
const expandHorizontal = require('../strategies/expandHorizontal.js')
const Parcel = require('../entities/parcel.js')
const Maker = require('../entities/maker.js')
const Harvester = require('../entities/harvester.js')
const Reservoir = require('../entities/reservoir.js')
const Altar = require('../entities/altar.js')
const Player = require('../entities/player.js')
const Gotchiverse = require('../entities/gotchiverse.js')
const { pipe } = require('../utils.js');

test('expandHorizontal - choose the most abundant alchemica to harvest', (t) => {
    const rules = require('../rulesets/testRules.js')
    
    let altarL1 = pipe(Altar.create(), Altar.addLevel)
    let reservoirL9 = { ...Reservoir.create('alpha'), buildLevel: 9, level: 9 }
    let testParcel = pipe(Parcel.create('spacious'), [Parcel.addInstallation, reservoirL9], [Parcel.addInstallation, altarL1], [Parcel.addTokens, 'alpha', 100], [Parcel.addTokens, rules.parcelTokenAllocation, 0.01])
    let testPlayer = pipe(Player.create(), [Player.addParcel, testParcel], [Player.addTokens, rules.installations.harvester_fud.buildCosts[0]])
    let verse = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, testPlayer])

    t.equals(expandHorizontal(verse, 0, 0).name, 'craftAndEquipAlphaHarvester', 'all prerequisites are met - return craft fomo harvester use case')

    t.end()
})

test('expandHorizontal - all else equal, choose fud', (t) => {
    const rules = require('../rulesets/testRules.js')
    
    let altarL1 = pipe(Altar.create(), Altar.addLevel)
    let reservoirL9 = { ...Reservoir.create('fud'), buildLevel: 9, level: 9 }
    let testParcel = pipe(Parcel.create('spacious'), [Parcel.addInstallation, reservoirL9], [Parcel.addInstallation, altarL1], [Parcel.addTokens, rules.parcelTokenAllocation, 0.01])
    let testPlayer = pipe(Player.create(), [Player.addParcel, testParcel], [Player.addTokens, rules.installations.harvester_fud.buildCosts[0]])
    let verse = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, testPlayer])

    t.equals(expandHorizontal(verse, 0, 0).name, 'craftAndEquipFudHarvester', 'all prerequisites are met - return craft fomo harvester use case')

    t.end()
})


test('expandHorizontal - insufficient funds', (t) => {
    const rules = require('../rulesets/testRules.js')
    
    let altarL1 = pipe(Altar.create(), Altar.addLevel)
    let reservoirL9 = { ...Reservoir.create('fud'), buildLevel: 9, level: 9 }
    let testParcel = pipe(Parcel.create('spacious'), [Parcel.addInstallation, reservoirL9], [Parcel.addInstallation, altarL1], [Parcel.addTokens, 'fud', 100000])
    let testPlayer = pipe(Player.create(), [Player.addParcel, testParcel])
    let verse = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, testPlayer])

    t.false(expandHorizontal(verse, 0, 0, ['fud']))

    t.end()
})

// todo: side effects issue with this test???
test.skip('expandHorizontal - already reached max installation count', (t) => {
    const rules = require('../rulesets/testRules.js')

    rules.installations.harvester_fud.maxQuantityPerParcel.humble = 1
    
    let altarL1 = pipe(Altar.create(), Altar.addLevel)
    let fudHarvesterL1 = pipe(Harvester.create('fud'), Harvester.addLevel)
    let reservoirL9 = { ...Reservoir.create('fud'), buildLevel: 9, level: 9 }
    let testParcel = pipe(Parcel.create('humble'), [Parcel.addInstallation, reservoirL9], [Parcel.addInstallation, altarL1], [Parcel.addInstallation, fudHarvesterL1],[Parcel.addTokens, 'fud', 100000])
    let testPlayer = pipe(Player.create(), [Player.addParcel, testParcel], [Player.addTokens, rules.installations.harvester_fud.buildCosts[0]])
    let verse = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, testPlayer])

    t.false(expandHorizontal(verse, 0, 0, ['fud']))

    t.end()
})


test('expandHorizontal - missing preqrequisite - build prerequisite first', (t) => {
    const rules = require('../rulesets/testRules.js')
    rules.installations.harvester_fud.prerequisites = ['altar']
    let altarL1 = pipe(Altar.create(), Altar.addLevel)
    let fudHarvesterL1 = pipe(Harvester.create('fomo'), Harvester.addLevel)
    let reservoirL9 = { ...Reservoir.create('fud'), buildLevel: 9, level: 9 }
    let testParcel = pipe(Parcel.create('humble'), [Parcel.addInstallation, reservoirL9], [Parcel.addInstallation, fudHarvesterL1],[Parcel.addTokens, 'fud', 100000])
    let testPlayer = pipe(Player.create(), [Player.addParcel, testParcel], [Player.addTokens, rules.installations.harvester_fud.buildCosts[0]])
    let verse = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, testPlayer])

    t.equals(expandHorizontal(verse, 0, 0, ['fud']).name, 'craftAndEquipAltar')

    t.end()
})

test('expandHorizontal - no space for installation', (t) => {
    const rules = require('../rulesets/testRules.js')
    
    let altarL1 = pipe(Altar.create(), Altar.addLevel)
    let reservoirL9 = { ...Reservoir.create('fud'), buildLevel: 9, level: 9 }
    let testParcel = pipe(Parcel.create('spacious'), [Parcel.addInstallation, reservoirL9], [Parcel.addInstallation, altarL1], [Parcel.addTokens, 'fud', 100000])
    let testPlayer = pipe(Player.create(), [Player.addParcel, testParcel], [Player.addTokens, rules.installations.harvester_fud.buildCosts[0]])

    let verse = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, testPlayer])

    verse.players[0].parcels[0].height = 2
    verse.players[0].parcels[0].width = 2

    t.false(expandHorizontal(verse, 0, 0, ['fud']))

    t.end()
})

test('expandHorizontal - craft a reservoir first', (t) => {
    const rules = require('../rulesets/testRules.js')
    
    let altarL1 = pipe(Altar.create(), Altar.addLevel)
    let testParcel = pipe(Parcel.create('spacious'), [Parcel.addInstallation, altarL1], [Parcel.addTokens, 'fud', 100000])
    let testPlayer = pipe(Player.create(), [Player.addParcel, testParcel], [Player.addTokens, rules.installations.harvester_fud.buildCosts[0]])
    let verse = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, testPlayer])

    t.equals(expandHorizontal(verse, 0, 0, ['fud']).name, 'craftAndEquipFudReservoir', 'missing reservoir - craft one first')

    t.end()
})

test('expandHorizontal - upgrade reservoir if there is not enough capacity to meet emptying frequency', (t) => {
    const rules = require('../rulesets/testRules.js')
    
    let altarL1 = pipe(Altar.create(), Altar.addLevel)
    let reservoirL1 = pipe(Reservoir.create('fud'), Reservoir.addLevel)
    let harvesterL1 = pipe(Harvester.create('fud'), Harvester.addLevel)
    let testParcel = pipe(Parcel.create('spacious'), [Parcel.addInstallation, harvesterL1], [Parcel.addInstallation, harvesterL1], [Parcel.addInstallation, reservoirL1], [Parcel.addInstallation, altarL1], [Parcel.addTokens, 'fud', 100000])
    let testPlayer = pipe(Player.create(), [Player.addParcel, testParcel], [Player.addTokens, rules.installations.reservoir_fud.buildCosts[1]])
    let verse = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, testPlayer])
    verse.rules.installations.reservoir_fud.capacities[0] = 1
    t.equals(expandHorizontal(verse, 0, 0, ['fud']).name, 'upgradeLowestLevelFudReservoir')

    t.end()
})

test('expandHorizontal - do not upgrade reservoir if one is already being upgraded', (t) => {
    const rules = require('../rulesets/testRules.js')
    
    let altarL1 = pipe(Altar.create(), Altar.addLevel)
    let reservoirL1 = pipe(Reservoir.create('fud'), Reservoir.addLevel)
    reservoirL1.buildLevel = 2
    let harvesterL1 = pipe(Harvester.create('fud'), Harvester.addLevel)
    let testParcel = pipe(Parcel.create('spacious'), [Parcel.addInstallation, harvesterL1], [Parcel.addInstallation, harvesterL1], [Parcel.addInstallation, reservoirL1], [Parcel.addInstallation, altarL1], [Parcel.addTokens, 'fud', 100000])
    let testPlayer = pipe(Player.create(), [Player.addParcel, testParcel], [Player.addTokens, rules.installations.reservoir_fud.buildCosts[1]])
    let verse = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, testPlayer])
    verse.rules.installations.reservoir_fud.capacities[0] = 1
    t.equals(expandHorizontal(verse, 0, 0, ['fud']).name, 'craftAndEquipFudHarvester')

    t.end()
})

test('expandHorizontal - upgrade level prerequisites before upgrading reservoir', (t) => {
    const rules = require('../rulesets/testRules.js')
    
    let altarL1 = pipe(Altar.create(), Altar.addLevel)
    let reservoirL1 = pipe(Reservoir.create('fud'), Reservoir.addLevel)
    let harvesterL1 = pipe(Harvester.create('fud'), Harvester.addLevel)
    let testParcel = pipe(Parcel.create('spacious'), [Parcel.addInstallation, harvesterL1], [Parcel.addInstallation, harvesterL1], [Parcel.addInstallation, reservoirL1], [Parcel.addInstallation, altarL1], [Parcel.addTokens, 'fud', 100000])
    let testPlayer = pipe(Player.create(), [Player.addParcel, testParcel], [Player.addTokens, rules.installations.reservoir_fud.buildCosts[1]])
    let verse = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, testPlayer])
    verse.rules.installations.reservoir_fud.capacities[0] = 1
    verse.rules.installations.reservoir_fud.levelPrerequisite = 'altar'
    t.equals(expandHorizontal(verse, 0, 0, ['fud']).name, 'upgradeHighestLevelAltar')

    t.end()
})

test('expandHorizontal - craft a maker if out of max concurrent upgrades', (t) => {
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
    t.equals(expandHorizontal(verse, 0, 0, ['fud']).name, 'craftAndEquipMaker')

    t.end()
})

test('expandHorizontal - upgrade a maker if upgrading another installation would max out concurrent upgrades', (t) => {
    const rules = require('../rulesets/testRules.js')
    
    let altarL1 = pipe(Altar.create(), Altar.addLevel)
    let reservoirL1 = pipe(Reservoir.create('fud'), Reservoir.addLevel)
    let harvesterL1 = pipe(Harvester.create('fud'), Harvester.addLevel)
    let harvesterL1UpgradeInProgress = pipe(Harvester.create('fud'), Harvester.addLevel) ; harvesterL1UpgradeInProgress.buildLevel++
    let makerL1 = pipe(Maker.create('fud'), Maker.addLevel)
    let testParcel = pipe(Parcel.create('spacious'), [Parcel.addInstallation, makerL1], [Parcel.addInstallation, harvesterL1UpgradeInProgress], [Parcel.addInstallation, harvesterL1], [Parcel.addInstallation, reservoirL1], [Parcel.addInstallation, altarL1], [Parcel.addTokens, 'fud', 100000])
    let testPlayer = pipe(Player.create(), [Player.addParcel, testParcel], [Player.addTokens, rules.installations.maker.buildCosts[1]])
    let verse = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, testPlayer])
    verse.rules.installations.reservoir_fud.capacities[0] = 1
    verse.rules.maxConcurrentUpgrades = 1
    t.equals(expandHorizontal(verse, 0, 0, ['fud']).name, 'upgradeLowestLevelMaker')

    t.end()
})

test('expandHorizontal - dont upgrade maker if it would exceed a prerequisite level', (t) => {
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
    verse.rules.installations.reservoir_fud.levelPrerequisite = 'altar'
    verse.rules.installations.maker.levelPrerequisite = 'altar'
    const result = expandHorizontal(verse, 0, 0, ['fud'])
    t.false(result)

    t.end()
})

test('expandHorizontal - if cant craft new harvesters, start upgrading', (t) => {
    const rules = require('../rulesets/testRules.js')
    rules.maxQuantityPerInstallationClass.harvester.humble = 1
    let altarL1 = pipe(Altar.create(), Altar.addLevel)
    let reservoirL9 = { ...Reservoir.create('fud'), buildLevel: 9, level: 9 }
    let harvesterL1 = pipe(Harvester.create('fud'), Harvester.addLevel)
    let testParcel = pipe(Parcel.create('humble'), [Parcel.addInstallation, harvesterL1], [Parcel.addInstallation, reservoirL9], [Parcel.addInstallation, altarL1], [Parcel.addTokens, rules.parcelTokenAllocation, 0.01])
    let testPlayer = pipe(Player.create(), [Player.addParcel, testParcel], [Player.addTokens, rules.installations.harvester_fud.buildCosts[1]])
    let verse = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, testPlayer])
    const result = expandHorizontal(verse, 0, 0)
    t.equals(result.name, 'upgradeLowestLevelFudHarvester', 'new harvester limit reached - upgrade the lowest level harvester')

    t.end()
})

test('expandHorizontal - if waiting on reservoir upgrade to craft next harvester, dont upgrade harvester until the limit has been reached', (t) => {
    const rules = require('../rulesets/testRules.js')
    
    let altarL1 = pipe(Altar.create(), Altar.addLevel)
    let reservoirL1 = pipe(Reservoir.create('fud'), Reservoir.addLevel)
    reservoirL1.buildLevel = 2
    let harvesterL1 = pipe(Harvester.create('fud'), Harvester.addLevel)
    let testParcel = pipe(Parcel.create('spacious'), [Parcel.addInstallation, harvesterL1], [Parcel.addInstallation, harvesterL1], [Parcel.addInstallation, reservoirL1], [Parcel.addInstallation, altarL1], [Parcel.addTokens, 'fud', 100000])
    let testPlayer = pipe(Player.create(), [Player.addParcel, testParcel], [Player.addTokens, rules.installations.reservoir_fud.buildCosts[1]])
    let verse = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, testPlayer])
    verse.rules.installations.reservoir_fud.capacities[0] = 1
    verse.rules.installations.reservoir_fud.capacities[1] = 1
    verse.rules.maxConcurrentUpgrades = 1
    t.false(expandHorizontal(verse, 0, 0, ['fud']))

    t.end()
})

/*
test('expandHorizontal - if harvest rate is above the rate needed to exhaust parcel in remaining time, do nothing', (t) => {
    const rules = require('../rulesets/testRules.js')
    
    let altarL1 = pipe(Altar.create(), Altar.addLevel)
    let reservoirL9 = { ...Reservoir.create('alpha'), buildLevel: 9, level: 9 }
    let harvesterL8 = { ...Harvester.create('alpha'), buildLevel: 8, level: 8 }

    let testParcel = pipe(Parcel.create('spacious'), [Parcel.addInstallation, harvesterL8], [Parcel.addInstallation, reservoirL9], [Parcel.addInstallation, altarL1], [Parcel.addTokens, 'alpha', 1])
    let testPlayer = pipe(Player.create(), [Player.addParcel, testParcel], [Player.addTokens, rules.installations.harvester_alpha.buildCosts[0]])
    let verse = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, testPlayer])
    const blocksInOneDay = 60 * 60 * 24 / rules.secondsPerBlock
    verse.currentTime = rules.surveyingRoundStartTimes[rules.surveyingRoundStartTimes.length - 1] + rules.surveyingRoundBlocks - blocksInOneDay
    const result = expandHorizontal(verse, 0, 0, ['alpha'])
    t.false(result)

    t.end()
})

 test('expandHorizontal - in last round, stop upgrading if the harvest rate exceeds what is needed to harvest it in a single round\'s length', (t) => {
    const rules = require('../rulesets/testRules.js')
    
    let altarL1 = pipe(Altar.create(), Altar.addLevel)
    let reservoirL9 = { ...Reservoir.create('alpha'), buildLevel: 9, level: 9 }
    let harvesterL8 = { ...Harvester.create('alpha'), buildLevel: 8, level: 8 }

    let testParcel = pipe(Parcel.create('spacious'), [Parcel.addInstallation, harvesterL8], [Parcel.addInstallation, reservoirL9], [Parcel.addInstallation, altarL1], [Parcel.addTokens, 'alpha', 10], [Parcel.addTokens, 'kek', 1])
    let testPlayer = pipe(Player.create(), [Player.addParcel, testParcel], [Player.addTokens, rules.installations.harvester_alpha.buildCosts[0]])
    let verse = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, testPlayer])
    const blocksInOneDay = 60 * 60 * 24 / rules.secondsPerBlock
    verse.currentTime = rules.surveyingRoundStartTimes[rules.surveyingRoundStartTimes.length - 1] + rules.surveyingRoundBlocks - blocksInOneDay
    const result = expandHorizontal(verse, 0, 0, ['alpha','kek'])
    t.equals(result.name, 'craftAndEquipKekReservoir')

    t.end()
})

test('expandHorizontal - in mid-rounds, keep upgrading if the harvest rate doesn\'t exceed the rate needed to harvest act I, round 1 alchemica', (t) => {
    const rules = require('../rulesets/testRules.js')
    
    let altarL1 = pipe(Altar.create(), Altar.addLevel)
    let reservoirL9 = { ...Reservoir.create('alpha'), buildLevel: 9, level: 9 }
    let harvesterL8 = { ...Harvester.create('alpha'), buildLevel: 8, level: 8 }

    let testParcel = pipe(Parcel.create('spacious'), [Parcel.addInstallation, harvesterL8], [Parcel.addInstallation, reservoirL9], [Parcel.addInstallation, altarL1], [Parcel.addTokens, 'alpha', 10], [Parcel.addTokens, 'kek', 1])
    let testPlayer = pipe(Player.create(), [Player.addParcel, testParcel], [Player.addTokens, rules.installations.harvester_alpha.buildCosts[0]])
    let verse = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, testPlayer])
    const blocksInOneDay = 60 * 60 * 24 / rules.secondsPerBlock
    verse.currentTime = rules.surveyingRoundStartTimes[rules.surveyingRoundStartTimes.length - 1] + rules.surveyingRoundBlocks - blocksInOneDay
    const result = expandHorizontal(verse, 0, 0, ['alpha','kek'])
    t.equals(result.name, 'craftAndEquipAlphaHarvester')

    t.end()
})

*/
 test('expandHorizontal - if harvest rate is above the max desired for one resource, move to the next most abundant resource', (t) => {
    const rules = require('../rulesets/testRules.js')
    
    let altarL1 = pipe(Altar.create(), Altar.addLevel)
    let reservoirL9 = { ...Reservoir.create('alpha'), buildLevel: 9, level: 9 }
    let harvesterL8 = { ...Harvester.create('alpha'), buildLevel: 8, level: 8 }

    let testParcel = pipe(Parcel.create('spacious'), [Parcel.addInstallation, harvesterL8], [Parcel.addInstallation, reservoirL9], [Parcel.addInstallation, altarL1], [Parcel.addTokens, 'alpha', 10], [Parcel.addTokens, 'kek', 1])
    let testPlayer = pipe(Player.create(), [Player.addParcel, testParcel], [Player.addTokens, rules.installations.harvester_alpha.buildCosts[0]])
    rules.installations.harvester_alpha.harvestRates[7] = 1000
    let verse = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, testPlayer])
    const blocksInOneDay = 60 * 60 * 24 / rules.secondsPerBlock
    verse.currentTime = rules.surveyingRoundStartTimes[rules.surveyingRoundStartTimes.length - 1] + rules.surveyingRoundBlocks - blocksInOneDay
    const result = expandHorizontal(verse, 0, 0, ['alpha','kek'])
    t.equals(result.name, 'craftAndEquipKekReservoir')

    t.end()
})

test('expandHorizontal - if there are no more surveying rounds, and no more alchemica, stop crafting/upgrading harvesters', (t) => {
    const rules = require('../rulesets/testRules.js')
    
    let altarL1 = pipe(Altar.create(), Altar.addLevel)
    let reservoirL9 = { ...Reservoir.create('alpha'), buildLevel: 9, level: 9 }
    let harvesterL8 = { ...Harvester.create('alpha'), buildLevel: 8, level: 8 }

    let testParcel = pipe(Parcel.create('spacious'), [Parcel.addInstallation, harvesterL8], [Parcel.addInstallation, reservoirL9], [Parcel.addInstallation, altarL1], [Parcel.addTokens, 'alpha', 10], [Parcel.addTokens, 'kek', 0])
    let testPlayer = pipe(Player.create(), [Player.addParcel, testParcel], [Player.addTokens, rules.installations.harvester_alpha.buildCosts[0]])
    rules.installations.harvester_alpha.harvestRates[7] = 1000
    let verse = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, testPlayer])
    const blocksInOneDay = 60 * 60 * 24 / rules.secondsPerBlock
    verse.currentTime = rules.surveyingRoundStartTimes[rules.surveyingRoundStartTimes.length - 1] + rules.surveyingRoundBlocks - blocksInOneDay
    const result = expandHorizontal(verse, 0, 0, ['alpha','kek'])
    t.false(result)

    t.end()
})

test('expandHorizontal - craft or upgrade maker if maker level is limiting harvester qty', (t) => {
    const rules = require('../rulesets/testRules.js')

    rules.maxQuantityPerInstallationClass['harvester'].humble = undefined
    rules.installations['harvester_fud'].prerequisites = []
    rules.installations['harvester_fud'].levelPrerequisite = undefined
    rules.installations['harvester_fud'].maxQuantityPerParcel.humble = 2
    rules.installations.maker.harvesterQtyIncreases = [1,2,3,4,5,6,7,8,9]
    let reservoirL9 = Reservoir.create('fud')
    reservoirL9.buildLevel = 9
    reservoirL9.level = 9
    const humbleParcel = pipe(Parcel.create('humble'), [Parcel.addInstallation, Harvester.create('fud')], [Parcel.addInstallation, Harvester.create('fud')], [Parcel.addInstallation, reservoirL9])
    let player1 = pipe(Player.create(), [Player.addParcel, humbleParcel], [Player.addTokens, rules.installations['harvester_fud'].buildCosts[0]])
    let verse = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, player1])
    const result = expandHorizontal(verse, 0, 0, ['fud'])
    t.equals(result.name, 'craftAndEquipMaker')
    t.end();
});
test('expandHorizontal - if maker and altar are the same level, upgrade the altar first', (t) => {
    const rules = require('../rulesets/testRules.js')
    
    let altarL1 = pipe(Altar.create(), Altar.addLevel)
    let reservoirL1 = pipe(Reservoir.create('fud'), Reservoir.addLevel)
    reservoirL1.buildLevel++
    let harvesterL1 = pipe(Harvester.create('fud'), Harvester.addLevel)
    let makerL1 = pipe(Maker.create('fud'), Maker.addLevel)
    let testParcel = pipe(Parcel.create('spacious'), [Parcel.addInstallation, makerL1], [Parcel.addInstallation, harvesterL1], [Parcel.addInstallation, harvesterL1], [Parcel.addInstallation, reservoirL1], [Parcel.addInstallation, altarL1], [Parcel.addTokens, 'fud', 100000])
    let testPlayer = pipe(Player.create(), [Player.addParcel, testParcel], [Player.addTokens, rules.installations.maker.buildCosts[1]])
    let verse = pipe(Gotchiverse.create(rules), [Gotchiverse.addPlayer, testPlayer])
    verse.rules.installations.reservoir_fud.capacities[0] = 1000000
    verse.rules.maxConcurrentUpgrades = 1
    verse.rules.installations.harvester_fud.levelPrerequisite = 'altar'
    verse.rules.installations.maker.levelPrerequisite = 'altar'
    verse.rules.maxQuantityPerInstallationClass.harvester.spacious = 2
    const result = expandHorizontal(verse, 0, 0, ['fud'])
    t.equals(result.name, 'upgradeHighestLevelAltar')

    t.end()
})
