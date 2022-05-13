const Wallet = require('./wallet.js')

const parcelSizes = {
    humble: { width: 8, height: 8 },
    reasonable: { width: 16, height: 16 },
    spacious: { width: 32, height: 64 },
    paartner: { width: 64, height: 64 }
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
    if (installation.width > parcelOut.width || installation.height > parcelOut.height) throw new Error('installation is too large to fit on parcel')
    const getInstallationArea = (i) => i.width * i.height
    const usedSpace = parcelOut.installations.reduce((total, i) => total + getInstallationArea(i), 0)
    const freeSpace = parcelOut.width * parcelOut.height - usedSpace
    if (freeSpace < getInstallationArea(installation)) throw new Error('not enough space on parcel')
    return Wallet.addInstallation(parcelOut, installation)
}

function getInstallationTypeCount (parcelIn, installationType) {
    return parcelIn.installations.filter((i) => i.type == installationType).length
}

module.exports = {
    create,
    addAlchemica: Wallet.addTokens,
    removeAlchemica: Wallet.removeTokens,
    addInstallation,
    removeInstallation: Wallet.removeInstallation,
    getInstallationTypeCount
}
