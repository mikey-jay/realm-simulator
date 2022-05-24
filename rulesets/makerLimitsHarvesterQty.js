const currentRules = require('./current.js')

const newRules = structuredClone(currentRules)
const harvesterQtyLimits = {
    humble: 2,
    reasonable: 4,
    spacious: 8,
    partner: 16
}

newRules.installations.maker.harvesterQtyIncreases = [ 1, 3, 6, 10, 15, 21, 28, 36, 45 ]

newRules.installations.harvester_fud.maxQuantityPerParcel = harvesterQtyLimits
newRules.installations.harvester_fomo.maxQuantityPerParcel = harvesterQtyLimits
newRules.installations.harvester_alpha.maxQuantityPerParcel = harvesterQtyLimits
newRules.installations.harvester_kek.maxQuantityPerParcel = harvesterQtyLimits
newRules.maxQuantityPerInstallationClass.harvester = { humble: undefined, reasonable: undefined, spacious: undefined, partner: undefined }
module.exports = newRules