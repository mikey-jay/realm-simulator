const installationTemplate = {
    maxLevel: 9,
    buildTime: [0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000],
    buildCosts: [
        { 'fud': 1000, 'fomo': 100, 'alpha': 10, 'kek': 1 }, // L1
        { 'fud': 2000, 'fomo': 200, 'alpha': 20, 'kek': 2 }, // L2
        { 'fud': 3000, 'fomo': 300, 'alpha': 30, 'kek': 3 }, // L3
        { 'fud': 4000, 'fomo': 400, 'alpha': 40, 'kek': 4 }, // L4
        { 'fud': 5000, 'fomo': 500, 'alpha': 50, 'kek': 5 }, // L5
        { 'fud': 6000, 'fomo': 600, 'alpha': 60, 'kek': 6 }, // L6
        { 'fud': 7000, 'fomo': 700, 'alpha': 70, 'kek': 7 }, // L7
        { 'fud': 8000, 'fomo': 800, 'alpha': 80, 'kek': 8 }, // L8
        { 'fud': 9000, 'fomo': 900, 'alpha': 90, 'kek': 9 }, // L9
    ],
    maxQuantityPerParcel: {
        'humble': 1,
        'reasonable': 1,
        'spacious': 1,
        'partner': 1
    },
    width: 1,
    height: 1,
    prerequisites: [],
    levelPrerequisite: undefined
}
const harvesterTemplate = {
    ...installationTemplate,
    harvestRates: [ 10, 20, 30, 40, 50, 60, 70, 80, 90 ]
}
const reservoirTemplate = {
    ...installationTemplate,
    spilloverRates: [ 0.5, 0.45, 0.4, 0.35, 0.3, 0.25, 0.20, 0.15, 0.10 ],
    capacities: [ 10, 20, 30, 40, 50, 60, 70, 80, 90 ]
}

const secondsPerBlock = 2.3
const surveyingActBlocks = 60 / secondsPerBlock * 60 * 24 * 365 * 2 // 2 years
const surveyingRoundBlocks = surveyingActBlocks / 4

module.exports = {
    secondsPerBlock,
    passTimeBlocks: 60 / secondsPerBlock * 60 * 8, // 8 hours between reservoir emptying
    parcelTokenAllocation: {
        fud: 100 * 10**9 * 0.5,
        fomo: 50 * 10**9 * 0.5,
        alpha: 25 * 10**9 * 0.5,
        kek: 10 * 10**9 * 0.5
    },
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
        surveyingRoundBlocks * 10,
        surveyingRoundBlocks * 11
    ],
    surveyingRoundDistributionRates: [
        0.5 / 4,
        0.5 / 4,
        0.5 / 4,
        0.5 / 4,
        0.3 / 4,
        0.3 / 4,
        0.3 / 4,
        0.3 / 4,
        0.2 / 4,
        0.2 / 4,
        0.2 / 4,
        0.2 / 4
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
        burn: 0.5
    },
    maxConcurrentUpgrades: undefined,
    installations: {
        altar: {...structuredClone(installationTemplate), prerequisites: [], levelPrerequisite: undefined},
        reservoir_fud: structuredClone(reservoirTemplate),
        reservoir_fomo: structuredClone(reservoirTemplate),
        reservoir_alpha: structuredClone(reservoirTemplate),
        reservoir_kek: structuredClone(reservoirTemplate),
        harvester_fud: {...structuredClone(harvesterTemplate), useReservoirType: 'reservoir_fud'},
        harvester_fomo: {...structuredClone(harvesterTemplate), useReservoirType: 'reservoir_fomo'},
        harvester_alpha: {...structuredClone(harvesterTemplate), useReservoirType: 'reservoir_alpha'},
        harvester_kek: {...structuredClone(harvesterTemplate), useReservoirType: 'reservoir_kek'},
        maker: {...structuredClone(installationTemplate), concurrentUpgradeIncreases: [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]}
    }
}