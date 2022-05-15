function create () {
    return { tokens: {}, parcels: [], installations: [] }
}

function addSingleToken (walletIn, token, qty) {
    let walletOut = structuredClone(walletIn)
    if (Object.keys(walletOut.tokens).includes(token))
        walletOut.tokens[token] += qty
    else
        walletOut.tokens[token] = qty
    if (walletOut.tokens[token] < 0) throw new Error(`insufficient ${token} token supply (has ${walletIn.tokens[token]}, requires ${-1 * qty})`)
    return walletOut
}

function addSingleOrMultipleTokens (walletIn, tokens, qtyOrMultiplier = 1) {
    let walletOut = structuredClone(walletIn)
    if (typeof tokens == 'string') return addSingleToken (walletOut, tokens, qtyOrMultiplier)
    for (t in tokens)
        walletOut = addSingleToken(walletOut, t, tokens[t] * qtyOrMultiplier)
    return walletOut
}

function addNFT(walletIn, type, nft) {
    let walletOut = structuredClone(walletIn)
    walletOut[type].push(nft)
    return walletOut    
}

function removeNFT (walletIn, type, index) {
    let walletOut = structuredClone(walletIn)
    if (index > walletIn[type].length - 1) throw new Error('invalid index (too high)')
    if (index < 0) throw new Error('invalid index (too low)')
    let [removedNFT] = walletOut[type].splice(index, 1)
    return walletOut
}

function addInstallation (parcelIn, installation) {
    return addNFT(parcelIn, 'installations', installation)
}

function removeInstallation (parcelIn, installationIndex) {
    return removeNFT(parcelIn, 'installations', installationIndex)
}

function addParcel (walletIn, parcel) {
    return addNFT(walletIn, 'parcels', parcel)
}

function removeParcel (walletIn, parcelIndex) {
    return removeNFT(walletIn, 'parcels', parcelIndex)
}

function removeTokens (walletIn, token, qty = 1) {
    return addSingleOrMultipleTokens(walletIn, token, qty * -1)
}

module.exports = {
    create,
    addTokens: addSingleOrMultipleTokens,
    removeTokens,
    addInstallation,
    removeInstallation,
    addParcel,
    removeParcel
}