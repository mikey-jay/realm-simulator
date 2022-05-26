const currentRules = require('./rulesets/current.js')
const { getWalletValueInFudTerms } = require('./use_cases/getWalletValueInFudTerms.js')
const fs = require('fs');

const formatResult = (resultIn) => {
    const { playerIndex, parcelIndex } = resultIn
    const blockTimeRounded = Math.round(resultIn.blockTime)
    const days = Math.round(resultIn.blockTime * currentRules.secondsPerBlock / 60 / 60 / 24 * 10) / 10
    const tokenSupply = currentRules.parcelTokenAllocation
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
    const averageMakerLevel = resultIn.parcelTotals.averageLevels.maker
    const destroyValueFudTerms = getWalletValueInFudTerms({ tokens: resultIn.parcelTotals.destroyValue }, tokenSupply)
    const useCaseName = resultIn.useCaseName
    const resultOut = { blockTimeRounded, days, playerIndex, parcelIndex, playerTotalFudTerms,
        playerChangeFudTerms, parcelTotalFudTerms, parcelChangeFudTerms, totalHarvesters, averageHarvesterLevel,
        totalReservoirs, averageReservoirLevel, totalAltars, averageAltarLevel, totalMakers, averageMakerLevel, destroyValueFudTerms, useCaseName } //, ...structuredClone(resultIn) }
    
    return resultOut
}

function msToTime(duration) {
    var milliseconds = parseInt((duration%1000)/100)
        , seconds = parseInt((duration/1000)%60)
        , minutes = parseInt((duration/(1000*60))%60)
        , hours = parseInt((duration/(1000*60*60))%24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

function mergeSimulationResults(sims) {
    let allResults = sims[0].results
    for (let i = 1 ; i < sims.length ; i++) {
        let results = sims[i].results.map((r) => { r.playerIndex = i ; return r } )
        allResults = allResults.concat(results)
    }
    return allResults.sort((a, b) => a.blockTime - b.blockTime)
}
const simulationName = process.argv[2] || 'currentRules'
const harvestFrequencyHrs = process.argv[3]
const endTimeDays = process.argv[4]
const parcelSize = process.argv[4] || 'spacious'
console.log(`Running simulation: ${simulationName}`)
const simulationTimeStart = Date.now()
const runSims = require(`./simulations/${simulationName}.js`)(harvestFrequencyHrs, endTimeDays, parcelSize)
const { Parser, transforms: { unwind, flatten } } = require('json2csv');
runSims.then((sims) => {
    const simulationTime = Date.now() - simulationTimeStart
    const results = mergeSimulationResults(sims)
    const json2csvParser = new Parser({ transforms: [flatten({separator: '.', objects: true, arrays: true})] });
    const formattedResults = results.map(formatResult)
    const csv = json2csvParser.parse(formattedResults);
    const fullPathResultFile = `${__dirname}/results/${simulationName}-result-${Date.now()}.csv`
    fs.writeFile(fullPathResultFile, csv, (err) => { if (err) return console.log(err) })
    console.log(`\n\nSimulation completed in ${msToTime(simulationTime)}. Results written to ${fullPathResultFile}\n`)
})
