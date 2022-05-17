function pipe(input, ...args) {
    if (args.length == 0) return input
    const [func, ...params] = Array.isArray(args[0]) ? args.shift() : [args.shift(), []]
    if (typeof func != 'function') throw new Error ('Each pipe argument after the first argument should either be a function or an array with a function as the first element')
    return pipe(func(input, ...params), ...args)
}

function getWeightedAverage(dataset, weights) {
    if (dataset.length !== weights.length) throw new Error('Cannot get weighted average - dataset and weights must be arrays of the same length')
    const sumArray = (arr) => arr.reduce((total, item) => total + item)
    //const averageArray = (arr) => sumArray(arr) / arr.length
    // const sumOfWeights = sumArray(weights)
    //const pctOfTotalWeights = weights.map((w) => w / sumOfWeights)
    let weightedDataset = []
    for (let i = 0 ; i < dataset.length ; i++) {
        weightedDataset.push(dataset[i] * weights[i])
    }
    return sumArray(weightedDataset) / sumArray(weights)
}

module.exports = {
    pipe,
    getWeightedAverage
}