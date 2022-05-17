const Gotchiverse = require('../entities/gotchiverse.js')
const { emptyReservoirs } = require('./emptyReservoirs.js')
const { harvestAlchemica } = require('./harvestAlchemica.js')
const { levelUpAllCompletedUpgrades } = require('./craftUpgrade.js')
const { pipe } = require('../utils.js')

function passTime(gotchiverseIn) {
    let gotchiverseOut = structuredClone(gotchiverseIn)
    gotchiverseOut.currentTime += gotchiverseOut.rules.passTimeBlocks
    gotchiverseOut = pipe(gotchiverseOut, [harvestAlchemica, gotchiverseOut.rules.passTimeBlocks], emptyReservoirs, levelUpAllCompletedUpgrades)
    return gotchiverseOut
}

module.exports = {
    passTime
}