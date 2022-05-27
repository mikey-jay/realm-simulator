const currentRules = require('./current.js')

const newRules = structuredClone(currentRules)

newRules.installations.harvester_fud = { ...currentRules.installations.harvester_fud, 
    buildCosts: [
    { fud: 250, fomo: 120, alpha: 0, kek: 0 }, // L1
    { fud: 350, fomo: 170, alpha: 0, kek: 0 }, // L2
    { fud: 450, fomo: 220, alpha: 0, kek: 0 }, // L3
    { fud: 500, fomo: 320, alpha: 0, kek: 10 }, // L4
    { fud: 770, fomo: 480, alpha: 0, kek: 20 }, // L5
    { fud: 1180, fomo: 740, alpha: 0, kek: 30 }, // L6
    { fud: 1320, fomo: 1090, alpha: 0, kek: 80 }, // L7
    { fud: 1780, fomo: 1480, alpha: 0, kek: 110 }, // L8
    { fud: 1450, fomo: 1820, alpha: 0, kek: 210 }, // L9
    ],
    buildTime: [0, 43200, 86400, 129600, 172800, 216000, 259200, 302400, 345600],
    harvestRates: [8, 20, 30, 60, 90, 160, 300, 550, 1050]
    }
    newRules.installations.harvester_fomo = { ...currentRules.installations.harvester_fomo, 
    buildCosts: [
    { fud: 200, fomo: 160, alpha: 0, kek: 0 }, // L1
    { fud: 310, fomo: 230, alpha: 0, kek: 0 }, // L2
    { fud: 400, fomo: 300, alpha: 0, kek: 0 }, // L3
    { fud: 420, fomo: 420, alpha: 0, kek: 10 }, // L4
    { fud: 630, fomo: 630, alpha: 0, kek: 20 }, // L5
    { fud: 980, fomo: 980, alpha: 0, kek: 30 }, // L6
    { fud: 970, fomo: 1460, alpha: 0, kek: 90 }, // L7
    { fud: 1310, fomo: 1970, alpha: 0, kek: 130 }, // L8
    { fud: 800, fomo: 2410, alpha: 0, kek: 240 }, // L9
    ],
    buildTime: [0, 47800, 95490, 145150, 196360, 239040, 285120, 336000, 387070],
    harvestRates: [4, 9, 10, 20, 40, 70, 130, 250, 470]
    }
    newRules.installations.harvester_alpha = { ...currentRules.installations.harvester_alpha, 
    buildCosts: [
    { fud: 180, fomo: 120, alpha: 10, kek: 0 }, // L1
    { fud: 260, fomo: 160, alpha: 10, kek: 0 }, // L2
    { fud: 340, fomo: 210, alpha: 20, kek: 0 }, // L3
    { fud: 360, fomo: 300, alpha: 30, kek: 10 }, // L4
    { fud: 540, fomo: 450, alpha: 40, kek: 10 }, // L5
    { fud: 840, fomo: 700, alpha: 70, kek: 20 }, // L6
    { fud: 8360, fomo: 1050, alpha: 100, kek: 80 }, // L7
    { fud: 1120, fomo: 1400, alpha: 130, kek: 110 }, // L8
    { fud: 1380, fomo: 1720, alpha: 170, kek: 200 }, // L9
    ],
    buildTime: [0, 41470, 81850, 124410, 169650, 207360, 259200, 288960, 331770],
    harvestRates: [2, 5, 9, 10, 20, 40, 70, 140, 270]
    }
    newRules.installations.harvester_kek = { ...currentRules.installations.harvester_kek, 
    buildCosts: [
    { fud: 220, fomo: 140, alpha: 0, kek: 6 }, // L1
    { fud: 320, fomo: 200, alpha: 0, kek: 7 }, // L2
    { fud: 410, fomo: 260, alpha: 0, kek: 10 }, // L3
    { fud: 440, fomo: 370, alpha: 0, kek: 20 }, // L4
    { fud: 660, fomo: 550, alpha: 0, kek: 40 }, // L5
    { fud: 1020, fomo: 850, alpha: 0, kek: 60 }, // L6
    { fud: 1020, fomo: 1280, alpha: 0, kek: 150 }, // L7
    { fud: 1370, fomo: 1720, alpha: 0, kek: 200 }, // L8
    { fud: 840, fomo: 2110, alpha: 0, kek: 330 }, // L9
    ],
    buildTime: [0, 50680, 100040, 152060, 207360, 253440, 302400, 349440, 405500],
    harvestRates: [0.5, 1, 3, 5, 8, 10, 20, 40, 80]
    }

module.exports = newRules