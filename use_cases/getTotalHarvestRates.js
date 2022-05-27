const Parcel = require('../entities/parcel.js')
const { addObjectKeys } = require('../utils.js')

function getTotalHarvestRates(verseIn, playerIndex, parcelIndex) {
    const harvesters = Parcel.getInstallationsOfClass(verseIn.players[playerIndex].parcels[parcelIndex], 'harvester').filter((h) => h.level > 0)
    const getHarvestRate = (h) => {
        let rate = { fud: 0, fomo: 0, alpha: 0, kek: 0 }
        rate[h.resourceToken] = verseIn.rules.installations[h.type].harvestRates[h.level - 1]
        return rate
    }
    const harvestRates = harvesters.map(getHarvestRate)
    const totalHarvestRate = harvestRates.reduce((total, current) => addObjectKeys(total, current), { fud: 0, fomo: 0, alpha: 0, kek: 0 })
    return totalHarvestRate
}

module.exports = {
    getTotalHarvestRates
}