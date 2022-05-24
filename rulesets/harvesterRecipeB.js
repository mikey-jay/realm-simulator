const currentRules = require('./current.js')

const newRules = structuredClone(currentRules)

newRules.installations.harvester_fud = { ...currentRules.installations.harvester_fud, 
    buildCosts: [
    { fud: 250, fomo: 120, alpha: 0, kek: 0 }, // L1
    { fud: 360, fomo: 180, alpha: 0, kek: 0 }, // L2
    { fud: 530, fomo: 270, alpha: 0, kek: 0 }, // L3
    { fud: 630, fomo: 390, alpha: 0, kek: 10 }, // L4
    { fud: 930, fomo: 580, alpha: 0, kek: 20 }, // L5
    { fud: 1370, fomo: 860, alpha: 0, kek: 30 }, // L6
    { fud: 1530, fomo: 1260, alpha: 0, kek: 100 }, // L7
    { fud: 2250, fomo: 1870, alpha: 0, kek: 150 }, // L8
    { fud: 2210, fomo: 2760, alpha: 0, kek: 330 }, // L9
    ],
    buildTime: [0, 43200, 86400, 129600, 172800, 216000, 259200, 302400, 345600],
    harvestRates: [5, 10, 20, 40, 70, 110, 170, 270, 410]
}
newRules.installations.harvester_fomo = { ...currentRules.installations.harvester_fomo, 
    buildCosts: [
    { fud: 200, fomo: 160, alpha: 0, kek: 0 }, // L1
    { fud: 320, fomo: 240, alpha: 0, kek: 0 }, // L2
    { fud: 470, fomo: 360, alpha: 0, kek: 0 }, // L3
    { fud: 520, fomo: 520, alpha: 0, kek: 10 }, // L4
    { fud: 770, fomo: 770, alpha: 0, kek: 20 }, // L5
    { fud: 1130, fomo: 1130, alpha: 0, kek: 30 }, // L6
    { fud: 1120, fomo: 1700, alpha: 0, kek: 110 }, // L7
    { fud: 1650, fomo: 2480, alpha: 0, kek: 160 }, // L8
    { fud: 1220, fomo: 3660, alpha: 0, kek: 360 }, // L9
    ],
    buildTime: [0, 47800, 95490, 145150, 196360, 239040, 285120, 336000, 387070],
    harvestRates: [2, 6, 10, 20, 30, 50, 80, 120, 180]
}
newRules.installations.harvester_alpha = { ...currentRules.installations.harvester_alpha, 
    buildCosts: [
    { fud: 180, fomo: 120, alpha: 10, kek: 0 }, // L1
    { fud: 270, fomo: 160, alpha: 10, kek: 0 }, // L2
    { fud: 400, fomo: 250, alpha: 20, kek: 0 }, // L3
    { fud: 440, fomo: 370, alpha: 30, kek: 10 }, // L4
    { fud: 660, fomo: 550, alpha: 50, kek: 20 }, // L5
    { fud: 970, fomo: 810, alpha: 80, kek: 30 }, // L6
    { fud: 9680, fomo: 1210, alpha: 110, kek: 90 }, // L7
    { fud: 1420, fomo: 1770, alpha: 170, kek: 140 }, // L8
    { fud: 2090, fomo: 2610, alpha: 260, kek: 310 }, // L9
    ],
    buildTime: [0, 41470, 81850, 124410, 169650, 207360, 259200, 288960, 331770],
    harvestRates: [1, 3, 6, 10, 10, 30, 40, 70, 100]
}
newRules.installations.harvester_kek = { ...currentRules.installations.harvester_kek, 
    buildCosts: [
    { fud: 220, fomo: 140, alpha: 0, kek: 6 }, // L1
    { fud: 330, fomo: 210, alpha: 0, kek: 7 }, // L2
    { fud: 490, fomo: 310, alpha: 0, kek: 10 }, // L3
    { fud: 540, fomo: 460, alpha: 0, kek: 30 }, // L4
    { fud: 800, fomo: 670, alpha: 0, kek: 50 }, // L5
    { fud: 1190, fomo: 990, alpha: 0, kek: 70 }, // L6
    { fud: 1180, fomo: 1480, alpha: 0, kek: 170 }, // L7
    { fud: 1730, fomo: 2170, alpha: 0, kek: 260 }, // L8
    { fud: 1280, fomo: 3200, alpha: 0, kek: 510 }, // L9
    ],
    buildTime: [0, 50680, 100040, 152060, 207360, 253440, 302400, 349440, 405500],
    harvestRates: [0.3, 0.9, 2, 4, 6, 9, 10, 20, 30]
}

module.exports = newRules