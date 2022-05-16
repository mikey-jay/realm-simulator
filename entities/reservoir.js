const Installation = require('./installation.js')
const Wallet = require('./wallet.js')

function create(resourceToken) {
    if (!resourceToken) throw new Error ('Must specify token for reservoir')
    return { resourceToken, ...Installation.create(`reservoir_${resourceToken}`, 'reservoir'), ...Wallet.create() }
}

function addAlchemica(reservoirIn, qty) {
    return Wallet.addTokens(reservoirIn, reservoirIn.resourceToken, qty)
}

function removeAlchemica(reservoirIn, qty) {
    return Wallet.removeTokens(reservoirIn, reservoirIn.resourceToken, qty)
}

module.exports = {
    create,
    addAlchemica,
    removeAlchemica
}