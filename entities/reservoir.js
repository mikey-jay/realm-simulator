const Installation = require('./installation.js')
const Wallet = require('./wallet.js')

function create(token) {
    if (!token) throw new Error ('Must specify token for reservoir')
    return { token, ...Installation.create('reservoir'), ...Wallet.create() }
}

function addAlchemica(reservoirIn, qty) {
    return Wallet.addTokens(reservoirIn, reservoirIn.token, qty)
}

function removeAlchemica(reservoirIn, qty) {
    return Wallet.removeTokens(reservoirIn, reservoirIn.token, qty)
}

module.exports = {
    create,
    addAlchemica,
    removeAlchemica
}