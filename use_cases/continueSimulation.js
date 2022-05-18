const Simulation = require("../entities/simulation.js")
const Result = require("../entities/result.js")
const {passTime} = require('./passTime.js')

function continueSimulation(simulationIn) {
    let simulationOut = structuredClone(simulationIn)
    for (let bi = 0 ; bi < simulationOut.bots.length ; bi++) {
        for (let pi = 0 ; pi < simulationOut.gotchiverse.players[bi].parcels.length ; pi++) {
            const beforeStrategyResult = Result.create(simulationOut.gotchiverse, bi, pi, 'emptyReservoirs')
            simulationOut = Simulation.addResult(simulationOut, beforeStrategyResult)
            const strategyFactory = require(`../strategies/${simulationOut.bots[bi].strategyName}`)
            let strategy = strategyFactory(simulationOut.gotchiverse, bi, pi)
            while (typeof strategy == 'function') {
                simulationOut.gotchiverse = strategy(simulationOut.gotchiverse, bi, pi)
                const afterStrategyResult = Result.create(simulationOut.gotchiverse, bi, pi, strategy.name)
                simulationOut = Simulation.addResult(simulationOut, afterStrategyResult)
                strategy = strategyFactory(simulationOut.gotchiverse, bi, pi)
            } 
        }
    }
    if (simulationOut.gotchiverse.currentTime < simulationOut.endTime)
        simulationOut.gotchiverse = passTime(simulationOut.gotchiverse, simulationOut.passTimeBlocks)
    return simulationOut
}

module.exports = {
    continueSimulation
}