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

function addArrays(...arrs) {
    let arr1 = [...arrs[0]]
    let arr2 = [...arrs[1]]
    const longestLength = Math.max(arr1.length, arr2.length)
    const padZeroes = (arr, desiredLength) => { 
        const arrOut = [...arr]
        if (arrOut.length < desiredLength) { arrOut.push(0) }
        return arrOut
    }
    const arr1Padded = padZeroes(arr1, longestLength)
    const arr2Padded = padZeroes(arr2, longestLength)
    const sumOfArrays = arr1Padded.map((val, i) => val + arr2Padded[i])
    return arrs.length > 2 ? addArrays(sumOfArrays, ...[...arrs].splice(2)) : sumOfArrays
}

module.exports = {
    pipe,
    getWeightedAverage,
    addArrays
}