const installationTemplate = {
    maxLevel: 9,
    maxQuantityPerParcel: {
        humble: 8,
        reasonable: 32,
        spacious: 256,
        partner: 512
    },
    prerequisites: ['altar'],
    levelPrerequisite: 'altar'
}
const harvesterTemplate = {
    ...installationTemplate,
    class: 'harvester',
    maxQuantityPerParcel: {
        humble: 4,
        reasonable: 16,
        spacious: 128,
        partner: 256
    }
}
const reservoirTemplate = {
    ...installationTemplate,
    spilloverRates: [ 0.5, 0.45, 0.4, 0.35, 0.3, 0.25, 0.20, 0.15, 0.10 ],
    class: 'reservoir',
}
const altar = { ...installationTemplate,
    buildCosts: [
        { fud: 0, fomo: 0, alpha: 0, kek: 0 }, // L1
        { fud: 300, fomo: 150, alpha: 75, kek: 10 }, // L2
        { fud: 600, fomo: 300, alpha: 150, kek: 20 }, // L3
        { fud: 1000, fomo: 750, alpha: 375, kek: 100 }, // L4
        { fud: 2000, fomo: 1500, alpha: 750, kek: 200 }, // L5
        { fud: 4000, fomo: 3000, alpha: 1500, kek: 400 }, // L6
        { fud: 5000, fomo: 7500, alpha: 3750, kek: 1500 }, // L7
        { fud: 10000, fomo: 15000, alpha: 7500, kek: 3000 }, // L8
        { fud: 20000, fomo: 30000, alpha: 15000, kek: 6000 }, // L9
    ],
    buildTime: [0, 65000, 160000, 320000, 475000, 630000, 1250000, 1900000, 3200000],
    prerequisites: [],
    levelPrerequisite: undefined,
    class: 'altar',
    maxQuantityPerParcel: {
        'humble': 1,
        'reasonable': 1,
        'spacious': 1,
        'partner': 1
    }
}
const maker = { ...installationTemplate,
    buildCosts: [
        { fud: 2500, fomo: 300, alpha: 500, kek: 125 }, // L1
        { fud: 5000, fomo: 650, alpha: 950, kek: 250 }, // L2
        { fud: 10000, fomo: 1250, alpha: 1900, kek: 500 }, // L3
        { fud: 15000, fomo: 2500, alpha: 3750, kek: 1500 }, // L4
        { fud: 22500, fomo: 3700, alpha: 5600, kek: 2200 }, // L5
        { fud: 30000, fomo: 5000, alpha: 7500, kek: 3000 }, // L6
        { fud: 27500, fomo: 6900, alpha: 10300, kek: 5500 }, // L7
        { fud: 35000, fomo: 8750, alpha: 13100, kek: 7000 }, // L8
        { fud: 42500, fomo: 10500, alpha: 16000, kek: 8500 }, // L9
    ],
    buildTime: [0, 65000, 160000, 320000, 475000, 630000, 1250000, 1900000, 3200000],
    class: 'maker',
    maxQuantityPerParcel: {
        'humble': 1,
        'reasonable': 1,
        'spacious': 1,
        'partner': 1
    },
    concurrentUpgradeIncreases: [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
    harvesterQtyIncreases: [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
}
const harvester_fud = { ...harvesterTemplate,
    buildCosts: [
        { fud: 120, fomo: 60, alpha: 0, kek: 0 }, // L1
        { fud: 240, fomo: 120, alpha: 0, kek: 0 }, // L2
        { fud: 475, fomo: 240, alpha: 0, kek: 0 }, // L3
        { fud: 950, fomo: 600, alpha: 0, kek: 25 }, // L4
        { fud: 1900, fomo: 1200, alpha: 0, kek: 50 }, // L5
        { fud: 3800, fomo: 2400, alpha: 0, kek: 100 }, // L6
        { fud: 7150, fomo: 5900, alpha: 0, kek: 475 }, // L7
        { fud: 14250, fomo: 11900, alpha: 0, kek: 950 }, // L8
        { fud: 19000, fomo: 23750, alpha: 0, kek: 2850 }, // L9
    ],
    buildTime: [0, 7500, 19000, 37500, 55000, 75000, 150000, 225000, 375000],
    harvestRates: [14, 29, 57, 101, 144, 216, 288, 431, 575],
    useReservoirType: 'reservoir_fud'
}
const harvester_fomo = { ...harvesterTemplate,
    buildCosts: [
        { fud: 100, fomo: 80, alpha: 0, kek: 0 }, // L1
        { fud: 210, fomo: 160, alpha: 0, kek: 0 }, // L2
        { fud: 420, fomo: 320, alpha: 0, kek: 0 }, // L3
        { fud: 790, fomo: 790, alpha: 0, kek: 25 }, // L4
        { fud: 1575, fomo: 1575, alpha: 0, kek: 50 }, // L5
        { fud: 3150, fomo: 3150, alpha: 0, kek: 100 }, // L6
        { fud: 5250, fomo: 7900, alpha: 0, kek: 525 }, // L7
        { fud: 10500, fomo: 15750, alpha: 0, kek: 1050 }, // L8
        { fud: 10500, fomo: 31500, alpha: 0, kek: 3150 }, // L9
    ],
    buildTime: [0, 8300, 21000, 42000, 62500, 83000, 165000, 250000, 420000],
    harvestRates: [7, 13, 26, 46, 65, 98, 130, 195, 260],
    useReservoirType: 'reservoir_fomo'
}
const harvester_alpha = { ...harvesterTemplate,
    buildCosts: [
        { fud: 90, fomo: 60, alpha: 5, kek: 0 }, // L1
        { fud: 180, fomo: 110, alpha: 10, kek: 0 }, // L2
        { fud: 360, fomo: 225, alpha: 25, kek: 0 }, // L3
        { fud: 675, fomo: 560, alpha: 60, kek: 20 }, // L4
        { fud: 1350, fomo: 1125, alpha: 110, kek: 45 }, // L5
        { fud: 2700, fomo: 2250, alpha: 225, kek: 90 }, // L6
        { fud: 45000, fomo: 5650, alpha: 550, kek: 450 }, // L7
        { fud: 9000, fomo: 11250, alpha: 1100, kek: 900 }, // L8
        { fud: 18000, fomo: 22500, alpha: 2250, kek: 2700 }, // L9
    ],
    buildTime: [0, 7200, 18000, 36000, 54000, 72000, 150000, 215000, 360000],
    harvestRates: [5, 8, 15, 26, 38, 57, 75, 113, 151],
    useReservoirType: 'reservoir_alpha'
}
const harvester_kek = { ...harvesterTemplate,
    buildCosts: [
    { fud: 110, fomo: 70, alpha: 0, kek: 3 }, // L1
    { fud: 220, fomo: 140, alpha: 0, kek: 5 }, // L2
    { fud: 440, fomo: 275, alpha: 0, kek: 11 }, // L3
    { fud: 825, fomo: 700, alpha: 0, kek: 55 }, // L4
    { fud: 1650, fomo: 1375, alpha: 0, kek: 110 }, // L5
    { fud: 3300, fomo: 2750, alpha: 0, kek: 220 }, // L6
    { fud: 5500, fomo: 6900, alpha: 0, kek: 825 }, // L7
    { fud: 11000, fomo: 13750, alpha: 0, kek: 1650 }, // L8
    { fud: 11000, fomo: 27500, alpha: 0, kek: 4400 }, // L9
    ],
    buildTime: [0, 8800, 22000, 44000, 66000, 88000, 175000, 260000, 440000],
    harvestRates: [1, 2, 5, 9, 12, 18, 25, 37, 49],
    useReservoirType: 'reservoir_kek'
}
const reservoir_fud = { ...reservoirTemplate,
    buildCosts: [
        { fud: 290, fomo: 100, alpha: 0, kek: 0 }, // L1
        { fud: 570, fomo: 190, alpha: 0, kek: 0 }, // L2
        { fud: 1140, fomo: 380, alpha: 0, kek: 0 }, // L3
        { fud: 2400, fomo: 950, alpha: 0, kek: 50 }, // L4
        { fud: 4750, fomo: 1900, alpha: 0, kek: 100 }, // L5
        { fud: 9500, fomo: 3800, alpha: 0, kek: 190 }, // L6
        { fud: 19000, fomo: 9500, alpha: 0, kek: 950 }, // L7
        { fud: 38000, fomo: 19000, alpha: 0, kek: 1900 }, // L8
        { fud: 57000, fomo: 38000, alpha: 0, kek: 5700 }, // L9
    ],
    buildTime: [0, 30000, 75000, 150000, 225000, 300000, 600000, 900000, 1500000],
    capacities: [5, 20, 70, 250, 550, 1300, 2750, 6600, 13300]
}
const reservoir_fomo = { ...reservoirTemplate,
    buildCosts: [
        { fud: 260, fomo: 130, alpha: 0, kek: 0 }, // L1
        { fud: 525, fomo: 260, alpha: 0, kek: 0 }, // L2
        { fud: 1050, fomo: 525, alpha: 0, kek: 0 }, // L3
        { fud: 2100, fomo: 1300, alpha: 0, kek: 50 }, // L4
        { fud: 4200, fomo: 2600, alpha: 0, kek: 105 }, // L5
        { fud: 8400, fomo: 5250, alpha: 0, kek: 210 }, // L6
        { fud: 15800, fomo: 13100, alpha: 0, kek: 1050 }, // L7
        { fud: 31500, fomo: 26300, alpha: 0, kek: 2100 }, // L8
        { fud: 42000, fomo: 52500, alpha: 0, kek: 6300 }, // L9
    ],
    buildTime: [0, 33500, 83000, 165000, 250000, 325000, 675000, 1000000, 1700000],
    capacities: [2, 9, 30, 120, 250, 600, 1300, 3200, 6500]
}
const reservoir_alpha = { ...reservoirTemplate,
    buildCosts: [
        { fud: 225, fomo: 90, alpha: 10, kek: 0 }, // L1
        { fud: 450, fomo: 180, alpha: 25, kek: 0 }, // L2
        { fud: 900, fomo: 360, alpha: 50, kek: 0 }, // L3
        { fud: 1800, fomo: 900, alpha: 110, kek: 45 }, // L4
        { fud: 3600, fomo: 1800, alpha: 225, kek: 90 }, // L5
        { fud: 7200, fomo: 3600, alpha: 450, kek: 180 }, // L6
        { fud: 13500, fomo: 9000, alpha: 1100, kek: 900 }, // L7
        { fud: 27000, fomo: 18000, alpha: 2250, kek: 1800 }, // L8
        { fud: 36000, fomo: 36000, alpha: 4500, kek: 5400 }, // L9
    ],
    buildTime: [0, 29000, 72000, 140000, 220000, 290000, 575000, 860000, 1450000],
    capacities: [1, 5, 20, 65, 150, 350, 775, 1900, 3900]
}
const reservoir_kek = { ...reservoirTemplate,
    buildCosts: [
        { fud: 275, fomo: 110, alpha: 0, kek: 5 }, // L1
        { fud: 550, fomo: 220, alpha: 0, kek: 10 }, // L2
        { fud: 1100, fomo: 440, alpha: 0, kek: 20 }, // L3
        { fud: 2200, fomo: 1100, alpha: 0, kek: 110 }, // L4
        { fud: 4400, fomo: 2200, alpha: 0, kek: 220 }, // L5
        { fud: 8800, fomo: 4400, alpha: 0, kek: 440 }, // L6
        { fud: 16500, fomo: 11000, alpha: 0, kek: 1650 }, // L7
        { fud: 33000, fomo: 22000, alpha: 0, kek: 3300 }, // L8
        { fud: 66000, fomo: 44000, alpha: 0, kek: 8800 }, // L9
    ],
    buildTime: [0, 36000, 88000, 175000, 260000, 350000, 700000, 1050000, 1750000],
    capacities: [0.5, 2, 6, 25, 50, 100, 225, 550, 1100]
}

const secondsPerBlock = 2.3 // as per polygon
const surveyingActBlocks = 60 / secondsPerBlock * 60 * 24 * 365 * 2 // 2 years
const surveyingRoundBlocks = surveyingActBlocks / 10 // 10 rounds of alchemica distribution per act

module.exports = {
    maxReservoirEmptiesPerDay: 3,
    secondsPerBlock,
    parcelTokenAllocation: {
        fud: 100 * 10**9 * 0.5,
        fomo: 50 * 10**9 * 0.5,
        alpha: 25 * 10**9 * 0.5,
        kek: 10 * 10**9 * 0.5
    },
    destroyInstallationValueRate: 0.5,
    surveyingRoundBlocks,
    surveyingRoundStartTimes: [
        0,
        surveyingRoundBlocks,
        surveyingRoundBlocks * 2,
        surveyingRoundBlocks * 3,
        surveyingRoundBlocks * 4,
        surveyingRoundBlocks * 5,
        surveyingRoundBlocks * 6,
        surveyingRoundBlocks * 7,
        surveyingRoundBlocks * 8,
        surveyingRoundBlocks * 9,
    ],
    surveyingRoundDistributionRates: [
        0.25,
        0.75 / 9,
        0.75 / 9,
        0.75 / 9,
        0.75 / 9,
        0.75 / 9,
        0.75 / 9,
        0.75 / 9,
        0.75 / 9,
        0.75 / 9,
    ],
    avgBaseAlchemicaPerParcel: {
        humble: {
            fud: 28473 * 2,
            fomo: 14237 * 2,
            alpha: 7118 * 2,
            kek: 2847 * 2
        },
        reasonable: {
            fud: 113893 * 2,
            fomo: 56947 * 2,
            alpha: 28473 * 2,
            kek: 11389 * 2
        },
        spacious: {
            fud: 911145 * 2,
            fomo: 455573 * 2,
            alpha: 227786 * 2,
            kek: 91115 * 2
        },
        partner: {
            fud: 1822290 * 2,
            fomo: 911145 * 2,
            alpha: 455573 * 2,
            kek: 182229 * 2
        }
    },
    craftingRevenueDistribution: {
        greatPortal: 0.35,
        pixelCraft: 0.3,
        dao: 0.3,
        burn: 0.05
    },
    maxConcurrentUpgrades: 1,
    installations: {
        altar,
        reservoir_fud,
        reservoir_fomo,
        reservoir_alpha,
        reservoir_kek,
        harvester_fud,
        harvester_fomo,
        harvester_alpha,
        harvester_kek,
        maker
    },
    maxQuantityPerInstallationClass: {
        harvester: {
            humble: 4,
            reasonable: 16,
            spacious: 128,
            partner: 256
        }
    },
}