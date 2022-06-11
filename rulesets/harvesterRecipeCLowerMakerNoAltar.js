const currentRules = require('./current.js')

const newRules = structuredClone(currentRules)

newRules.installations.maker = { ...currentRules.installations.maker, 
    buildCosts: [
    { fud: 1250, fomo: 150, alpha: 250, kek: 63 }, // L1
    { fud: 3738, fomo: 486, alpha: 710, kek: 187 }, // L2
    { fud: 6240, fomo: 780, alpha: 1186, kek: 312 }, // L3
    { fud: 6572, fomo: 1095, alpha: 1643, kek: 657 }, // L4
    { fud: 8525, fomo: 1402, alpha: 2122, kek: 834 }, // L5
    { fud: 10318, fomo: 1720, alpha: 2580, kek: 1032 }, // L6
    { fud: 8128, fomo: 2039, alpha: 3044, kek: 1626 }, // L7
    { fud: 9382, fomo: 2345, alpha: 3511, kek: 1876 }, // L8
    { fud: 10625, fomo: 2625, alpha: 4000, kek: 2125 }, // L9
    ],
}

newRules.installations.harvester_fud = { ...currentRules.installations.harvester_fud, 
    buildCosts: [
    { fud: 62.5010975117214, fomo: 31.2505487558607, alpha: 0, kek: 0 }, // L1
    { fud: 88.2357797337063, fomo: 44.1178898668531, alpha: 0, kek: 0 }, // L2
    { fud: 111.680580144921, fomo: 56.4280825995388, alpha: 0, kek: 0 }, // L3
    { fud: 123.770315940256, fomo: 78.1707258570037, alpha: 0, kek: 3.25711357737516 }, // L4
    { fud: 182.971039643316, fomo: 115.560656616831, alpha: 0, kek: 4.81502735903464 }, // L5
    { fud: 271.464310068617, fomo: 171.451143201232, alpha: 0, kek: 7.14379763338465 }, // L6
    { fud: 290.7858797456, fomo: 239.949187482383, alpha: 0, kek: 19.3179430600224 }, // L7
    { fud: 371.591066071916, fomo: 310.3111358776, alpha: 0, kek: 24.7727377381277 }, // L8
    { fud: 291.662568123868, fomo: 364.578210154835, alpha: 0, kek: 43.7493852185802 }, // L9
    ],
    buildTime: [0, 43200, 86400, 129600, 172800, 216000, 259200, 302400, 345600],
    harvestRates: [2.083333333, 5.126953125, 9.130859375, 15.05533854, 24.82096354, 42.26888021, 75.08138021, 138.6230469, 263.6230469]
    }
    newRules.installations.harvester_fomo = { ...currentRules.installations.harvester_fomo, 
    buildCosts: [
    { fud: 52.0842479264345, fomo: 41.6673983411476, alpha: 0, kek: 0 }, // L1
    { fud: 77.206307266993, fomo: 58.8238531558042, alpha: 0, kek: 0 }, // L2
    { fud: 98.7491445491929, fomo: 75.2374434660517, alpha: 0, kek: 0 }, // L3
    { fud: 102.924789045055, fomo: 102.924789045055, alpha: 0, kek: 3.25711357737516 }, // L4
    { fud: 151.673361809591, fomo: 151.673361809591, alpha: 0, kek: 4.81502735903464 }, // L5
    { fud: 225.029625451617, fomo: 225.029625451617, alpha: 0, kek: 7.14379763338465 }, // L6
    { fud: 213.51410750551, fomo: 321.28789510353, alpha: 0, kek: 21.3514107505511 }, // L7
    { fud: 273.803943421412, fomo: 410.705915132118, alpha: 0, kek: 27.3803943421412 }, // L8
    { fud: 161.181945542137, fomo: 483.545836626412, alpha: 0, kek: 48.3545836626412 }, // L9
    ],
    buildTime: [0, 47808, 95494.73684, 145152, 196363.6364, 239040, 285120, 336000, 387072],
    harvestRates: [1.041666667, 2.298289332, 4.164953399, 6.856886861, 11.20390715, 19.1775475, 33.89090079, 62.71808385, 119.2034647]
    }
    newRules.installations.harvester_alpha = { ...currentRules.installations.harvester_alpha, 
    buildCosts: [
    { fud: 46.8758231337911, fomo: 31.2505487558607, alpha: 2.60421239632173, kek: 0 }, // L1
    { fud: 66.1768348002797, fomo: 40.4413990446154, alpha: 3.67649082223776, kek: 0 }, // L2
    { fud: 84.6421238993082, fomo: 52.9013274370676, alpha: 5.87792527078529, kek: 0 }, // L3
    { fud: 87.9420665891292, fomo: 72.9593441332035, alpha: 7.81707258570037, kek: 2.60569086190012 }, // L4
    { fud: 130.005738693935, fomo: 108.338115578279, alpha: 10.5930601898762, kek: 4.33352462313118 }, // L5
    { fud: 192.882536101386, fomo: 160.735446751155, alpha: 16.0735446751155, kek: 6.42941787004619 }, // L6
    { fud: 183.01209214758, fomo: 229.78184902974, alpha: 22.3681445958154, kek: 18.301209214758 }, // L7
    { fud: 234.68909436121, fomo: 293.361367951513, alpha: 28.6842226441479, kek: 23.468909436121 }, // L8
    { fud: 276.311906643664, fomo: 345.38988330458, alpha: 34.538988330458, kek: 41.4467859965496 }, // L9
    ],
    buildTime: [0, 41472, 81852.63158, 124416, 169658.1818, 207360, 259200, 288960, 331776],
    harvestRates: [0.744047619, 1.414331897, 2.40285773, 3.875631704, 6.54997649, 11.15428783, 19.55244276, 36.34432551, 69.22970448]
    }
    newRules.installations.harvester_kek = { ...currentRules.installations.harvester_kek, 
    buildCosts: [
    { fud: 57.292672719078, fomo: 36.4589735485042, alpha: 0, kek: 1.56252743779304 }, // L1
    { fud: 80.8827980892308, fomo: 51.4708715113287, alpha: 0, kek: 1.83824541111888 }, // L2
    { fud: 103.451484765821, fomo: 64.6571779786382, alpha: 0, kek: 2.58628711914553 }, // L3
    { fud: 107.48474805338, fomo: 91.1991801665044, alpha: 0, kek: 7.16564987022534 }, // L4
    { fud: 158.895902848143, fomo: 132.413252373453, alpha: 0, kek: 10.5930601898762 }, // L5
    { fud: 235.745321901694, fomo: 196.454434918078, alpha: 0, kek: 15.7163547934462 }, // L6
    { fud: 223.681445958154, fomo: 280.618541292957, alpha: 0, kek: 33.5522168937231 }, // L7
    { fud: 286.842226441479, fomo: 358.552783051849, alpha: 0, kek: 43.0263339662219 }, // L8
    { fud: 168.857276282239, fomo: 422.143190705598, alpha: 0, kek: 67.5429105128957 }, // L9
    ],
    buildTime: [0, 50688, 100042.1053, 152064, 207360, 253440, 302400, 349440, 405504],
    harvestRates: [0.1488095238, 0.3535829741, 0.8009525768, 1.341564821, 2.068413628, 3.522406684, 6.517480921, 11.90035437, 22.46526834]
    }

// remove the altar level prerequisite
for (let i in newRules.installations) {
    newRules.installations[i].levelPrerequisite = undefined
}    

module.exports = newRules