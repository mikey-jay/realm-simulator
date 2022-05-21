const Player = require('../entities/player.js')
const Wallet = require('../entities/wallet.js')

function getWalletValueInFudTerms(walletIn, tokenSupply) {
    let fudValue = 0
    for (let token in tokenSupply) {
        const fudConversionRate = tokenSupply.fud / tokenSupply[token]
        fudValue += fudConversionRate * (walletIn.tokens[token] || 0)
    }
    return fudValue
}

module.exports = { getWalletValueInFudTerms }