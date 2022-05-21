const Simulation = require("../entities/simulation.js")
const Result = require("../entities/result.js")
const {passTime} = require('./passTime.js')
const { emptyParcelReservoirs } = require('./emptyReservoirs.js')


function continueSimulation(simulationIn) {
    let simulationOut = structuredClone(simulationIn)
    const pctComplete = Math.round(simulationIn.gotchiverse.currentTime / simulationIn.endTime * 100)
    console.log(`Simulating realm... (${pctComplete}%) Block ${Math.round(simulationIn.gotchiverse.currentTime)} / ${Math.round(simulationIn.endTime)}`)
    for (let bi = 0 ; bi < simulationOut.bots.length ; bi++) {
        const useCaseFactory = require(`../strategies/${simulationOut.bots[bi].strategyName}`)
        for (let pi = 0 ; pi < simulationOut.gotchiverse.players[bi].parcels.length ; pi++) {
            let useCase = emptyParcelReservoirs
            while (typeof useCase == 'function') {
                simulationOut = runUseCase(simulationOut, useCase, bi, pi)
                useCase = useCaseFactory(simulationOut.gotchiverse, bi, pi)
            } 
        }
    }
    if (simulationOut.gotchiverse.currentTime < simulationOut.endTime)
        simulationOut.gotchiverse = passTime(simulationOut.gotchiverse, simulationOut.passTimeBlocks)
    return simulationOut
}

function runUseCase(simulationIn, useCase, playerIndex, parcelIndex) {
    let simulationOut = structuredClone(simulationIn)
    const beforeStrategyResult = Result.create(simulationIn.gotchiverse, playerIndex, parcelIndex, simulationIn.results[simulationIn.results.length - 1] || { playerTotals: {}, parcelTotals: {} })
    simulationOut.gotchiverse = useCase(simulationOut.gotchiverse, playerIndex, parcelIndex)
    const afterStrategyResult = Result.create(simulationOut.gotchiverse, playerIndex, parcelIndex, useCase.name, beforeStrategyResult)
    simulationOut = Simulation.addResult(simulationOut, afterStrategyResult)
    return simulationOut
}

module.exports = {
    continueSimulation
}