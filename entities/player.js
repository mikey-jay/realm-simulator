const Wallet = require('./wallet.js')
const Parcel = require('./parcel.js')
const { addArrays } = require('../utils.js')

function create () {
    return { ...Wallet.create() }
}

function getTotalParcels (walletIn) {
    let totals = { humble: 0, reasonable: 0, spacious: 0, partner: 0 }
    for (p of walletIn.parcels)
        totals[p.size] += 1
    return totals;
}

function getTotalInstallations (walletIn) {
    const zeroTotals = [0,0,0,0,0,0,0,0,0]
    let totals = {}
    for (playerParcel of walletIn.parcels) {
        let parcelTotals = Parcel.getTotalInstallations(playerParcel)
        for (let type in parcelTotals) {
            if (typeof totals[type] == 'undefined') totals[type] = [...zeroTotals]
            totals[type] = addArrays(totals[type], parcelTotals[type])      
        }
    }
    return totals;
}


module.exports = {
    ...Wallet,
    create,
    getTotalParcels,
    getTotalInstallations
}

