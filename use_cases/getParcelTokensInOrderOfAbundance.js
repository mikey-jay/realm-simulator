const Parcel = require('../entities/parcel.js')
const { getWalletValueInFudTerms } = require('../use_cases/getWalletValueInFudTerms.js')
const { pipe } = require('../utils.js')

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
    let fudValueOfMostAbundantToken = 0
    tokensToFarm.forEach((token) => {
        const parcelWithOnlyThisToken = pipe(Parcel.create(myParcel.size), [Parcel.addTokens, token, myParcel.tokens[token] || 0])
        const fudValueOfParcelToken = getWalletValueInFudTerms(parcelWithOnlyThisToken, tokenSupply)
        if (fudValueOfParcelToken > fudValueOfMostAbundantToken) {
            mostAbundantToken = token
            fudValueOfMostAbundantToken = fudValueOfParcelToken
        }
    })
    return mostAbundantToken
}

module.exports = {
    getParcelTokensInOrderOfAbundance,
    getMostAbundantTokenInParcel
}