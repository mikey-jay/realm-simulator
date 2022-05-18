const {startSimulation} = require('./startSimulation.js')
const {continueSimulation} = require('./continueSimulation.js')
const { pipe } = require('../utils.js')

function runSimulation(simulationIn) {
    let simulationOut = structuredClone(simulationIn)
    simulationOut = startSimulation(simulationOut)
    while (simulationOut.gotchiverse.currentTime < simulationIn.endTime) {
        simulationOut = pipe(simulationOut, continueSimulation)
    }
    return simulationOut
}

module.exports = {
    runSimulation
}