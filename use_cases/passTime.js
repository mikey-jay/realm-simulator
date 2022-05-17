const Gotchiverse = require('../entities/gotchiverse.js')
const { emptyReservoirs } = require('./emptyReservoirs.js')
const { harvestAlchemica } = require('./harvestAlchemica.js')
const { levelUpAllCompletedUpgrades } = require('./craftUpgrade.js')
const { surveyParcelsAndAdvanceRound } = require('./surveyParcels.js')

const { pipe } = require('../utils.js')

function passTime(gotchiverseIn) {
    let gotchiverseOut = structuredClone(gotchiverseIn)
    gotchiverseOut.currentTime += gotchiverseOut.rules.passTimeBlocks
    if (gotchiverseOut.currentRound < gotchiverseOut.rules.surveyingRoundStartTimes.filter((time) => time <= gotchiverseOut.currentTime).length)
        gotchiverseOut = surveyParcelsAndAdvanceRound(gotchiverseOut)
    gotchiverseOut = pipe(gotchiverseOut, [harvestAlchemica, gotchiverseOut.rules.passTimeBlocks], emptyReservoirs, levelUpAllCompletedUpgrades)
    return gotchiverseOut
}

module.exports = {
    passTime
}