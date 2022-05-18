const Wallet = require("./wallet")

function create (strategy) {
    return { walletStart: Wallet.create(), strategy, playerIndex: undefined }
}

module.exports = {
    create
}