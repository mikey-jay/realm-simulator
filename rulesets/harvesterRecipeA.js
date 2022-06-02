const currentRules = require('./current.js')

const newRules = structuredClone(currentRules)

newRules.installations.reservoir_fud.spilloverRates = [0.67, 0.57, 0.48, 0.38, 0.29, 0.24, 0.19, 0.14, 0.10]
newRules.installations.reservoir_fomo.spilloverRates = [0.74, 0.63, 0.53, 0.42, 0.32, 0.26, 0.21, 0.16, 0.11]
newRules.installations.reservoir_alpha.spilloverRates = [0.63, 0.54, 0.45, 0.36, 0.27, 0.23, 0.18, 0.14, 0.09]
newRules.installations.reservoir_kek.spilloverRates = [0.77, 0.66, 0.55, 0.44, 0.33, 0.28, 0.22, 0.17, 0.11]

newRules.installations.harvester_fud = { ...currentRules.installations.harvester_fud, 
    buildCosts: [
    { fud: 10, fomo: 5, alpha: 0, kek: 0 }, // L1
    { fud: 30, fomo: 15, alpha: 0, kek: 0 }, // L2
    { fud: 79.5811518324607, fomo: 40.2094240837696, alpha: 0, kek: 0 }, // L3
    { fud: 166.25, fomo: 105, alpha: 0, kek: 4.375 }, // L4
    { fud: 395.833333333333, fomo: 250, alpha: 0, kek: 10.4166666666667 }, // L5
    { fud: 831.25, fomo: 525, alpha: 0, kek: 21.875 }, // L6
    { fud: 1267.08860759494, fomo: 1045.56962025316, alpha: 0, kek: 84.1772151898734 }, // L7
    { fud: 2097.79179810726, fomo: 1751.84016824395, alpha: 0, kek: 139.852786540484 }, // L8
    { fud: 2160, fomo: 2700, alpha: 0, kek: 324 }, // L9
    ],
    buildTime: [3500, 8333, 20833, 41667, 62500, 83333, 166667, 250000, 416667],
    harvestRates: [5.0, 8.0, 13.0, 22.0, 40.0, 75.0, 150.0, 310.0, 700.0]
    }
    newRules.installations.harvester_fomo = { ...currentRules.installations.harvester_fomo, 
    buildCosts: [
    { fud: 7.69230769230769, fomo: 6.15384615384615, alpha: 0, kek: 0 }, // L1
    { fud: 23.7735849056604, fomo: 18.1132075471698, alpha: 0, kek: 0 }, // L2
    { fud: 63.3962264150943, fomo: 48.3018867924528, alpha: 0, kek: 0 }, // L3
    { fud: 126.641221374046, fomo: 126.641221374046, alpha: 0, kek: 4.00763358778626 }, // L4
    { fud: 301.435406698565, fomo: 301.435406698565, alpha: 0, kek: 9.56937799043062 }, // L5
    { fud: 633.014354066986, fomo: 633.014354066986, alpha: 0, kek: 20.0956937799043 }, // L6
    { fud: 838.403041825095, fomo: 1261.59695817491, alpha: 0, kek: 83.8403041825095 }, // L7
    { fud: 1400, fomo: 2100, alpha: 0, kek: 140 }, // L8
    { fud: 1080, fomo: 3240, alpha: 0, kek: 324 }, // L9
    ],
    buildTime: [3500, 9211, 23026, 46053, 69079, 92105, 184211, 276316, 460526],
    harvestRates: [2.1, 3.6, 5.9, 9.8, 18.1, 33.7, 67.7, 140.3, 316.5]
    }
    newRules.installations.harvester_alpha = { ...currentRules.installations.harvester_alpha, 
    buildCosts: [
    { fud: 7.82608695652174, fomo: 5.21739130434783, alpha: 0.434782608695652, kek: 0 }, // L1
    { fud: 24.5454545454545, fomo: 15, alpha: 1.36363636363636, kek: 0 }, // L2
    { fud: 63.2967032967033, fomo: 39.5604395604396, alpha: 4.3956043956044, kek: 0 }, // L3
    { fud: 126.845637583893, fomo: 105.234899328859, alpha: 11.2751677852349, kek: 3.75838926174497 }, // L4
    { fud: 300.668151447661, fomo: 250.556792873051, alpha: 24.4988864142539, kek: 10.022271714922 }, // L5
    { fud: 630, fomo: 525, alpha: 52.5, kek: 21 }, // L6
    { fud: 840, fomo: 1054.66666666667, alpha: 102.666666666667, kek: 84 }, // L7
    { fud: 1403.11804008909, fomo: 1753.89755011136, alpha: 171.492204899777, kek: 140.311804008909 }, // L8
    { fud: 1963.63636363636, fomo: 2454.54545454545, alpha: 245.454545454545, kek: 294.545454545455 }, // L9
    ],
    buildTime: [3500, 7955, 19886, 39773, 59659, 79545, 159091, 238636, 397727],
    harvestRates: [1.1, 1.9, 3.4, 5.7, 10.3, 19.4, 39.1, 81.3, 182.6]
    }
    newRules.installations.harvester_kek = { ...currentRules.installations.harvester_kek, 
    buildCosts: [
    { fud: 7.85714285714286, fomo: 5, alpha: 0, kek: 0.214285714285714 }, // L1
    { fud: 24., fomo: 15.2727272727273, alpha: 0, kek: 0.545454545454545 }, // L2
    { fud: 64., fomo: 40, alpha: 0, kek: 1.6 }, // L3
    { fud: 124.864864864865, fomo: 105.945945945946, alpha: 0, kek: 8.32432432432433 }, // L4
    { fud: 300., fomo: 250, alpha: 0, kek: 20. }, // L5
    { fud: 630., fomo: 525, alpha: 0, kek: 42. }, // L6
    { fud: 838.475499092559, fomo: 1051.9056261343, alpha: 0, kek: 125.771324863884 }, // L7
    { fud: 1400, fomo: 1750., alpha: 0, kek: 210. }, // L8
    { fud: 1080, fomo: 2700., alpha: 0, kek: 432 }, // L9
    ],
    buildTime: [3500, 9722, 24306, 48611, 72917, 97222, 194444, 291667, 486111],
    harvestRates: [0.4, 0.6, 0.9, 1.7, 3.3, 6.3, 12.5, 25.9, 59.7]
    }
module.exports = newRules