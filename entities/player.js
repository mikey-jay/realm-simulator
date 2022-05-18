const Wallet = require('./wallet.js')

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
    for (let p = 0 ; p < walletIn.parcels.length ; p++)
        for (i of walletIn.parcels[p].installations) {
            if (i.level > 0) {
                if (typeof totals[i.type] == 'undefined') totals[i.type] = [...zeroTotals]
                totals[i.type][i.level - 1]++
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

