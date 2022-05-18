
function create(gotchiverse, playerIndex, useCaseName) {
    return { blockTime: gotchiverse.currentTime, playerIndex, useCaseName }
}

module.exports = {
    create
}