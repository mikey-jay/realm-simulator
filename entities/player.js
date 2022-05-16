const Wallet = require('./wallet.js')

function create () {
    return { ...Wallet.create() }
}

module.exports = {
    ...Wallet,
    create
}

