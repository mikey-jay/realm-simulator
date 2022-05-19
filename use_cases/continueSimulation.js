const Simulation = require("../entities/simulation.js")
const Result = require("../entities/result.js")
const {passTime} = require('./passTime.js')
const { emptyParcelReservoirs } = require('./emptyReservoirs.js')


function continueSimulation(simulationIn) {
    let simulationOut = structuredClone(simulationIn)
    for (let bi = 0 ; bi < simulationOut.bots.length ; bi++) {
        const strategyFactory = require(`../strategies/${simulationOut.bots[bi].strategyName}`)
        for (let pi = 0 ; pi < simulationOut.gotchiverse.players[bi].parcels.length ; pi++) {
            let strategy = emptyParcelReservoirs
            while (typeof strategy == 'function') {
                simulationOut = playStrategy(simulationOut, strategy, bi, pi)
                strategy = strategyFactory(simulationOut.gotchiverse, bi, pi)
            } 
        }
    }
    if (simulationOut.gotchiverse.currentTime < simulationOut.endTime)
        simulationOut.gotchiverse = passTime(simulationOut.gotchiverse, simulationOut.passTimeBlocks)
    return simulationOut
}

function playStrategy(simulationIn, strategy, playerIndex, parcelIndex) {
    let simulationOut = structuredClone(simulationIn)
    simulationOut.gotchiverse = strategy(simulationOut.gotchiverse, playerIndex, parcelIndex)
    const afterStrategyResult = Result.create(simulationOut.gotchiverse, playerIndex, parcelIndex, strategy.name)
    simulationOut = Simulation.addResult(simulationOut, afterStrategyResult)
    return simulationOut
}

module.exports = {
    continueSimulation
}