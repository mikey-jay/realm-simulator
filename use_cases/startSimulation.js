const Gotchiverse = require("../entities/gotchiverse.js")
const {passTime} = require('./passTime.js')

function startSimulation(simulationIn) {
    const simulationOut = structuredClone(simulationIn)
    simulationOut.gotchiverse = Gotchiverse.addAlchemica(simulationOut.gotchiverse, simulationOut.gotchiverse.rules.parcelTokenAllocation)
    simulationOut.bots.forEach((bot) => {
        simulationOut.gotchiverse = Gotchiverse.addPlayer(simulationOut.gotchiverse, bot)
    })
    simulationOut.gotchiverse = passTime(simulationOut.gotchiverse, simulationOut.passTimeBlocks)
    return simulationOut
}

module.exports = {
    startSimulation
}