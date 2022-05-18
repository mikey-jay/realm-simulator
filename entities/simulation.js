const Gotchiverse = require("./gotchiverse")


function create(rulesetName, harvestFrequencyHrs = 8) {
    const rules = require(`../rulesets/${rulesetName}.js`)
    const passTimeBlocks = 60 / rules.secondsPerBlock * 60 * harvestFrequencyHrs
    return { bots: [], rulesetName, passTimeBlocks, gotchiverse: Gotchiverse.create(rules), results: [] }
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