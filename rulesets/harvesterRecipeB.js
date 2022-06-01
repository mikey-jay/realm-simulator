const currentRules = require('./current.js')

const newRules = structuredClone(currentRules)

newRules.installations.harvester_fud = { ...currentRules.installations.harvester_fud, 
    buildCosts: [
    { fud: 125.002195023443, fomo: 62.5010975117214, alpha: 0, kek: 0 }, // L1
    { fud: 177.818670608385, fomo: 88.9093353041926, alpha: 0, kek: 0 }, // L2
    { fud: 226.694908950884, fomo: 114.540585575183, alpha: 0, kek: 0 }, // L3
    { fud: 254.613221362812, fomo: 160.808350334408, alpha: 0, kek: 6.70034793060032 }, // L4
    { fud: 385.202188722771, fomo: 243.28559287754, alpha: 0, kek: 10.1368997032308 }, // L5
    { fud: 592.285767422437, fomo: 374.07522152996, alpha: 0, kek: 15.5864675637483 }, // L6
    { fud: 664.653439418514, fomo: 548.455285674019, alpha: 0, kek: 44.1552984229083 }, // L7
    { fud: 891.818558572599, fomo: 744.74672610624, alpha: 0, kek: 59.4545705715066 }, // L8
    { fud: 729.156420309669, fomo: 911.445525387087, alpha: 0, kek: 109.37346304645 }, // L9
    ],
    buildTime: [0, 43200, 86400, 129600, 172800, 216000, 259200, 302400, 345600],
    harvestRates: [4.166666667, 10.25390625, 18.26171875, 30.11067708, 49.64192708, 84.53776042, 150.1627604, 277.2460938, 527.2460938]
    }
    newRules.installations.harvester_fomo = { ...currentRules.installations.harvester_fomo, 
    buildCosts: [
    { fud: 104.168495852869, fomo: 83.3347966822952, alpha: 0, kek: 0 }, // L1
    { fud: 155.591336782337, fomo: 118.54578040559, alpha: 0, kek: 0 }, // L2
    { fud: 200.446024756571, fomo: 152.720780766911, alpha: 0, kek: 0 }, // L3
    { fud: 211.73099460697, fomo: 211.73099460697, alpha: 0, kek: 6.70034793060032 }, // L4
    { fud: 319.312340651771, fomo: 319.312340651771, alpha: 0, kek: 10.1368997032308 }, // L5
    { fud: 490.973728258073, fomo: 490.973728258073, alpha: 0, kek: 15.5864675637483 }, // L6
    { fud: 488.032245726881, fomo: 734.372331665212, alpha: 0, kek: 48.8032245726881 }, // L7
    { fud: 657.129464211389, fomo: 985.694196317083, alpha: 0, kek: 65.7129464211389 }, // L8
    { fud: 402.954863855344, fomo: 1208.86459156603, alpha: 0, kek: 120.886459156603 }, // L9
    ],
    buildTime: [0, 47808, 95494.73684, 145152, 196363.6364, 239040, 285120, 336000, 387072],
    harvestRates: [2.083333333, 4.596578664, 8.329906798, 13.71377372, 22.40781431, 38.355095, 67.78180158, 125.4361677, 238.4069293]
    }
    newRules.installations.harvester_alpha = { ...currentRules.installations.harvester_alpha, 
    buildCosts: [
    { fud: 93.7516462675822, fomo: 62.5010975117214, alpha: 5.20842479264345, kek: 0 }, // L1
    { fud: 133.364002956289, fomo: 81.5002240288432, alpha: 7.40911127534938, kek: 0 }, // L2
    { fud: 171.810878362775, fomo: 107.381798976734, alpha: 11.9313109974149, kek: 0 }, // L3
    { fud: 180.909394126209, fomo: 150.087793645447, alpha: 16.0808350334408, kek: 5.36027834448026 }, // L4
    { fud: 273.696291987232, fomo: 228.080243322694, alpha: 22.3011793471078, kek: 9.12320973290775 }, // L5
    { fud: 420.834624221205, fomo: 350.695520184338, alpha: 35.0695520184338, kek: 14.0278208073735 }, // L6
    { fud: 418.313353480184, fomo: 525.21565492512, alpha: 51.127187647578, kek: 41.8313353480184 }, // L7
    { fud: 563.253826466905, fomo: 704.067283083631, alpha: 68.842134345955, kek: 56.3253826466905 }, // L8
    { fud: 690.77976660916, fomo: 863.47470826145, alpha: 86.347470826145, kek: 103.616964991374 }, // L9
    ],
    buildTime: [0, 41472, 81852.63158, 124416, 169658.1818, 207360, 259200, 288960, 331776],
    harvestRates: [1.488095238, 2.828663793, 4.805715461, 7.751263408, 13.09995298, 22.30857567, 39.10488553, 72.68865103, 138.459409]
    }
    newRules.installations.harvester_kek = { ...currentRules.installations.harvester_kek, 
    buildCosts: [
    { fud: 114.585345438156, fomo: 72.9179470970083, alpha: 0, kek: 3.12505487558607 }, // L1
    { fud: 163.000448057686, fomo: 103.727557854891, alpha: 0, kek: 3.70455563767469 }, // L2
    { fud: 209.991073554503, fomo: 131.244420971564, alpha: 0, kek: 5.24977683886257 }, // L3
    { fud: 221.111481709811, fomo: 187.609742056809, alpha: 0, kek: 14.7407654473207 }, // L4
    { fud: 334.517690206617, fomo: 278.764741838848, alpha: 0, kek: 22.3011793471078 }, // L5
    { fud: 514.353429603695, fomo: 428.627858003079, alpha: 0, kek: 34.2902286402463 }, // L6
    { fud: 511.27187647578, fomo: 641.413808669615, alpha: 0, kek: 76.690781471367 }, // L7
    { fud: 688.42134345955, fomo: 860.526679324437, alpha: 0, kek: 103.263201518932 }, // L8
    { fud: 422.143190705598, fomo: 1055.35797676399, alpha: 0, kek: 168.857276282239 }, // L9
    ],
    buildTime: [0, 50688, 100042.1053, 152064, 207360, 253440, 302400, 349440, 405504],
    harvestRates: [0.2976190476, 0.7071659483, 1.601905154, 2.683129641, 4.136827257, 7.044813368, 13.03496184, 23.80070874, 44.93053668]
    }
module.exports = newRules