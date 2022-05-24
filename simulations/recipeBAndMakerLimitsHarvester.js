const Simulation = require('../entities/simulation.js')
const {runSimulation} = require('../use_cases/runSimulation.js')
const Parcel = require('../entities/parcel.js')
const Bot = require('../entities/bot.js')
const { pipe, sumArray } = require('../utils.js')
const rules = require('../rulesets/testRules.js')
const { getWalletValueInFudTerms } = require('../use_cases/getWalletValueInFudTerms.js')
const fs = require('fs');
const path = require('path');

const formatResult = (resultIn) => {
    const { playerIndex, parcelIndex } = resultIn
    const blockTimeRounded = Math.round(resultIn.blockTime)
    const days = Math.round(resultIn.blockTime * rules.secondsPerBlock / 60 / 60 / 24 * 10) / 10
    const tokenSupply = rules.parcelTokenAllocation
    const playerTotalFudTerms = getWalletValueInFudTerms(resultIn.playerTotals, tokenSupply)
    const playerChangeFudTerms = getWalletValueInFudTerms(resultIn.playerChange, tokenSupply)
    const parcelTotalFudTerms = getWalletValueInFudTerms(resultIn.parcelTotals, tokenSupply)
    const parcelChangeFudTerms = getWalletValueInFudTerms(resultIn.parcelChange, tokenSupply)
    const totalHarvesters = resultIn.parcelTotals.installationClasses.harvester
    const averageHarvesterLevel = resultIn.parcelTotals.averageLevels.harvester
    const totalReservoirs = resultIn.parcelTotals.installationClasses.reservoir
    const averageReservoirLevel = resultIn.parcelTotals.averageLevels.reservoir
    const totalAltars = resultIn.parcelTotals.installationClasses.altar
    const averageAltarLevel = resultIn.parcelTotals.averageLevels.altar
    const totalMakers = resultIn.parcelTotals.installationClasses.maker
    const destroyValueFudTerms = getWalletValueInFudTerms({ tokens: resultIn.parcelTotals.destroyValue }, tokenSupply)

    const resultOut = { blockTimeRounded, days, playerIndex, parcelIndex, playerTotalFudTerms,
        playerChangeFudTerms, parcelTotalFudTerms, parcelChangeFudTerms, totalHarvesters, averageHarvesterLevel,
        totalReservoirs, averageReservoirLevel, totalAltars, averageAltarLevel, totalMakers, averageMakerLevel, destroyValueFudTerms, ...structuredClone(resultIn) }
    
        
    return resultOut
}

const startingAlchemica = rules.avgBaseAlchemicaPerParcel.spacious
const horizontalBot = pipe(Bot.create('expandHorizontal'), [Bot.addTokens, startingAlchemica], [Bot.addParcel, Parcel.create('spacious')])
const verticalBot = pipe(Bot.create('expandVertical'), [Bot.addTokens, startingAlchemica], [Bot.addParcel, Parcel.create('spacious')])
const sim = pipe(Simulation.create('recipeBAndMakerLimitsHarvester', 8, 365 * 2), [Simulation.addBot, horizontalBot], [Simulation.addBot, verticalBot], runSimulation)
const { Parser, transforms: { unwind, flatten } } = require('json2csv');
const json2csvParser = new Parser({ transforms: [flatten({separator: '.', objects: true, arrays: true})] });
const formattedResults = sim.results.map(formatResult)
const csv = json2csvParser.parse(formattedResults);

// console.log(JSON.stringify(formattedResults[formattedResults.length - 1], null, 2))
const scriptName = path.basename(__filename)
const fullPathResultFile = `${__dirname}/../results/${scriptName}-result-${Date.now()}.csv`
fs.writeFile(fullPathResultFile, csv, (err) => { if (err) return console.log(err) })
console.log(`Simulation complete. Results written to ${fullPathResultFile}`)


/**
 * TODO:
 * - track and output recoup value of installations
 * - players destroy installations when all alchemica is exhausted
 * - write rules and logic for limiting # of harvesters by maker level
 */