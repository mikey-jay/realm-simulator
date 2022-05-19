const Wallet = require('./wallet.js')

const parcelSizes = {
    humble: { width: 8, height: 8 },
    reasonable: { width: 16, height: 16 },
    spacious: { width: 32, height: 64 },
    partner: { width: 64, height: 64 }
}

function create (size) {
    if (!Object.keys(parcelSizes).includes(size)) throw new Error ('invalid parcel size')
    const wallet = Wallet.create()
    return {
        size,
        width: parcelSizes[size].width,
        height: parcelSizes[size].height,
        ...wallet
    }
}

function addInstallation (parcelIn, installation) {
    let parcelOut = structuredClone(parcelIn)
    if (!hasSpaceForInstallation(parcelOut, installation)) throw new Error('not enough space on parcel')
    return Wallet.addInstallation(parcelOut, installation)
}

function getFreeSpace (parcelIn) {
    const getInstallationArea = (i) => i.width * i.height    
    const usedSpace = parcelIn.installations.reduce((total, i) => total + getInstallationArea(i), 0)
    return parcelIn.width * parcelIn.height - usedSpace    
}

function hasSpaceForInstallation (parcelIn, installation) {
    if (installation.width > parcelIn.width || installation.height > parcelIn.height) return false
    return getFreeSpace(parcelIn) >= installation.width * installation.height
}

function getInstallationTypeCount (parcelIn, installationType) {
    return getInstallationsOfType(parcelIn, installationType).length
}

function getInstallationClassCount (parcelIn, installationType) {
    return getInstallationsOfClass(parcelIn, installationType).length
}

function getInstallationPropertyIndexes (parcelIn, property, value) {
    let indexes = []
    for (let i = 0 ; i < parcelIn.installations.length ; i++) {
        if (parcelIn.installations[i][property] == value) indexes.push(i)
    }
    return indexes
}

function getInstallationTypeIndexes (parcelIn, installationType) {
    return getInstallationPropertyIndexes(parcelIn, 'type', installationType)
}

function getInstallationClassIndexes (parcelIn, installationClass) {
    return getInstallationPropertyIndexes(parcelIn, 'class', installationClass)
}

function getInstallationsOfType (parcelIn, installationType) {
    return parcelIn.installations.filter((i) => i.type == installationType)
}

function getInstallationsOfClass (parcelIn, installationType) {
    return parcelIn.installations.filter((i) => i.class == installationType)
}

function getInstallationLevelCount (parcelIn, installationType) {
    let count = [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
    parcelIn.installations.filter((i) => i.type == installationType).forEach((i) => count[i.level - 1]++)
    return count
}

function getCurrentUpgradeCount (parcelIn) {
    return parcelIn.installations.filter((i) => i.buildLevel != i.level && i.buildLevel > 1).length
}

function getTotalInstallations (parcelIn) {
    const zeroTotals = [0,0,0,0,0,0,0,0,0]
    let totals = {}
    for (i of parcelIn.installations) {
        if (i.level > 0) {
            if (typeof totals[i.type] == 'undefined') totals[i.type] = [...zeroTotals]
            totals[i.type][i.level - 1]++
        }
    }
    return totals;
}

module.exports = {
    ...Wallet,
    create,
    addAlchemica: Wallet.addTokens,
    removeAlchemica: Wallet.removeTokens,
    addInstallation,
    removeInstallation: Wallet.removeInstallation,
    getInstallationTypeCount,
    getInstallationClassCount,
    getInstallationLevelCount,
    getInstallationsOfType,
    getInstallationsOfClass,
    getInstallationTypeIndexes,
    getInstallationClassIndexes,
    getCurrentUpgradeCount,
    getTotalInstallations,
    getFreeSpace,
    hasSpaceForInstallation
}
