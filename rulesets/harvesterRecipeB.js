const currentRules = require('./current.js')

const newRules = structuredClone(currentRules)

// v007
newRules.installations.harvester_fud = { ...currentRules.installations.harvester_fud, 
    buildCosts: [
    { fud: 250, fomo: 120, alpha: 0, kek: 0 }, // L1
    { fud: 370, fomo: 180, alpha: 0, kek: 0 }, // L2
    { fud: 490, fomo: 250, alpha: 0, kek: 0 }, // L3
    { fud: 570, fomo: 360, alpha: 0, kek: 10 }, // L4
    { fud: 890, fomo: 560, alpha: 0, kek: 20 }, // L5
    { fud: 1390, fomo: 880, alpha: 0, kek: 30 }, // L6
    { fud: 1580, fomo: 1300, alpha: 0, kek: 100 }, // L7
    { fud: 2130, fomo: 1780, alpha: 0, kek: 140 }, // L8
    { fud: 1740, fomo: 2180, alpha: 0, kek: 260 }, // L9
    ],
    buildTime: [0, 43200, 86400, 129600, 172800, 216000, 259200, 302400, 345600],
    harvestRates: [6, 10, 30, 50, 90, 160, 290, 540, 1040]
    }
    newRules.installations.harvester_fomo = { ...currentRules.installations.harvester_fomo, 
    buildCosts: [
    { fud: 200, fomo: 160, alpha: 0, kek: 0 }, // L1
    { fud: 330, fomo: 250, alpha: 0, kek: 0 }, // L2
    { fud: 440, fomo: 330, alpha: 0, kek: 0 }, // L3
    { fud: 470, fomo: 470, alpha: 0, kek: 10 }, // L4
    { fud: 740, fomo: 740, alpha: 0, kek: 20 }, // L5
    { fud: 1150, fomo: 1150, alpha: 0, kek: 30 }, // L6
    { fud: 1160, fomo: 1740, alpha: 0, kek: 110 }, // L7
    { fud: 1570, fomo: 2350, alpha: 0, kek: 150 }, // L8
    { fud: 960, fomo: 2900, alpha: 0, kek: 290 }, // L9
    ],
    buildTime: [0, 47800, 95490, 145150, 196360, 239040, 285120, 336000, 387070],
    harvestRates: [3, 7, 10, 20, 40, 70, 130, 240, 470]
    }
    newRules.installations.harvester_alpha = { ...currentRules.installations.harvester_alpha, 
    buildCosts: [
    { fud: 180, fomo: 120, alpha: 10, kek: 0 }, // L1
    { fud: 280, fomo: 170, alpha: 10, kek: 0 }, // L2
    { fud: 370, fomo: 230, alpha: 20, kek: 0 }, // L3
    { fud: 400, fomo: 330, alpha: 30, kek: 10 }, // L4
    { fud: 630, fomo: 520, alpha: 50, kek: 20 }, // L5
    { fud: 990, fomo: 820, alpha: 80, kek: 30 }, // L6
    { fud: 9950, fomo: 1250, alpha: 120, kek: 90 }, // L7
    { fud: 1340, fomo: 1680, alpha: 160, kek: 130 }, // L8
    { fud: 1650, fomo: 2070, alpha: 200, kek: 240 }, // L9
    ],
    buildTime: [0, 41470, 81850, 124410, 169650, 207360, 259200, 288960, 331770],
    harvestRates: [2, 4, 8, 10, 20, 40, 70, 140, 270]
    }
    newRules.installations.harvester_kek = { ...currentRules.installations.harvester_kek, 
    buildCosts: [
    { fud: 220, fomo: 140, alpha: 0, kek: 6 }, // L1
    { fud: 340, fomo: 220, alpha: 0, kek: 7 }, // L2
    { fud: 460, fomo: 280, alpha: 0, kek: 10 }, // L3
    { fud: 500, fomo: 420, alpha: 0, kek: 30 }, // L4
    { fud: 770, fomo: 640, alpha: 0, kek: 50 }, // L5
    { fud: 1210, fomo: 1010, alpha: 0, kek: 80 }, // L6
    { fud: 1210, fomo: 1520, alpha: 0, kek: 180 }, // L7
    { fud: 1640, fomo: 2050, alpha: 0, kek: 240 }, // L8
    { fud: 1010, fomo: 2530, alpha: 0, kek: 400 }, // L9
    ],
    buildTime: [0, 50680, 100040, 152060, 207360, 253440, 302400, 349440, 405500],
    harvestRates: [0.4, 1, 2, 4, 7, 10, 20, 40, 80]
    }

module.exports = newRules