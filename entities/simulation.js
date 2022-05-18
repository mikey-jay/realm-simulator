const Gotchiverse = require("./gotchiverse")


function create(rulesetName, harvestFrequencyHrs = 8, endTimeDays = 365 * 3) {
    const rules = require(`../rulesets/${rulesetName}.js`)
    const passTimeBlocks = 60 / rules.secondsPerBlock * 60 * harvestFrequencyHrs
    const endTime = endTimeDays * 24 * 60 * 60 / rules.secondsPerBlock
    return { bots: [], rulesetName, passTimeBlocks, endTime, gotchiverse: Gotchiverse.create(rules), results: [] }
}

function addBot(simulationIn, bot) {
    const simulationOut = structuredClone(simulationIn)
    simulationOut.bots.push(bot)
    return simulationOut
}

function addResult(simulationIn, result) {
    const simulationOut = structuredClone(simulationIn)
    simulationOut.results.push(result)
    return simulationOut
}

module.exports = {
    create,
    addBot,
    addResult
}