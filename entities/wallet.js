function create () {
    return { tokens: {}, parcels: [], installations: [], transactions: [], installationsRemoved: [], parcelsRemoved: [] }
}

function addSingleToken (walletIn, token, qty) {
    let walletOut = {...walletIn}
    if (Object.keys(walletOut.tokens).includes(token))
        walletOut.tokens[token] += qty
    else
        walletOut.tokens[token] = qty
    if (walletOut.tokens[token] < 0) throw new Error(`insufficient ${token} token supply`)
    let tx = getCurrentTransaction(walletOut)
    if (tx) tx = addSingleToken(tx, token, qty)
    return walletOut
}

function addSingleOrMultipleTokens (walletIn, tokens, qtyOrMultiplier = 1) {
    if (typeof tokens == 'string') return addSingleToken (walletIn, tokens, qtyOrMultiplier)
    let walletOut = {...walletIn}
    for (t in tokens)
        walletOut = addSingleToken(walletOut, t, tokens[t] * qtyOrMultiplier)
    return walletOut
}

function getCurrentTransaction(wallet) {
    if (typeof wallet.transactions == 'undefined') return
    return wallet.transactions[wallet.transactions.length - 1]
}

function addNFT(walletIn, type, nft) {
    const walletOut = {...walletIn}
    walletOut[type].push(nft)
    let tx = getCurrentTransaction(walletOut)
    if (tx) tx = addNFT(tx, type, nft)
    return walletOut    
}

function removeNFT (walletIn, type, index) {
    let walletOut = {...walletIn}
    const removedType = `${type}Removed`
    if (index > walletIn[type].length - 1) throw new Error('invalid index (too high)')
    if (index < 0) throw new Error('invalid index (too low)')
    let [removedNFT] = walletOut[type].splice(index, 1)
    return addNFT(walletOut, removedType, removedNFT)
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

function startTransaction(walletIn) {
    let walletOut = {...walletIn}
    walletOut.transactions.push(create())
    return walletOut
}

module.exports = {
    create,
    addTokens: addSingleOrMultipleTokens,
    removeTokens,
    addInstallation,
    removeInstallation,
    addParcel,
    removeParcel,
    startTransaction
}