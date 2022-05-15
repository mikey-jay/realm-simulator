const Player = require('../entities/player.js')
const Wallet = require('../entities/wallet.js')

function spendOnCrafting(gotchiverseIn, playerIndex, buildCosts) {
    let gotchiverseOut = structuredClone(gotchiverseIn)
    const revenueDistroRecipients = Object.keys(gotchiverseOut.rules.craftingRevenueDistribution)
    gotchiverseOut.players[playerIndex] = Player.removeTokens(gotchiverseOut.players[playerIndex], buildCosts)
    revenueDistroRecipients.forEach((recipient) => {
        gotchiverseOut[recipient] = Wallet.addTokens(gotchiverseOut[recipient], buildCosts, gotchiverseOut.rules.craftingRevenueDistribution[recipient])
    })
    return gotchiverseOut    
}

module.exports = { spendOnCrafting }