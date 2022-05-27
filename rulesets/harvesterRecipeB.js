const currentRules = require('./current.js')

const newRules = structuredClone(currentRules)

newRules.installations.harvester_fud = { ...currentRules.installations.harvester_fud, 
    buildCosts: [
    { fud: 250, fomo: 120, alpha: 0, kek: 0 }, // L1
    { fud: 310, fomo: 150, alpha: 0, kek: 0 }, // L2
    { fud: 380, fomo: 190, alpha: 0, kek: 0 }, // L3
    { fud: 410, fomo: 260, alpha: 0, kek: 10 }, // L4
    { fud: 590, fomo: 370, alpha: 0, kek: 10 }, // L5
    { fud: 880, fomo: 560, alpha: 0, kek: 20 }, // L6
    { fud: 1000, fomo: 820, alpha: 0, kek: 60 }, // L7
    { fud: 1460, fomo: 1220, alpha: 0, kek: 90 }, // L8
    { fud: 1390, fomo: 1740, alpha: 0, kek: 200 }, // L9
    ],
    buildTime: [0, 20220, 30340, 45510, 68260, 102400, 153600, 230400, 345600],
    harvestRates: [6, 10, 30, 50, 90, 160, 290, 540, 1040]
    }
    newRules.installations.harvester_fomo = { ...currentRules.installations.harvester_fomo, 
    buildCosts: [
    { fud: 200, fomo: 160, alpha: 0, kek: 0 }, // L1
    { fud: 270, fomo: 200, alpha: 0, kek: 0 }, // L2
    { fud: 340, fomo: 260, alpha: 0, kek: 0 }, // L3
    { fud: 340, fomo: 340, alpha: 0, kek: 10 }, // L4
    { fud: 490, fomo: 490, alpha: 0, kek: 10 }, // L5
    { fud: 730, fomo: 730, alpha: 0, kek: 20 }, // L6
    { fud: 730, fomo: 1110, alpha: 0, kek: 70 }, // L7
    { fud: 1070, fomo: 1610, alpha: 0, kek: 100 }, // L8
    { fud: 770, fomo: 2320, alpha: 0, kek: 230 }, // L9
    ],
    buildTime: [0, 22380, 33530, 50970, 77570, 113320, 168960, 256000, 387070],
    harvestRates: [3, 7, 10, 20, 40, 70, 130, 240, 470]
    }
    newRules.installations.harvester_alpha = { ...currentRules.installations.harvester_alpha, 
    buildCosts: [
    { fud: 180, fomo: 120, alpha: 10, kek: 0 }, // L1
    { fud: 230, fomo: 140, alpha: 10, kek: 0 }, // L2
    { fud: 290, fomo: 180, alpha: 20, kek: 0 }, // L3
    { fud: 290, fomo: 240, alpha: 20, kek: 8 }, // L4
    { fud: 420, fomo: 350, alpha: 30, kek: 10 }, // L5
    { fud: 630, fomo: 520, alpha: 50, kek: 20 }, // L6
    { fud: 6320, fomo: 790, alpha: 70, kek: 60 }, // L7
    { fud: 920, fomo: 1150, alpha: 110, kek: 90 }, // L8
    { fud: 1320, fomo: 1650, alpha: 160, kek: 190 }, // L9
    ],
    buildTime: [0, 19410, 28740, 43690, 67020, 98300, 153600, 220160, 331770],
    harvestRates: [2, 4, 8, 10, 20, 40, 70, 140, 270]
    }
    newRules.installations.harvester_kek = { ...currentRules.installations.harvester_kek, 
    buildCosts: [
    { fud: 220, fomo: 140, alpha: 0, kek: 6 }, // L1
    { fud: 280, fomo: 180, alpha: 0, kek: 6 }, // L2
    { fud: 350, fomo: 220, alpha: 0, kek: 8 }, // L3
    { fud: 360, fomo: 300, alpha: 0, kek: 20 }, // L4
    { fud: 510, fomo: 430, alpha: 0, kek: 30 }, // L5
    { fud: 770, fomo: 640, alpha: 0, kek: 50 }, // L6
    { fud: 770, fomo: 970, alpha: 0, kek: 110 }, // L7
    { fud: 1130, fomo: 1410, alpha: 0, kek: 160 }, // L8
    { fud: 810, fomo: 2020, alpha: 0, kek: 320 }, // L9
    ],
    buildTime: [0, 23730, 35130, 53390, 81920, 120140, 179200, 266240, 405500],
    harvestRates: [0.4, 1, 2, 4, 7, 10, 20, 40, 80]
    }

module.exports = newRules