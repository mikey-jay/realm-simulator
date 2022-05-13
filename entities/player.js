const Wallet = require('./wallet.js')

function create () {
    return { ...Wallet.create() }
}

module.exports = {
    create,
    addTokens: Wallet.addTokens,
    removeTokens: Wallet.removeTokens,
    addParcel: Wallet.addParcel,
    removeParcel: Wallet.removeParcel,
    addInstallation: Wallet.addInstallation,
    removeInstallation: Wallet.removeInstallation
}

