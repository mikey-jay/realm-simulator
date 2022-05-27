const Wallet = require('../entities/wallet.js')
const { getWalletValueInFudTerms } = require('../use_cases/getWalletValueInFudTerms.js')
const { pipe } = require('../utils.js')
const { getTotalHarvestRates } = require('./getTotalHarvestRates.js')

function getParcelTokensInOrderOfAbundance(verseIn, playerIndex, parcelIndex, tokensToFarm = ['fud', 'fomo', 'alpha', 'kek']) {
    let remainingTokens = [...tokensToFarm]
    let sortedTokens = []
    while (remainingTokens.length > 0) {
        const mostAbundantToken = getMostAbundantTokenInParcel(verseIn, playerIndex, parcelIndex, remainingTokens)
        sortedTokens.push(mostAbundantToken)
        remainingTokens = remainingTokens.filter((t) => t != mostAbundantToken)    
    }
   return sortedTokens
}

function getMostAbundantTokenInParcel(verseIn, playerIndex, parcelIndex, tokensToFarm) {
    const myParcel = verseIn.players[playerIndex].parcels[parcelIndex]
    const tokenSupply = verseIn.rules.parcelTokenAllocation
    let mostAbundantToken = tokensToFarm[0]
    let highestValueToHarvestRateRatio = 0
    for (token of tokensToFarm) {
        const walletWithOnlyThisToken = pipe(Wallet.create(), [Wallet.addTokens, token, myParcel.tokens[token] || 0])
        const fudValueOfParcelToken = getWalletValueInFudTerms(walletWithOnlyThisToken, tokenSupply)
        const harvestRateInTokenTerms = getTotalHarvestRates(verseIn, playerIndex, parcelIndex)[token] || 0
        if (fudValueOfParcelToken > 0) {
            if (harvestRateInTokenTerms == 0)
                return token
            const harvestRateInFudTerms = pipe(Wallet.create(), [Wallet.addTokens, token, harvestRateInTokenTerms], getWalletValueInFudTerms)
            const valueToHarvestRate = fudValueOfParcelToken / harvestRateInFudTerms
            if (valueToHarvestRate > highestValueToHarvestRateRatio) {
                mostAbundantToken = token
                highestValueToHarvestRateRatio = valueToHarvestRate
            }
        }
    }
    return mostAbundantToken
}

module.exports = {
    getParcelTokensInOrderOfAbundance,
    getMostAbundantTokenInParcel
}