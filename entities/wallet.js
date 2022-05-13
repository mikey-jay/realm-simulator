function create () {
    return { tokens: {}, parcels: [], installations: [], transactions: [], installationsRemoved: [], parcelsRemoved: [] }
}

function addTokens (walletIn, token, qty) {
    let walletOut = {...walletIn}
    if (Object.keys(walletOut.tokens).includes(token))
        walletOut.tokens[token] += qty
    else
        walletOut.tokens[token] = qty
    if (walletOut.tokens[token] < 0) throw new Error(`insufficient ${token} token supply`)
    let tx = getCurrentTransaction(walletOut)
    if (tx) tx = addTokens(tx, token, qty)
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

function removeTokens (walletIn, token, qty) {
    return addTokens(walletIn, token, qty * -1)
}

function startTransaction(walletIn) {
    let walletOut = {...walletIn}
    walletOut.transactions.push(create())
    return walletOut
}

module.exports = {
    create,
    addTokens,
    removeTokens,
    addInstallation,
    removeInstallation,
    addParcel,
    removeParcel,
    startTransaction
}