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
    if (installation.width > parcelIn.width || installation.height > parcelIn.height) throw new Error('installation is too large to fit on parcel')
    const getInstallationArea = (i) => i.width * i.height
    const usedSpace = parcelIn.installations.reduce((total, i) => total + getInstallationArea(i), 0)
    const freeSpace = parcelIn.width * parcelIn.height - usedSpace
    if (freeSpace < getInstallationArea(installation)) throw new Error('not enough space on parcel')
    return Wallet.addInstallation(parcelIn, installation)
}

module.exports = {
    create,
    addAlchemica: Wallet.addTokens,
    removeAlchemica: Wallet.removeTokens,
    addInstallation,
    removeInstallation: Wallet.removeInstallation
}
