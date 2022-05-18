const Gotchiverse = require("../entities/gotchiverse.js")
const Simulation = require("../entities/simulation.js")
const Result = require("../entities/result.js")


function continueSimulation(simulationIn) {
    let simulationOut = structuredClone(simulationIn)
    for (let bi = 0 ; bi < simulationOut.bots.length ; bi++) {
        for (let pi = 0 ; pi < simulationOut.gotchiverse.players[bi].parcels.length ; pi++) {
            const strategyFactory = require(`../strategies/${simulationOut.bots[bi].strategyName}`)
            let strategy = strategyFactory(simulationOut.gotchiverse, bi, pi)
            while (typeof strategy == 'function') {
                simulationOut.gotchiverse = strategy(simulationOut.gotchiverse, bi, pi)
                const result = Result.create(simulationOut.gotchiverse, bi, pi, strategy.name)
                simulationOut = Simulation.addResult(simulationOut, result)
                strategy = strategyFactory(simulationOut.gotchiverse, bi, pi)
            } 
        }
    }
    return simulationOut
}

module.exports = {
    continueSimulation
}