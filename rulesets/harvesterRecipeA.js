const currentRules = require('./current.js')

const newRules = structuredClone(currentRules)
newRules.installations.harvester_fud = { ...currentRules.installations.harvester_fud, 
    buildCosts: [
    { fud: 10, fomo: 5, alpha: 0, kek: 0 }, // L1
    { fud: 30, fomo: 10, alpha: 0, kek: 0 }, // L2
    { fud: 70, fomo: 40, alpha: 0, kek: 0 }, // L3
    { fud: 160, fomo: 100, alpha: 0, kek: 4 }, // L4
    { fud: 390, fomo: 250, alpha: 0, kek: 10 }, // L5
    { fud: 730, fomo: 460, alpha: 0, kek: 10 }, // L6
    { fud: 1260, fomo: 1040, alpha: 0, kek: 80 }, // L7
    { fud: 2090, fomo: 1750, alpha: 0, kek: 130 }, // L8
    { fud: 2150, fomo: 2690, alpha: 0, kek: 320 }, // L9
    ],
    buildTime: [0, 7500, 19000, 37500, 55000, 75000, 150000, 225000, 375000],
    harvestRates: [5, 10, 20, 30, 50, 70, 200, 400, 700]
    }
newRules.installations.harvester_fomo = { ...currentRules.installations.harvester_fomo, 
    buildCosts: [
    { fud: 8, fomo: 6, alpha: 0, kek: 0 }, // L1
    { fud: 20, fomo: 20, alpha: 0, kek: 0 }, // L2
    { fud: 70, fomo: 50, alpha: 0, kek: 0 }, // L3
    { fud: 130, fomo: 130, alpha: 0, kek: 4 }, // L4
    { fud: 320, fomo: 320, alpha: 0, kek: 10 }, // L5
    { fud: 600, fomo: 600, alpha: 0, kek: 10 }, // L6
    { fud: 930, fomo: 1390, alpha: 0, kek: 90 }, // L7
    { fud: 1540, fomo: 2310, alpha: 0, kek: 150 }, // L8
    { fud: 1190, fomo: 3580, alpha: 0, kek: 350 }, // L9
    ],
    buildTime: [0, 8300, 21000, 42000, 62500, 83000, 165000, 250000, 420000],
    harvestRates: [2, 4, 9, 10, 20, 30, 90, 180, 310]
    }
newRules.installations.harvester_alpha = { ...currentRules.installations.harvester_alpha, 
    buildCosts: [
    { fud: 7, fomo: 5, alpha: 0.4, kek: 0 }, // L1
    { fud: 20, fomo: 10, alpha: 1, kek: 0 }, // L2
    { fud: 60, fomo: 30, alpha: 4, kek: 0 }, // L3
    { fud: 110, fomo: 90, alpha: 10, kek: 3 }, // L4
    { fud: 280, fomo: 230, alpha: 20, kek: 9 }, // L5
    { fud: 520, fomo: 430, alpha: 40, kek: 10 }, // L6
    { fud: 7970, fomo: 1000, alpha: 90, kek: 70 }, // L7
    { fud: 1320, fomo: 1650, alpha: 160, kek: 130 }, // L8
    { fud: 2040, fomo: 2550, alpha: 250, kek: 300 }, // L9
    ],
    buildTime: [0, 7200, 18000, 36000, 54000, 72000, 150000, 215000, 360000],
    harvestRates: [1, 2, 5, 9, 10, 10, 50, 100, 180]
    }
newRules.installations.harvester_kek = { ...currentRules.installations.harvester_kek, 
    buildCosts: [
    { fud: 9, fomo: 5, alpha: 0, kek: 0.2 }, // L1
    { fud: 20, fomo: 10, alpha: 0, kek: 0.6 }, // L2
    { fud: 70, fomo: 40, alpha: 0, kek: 1 }, // L3
    { fud: 140, fomo: 120, alpha: 0, kek: 9 }, // L4
    { fud: 340, fomo: 280, alpha: 0, kek: 20 }, // L5
    { fud: 630, fomo: 520, alpha: 0, kek: 40 }, // L6
    { fud: 970, fomo: 1220, alpha: 0, kek: 140 }, // L7
    { fud: 1610, fomo: 2020, alpha: 0, kek: 240 }, // L8
    { fud: 1250, fomo: 3120, alpha: 0, kek: 500 }, // L9
    ],
    buildTime: [0, 8800, 22000, 44000, 66000, 88000, 175000, 260000, 440000],
    harvestRates: [0.3, 0.6, 1, 3, 4, 6, 10, 30, 50]
}
module.exports = newRules