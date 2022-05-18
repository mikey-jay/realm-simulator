
function create(gotchiverse, playerIndex, useCaseName) {
    return { blockTime: gotchiverse.currentTime, playerIndex, useCaseName, playerTotals: { tokens: {}, parcels: {}, installations: {}} }
}

module.exports = {
    create
}