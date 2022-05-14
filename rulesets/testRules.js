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
    height: 1
}

module.exports = {
    craftingRevenueDistribution: {
        greatPortal: 0.35,
        pixelCraft: 0.3,
        dao: 0.3,
        burn: 0.5
    },
    installations: {
        altar: structuredClone(installationTemplate),
        reservoir: structuredClone(installationTemplate),
        harvester: structuredClone(installationTemplate),
        maker: structuredClone(installationTemplate)
    }
}