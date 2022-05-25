function pipe(input, ...args) {
    if (args.length == 0) return input
    const [func, ...params] = Array.isArray(args[0]) ? args.shift() : [args.shift(), []]
    if (typeof func != 'function') throw new Error ('Each pipe argument after the first argument should either be a function or an array with a function as the first element')
    return pipe(func(input, ...params), ...args)
}

const sumArray = (arr) => arr.reduce((total, item) => total + item, 0)

function getWeightedAverage(dataset, weights) {
    if (dataset.length !== weights.length) throw new Error('Cannot get weighted average - dataset and weights must be arrays of the same length')
    let weightedDataset = []
    for (let i = 0 ; i < dataset.length ; i++) {
        weightedDataset.push(dataset[i] * weights[i])
    }
    return sumArray(weightedDataset) / sumArray(weights)
}

function addArrays(...arrs) {
    let arr1 = Array.isArray(arrs[0]) ? [...arrs[0]] : []
    let arr2 = Array.isArray(arrs[1]) ? [...arrs[1]] : []
    const longestLength = Math.max(arr1.length, arr2.length)
    const padZeroes = (arr, desiredLength) => { 
        const arrOut = [...arr]
        while (arrOut.length < desiredLength) { arrOut.push(0) }
        return arrOut
    }
    const arr1Padded = padZeroes(arr1, longestLength)
    const arr2Padded = padZeroes(arr2, longestLength)
    const sumOfArrays = arr1Padded.map((val, i) => val + arr2Padded[i])
    return arrs.length > 2 ? addArrays(sumOfArrays, ...[...arrs].splice(2)) : sumOfArrays
}

function addObjectKeys (obj1, obj2, subtract = false) {
    let objOut = {...obj1, ...obj2}
    for (let key in objOut) {
        const treatAsArray = Array.isArray(obj1[key]) || Array.isArray(obj2[key])
        const treatAsObject = !treatAsArray && ((typeof obj1[key] == 'object') || (typeof obj2[key] == 'object'))
        const defaultValue = treatAsArray ? [] : treatAsObject ? {} : 0
        val1 = Object.keys(obj1).includes(key) ? obj1[key] : defaultValue
        val2 = Object.keys(obj2).includes(key) ? obj2[key] : defaultValue
        if (treatAsArray) {
            objOut[key] = subtract ? addArrays(val1, val2.map((v) => v * -1)) : addArrays(val1, val2)
        }
        else if (treatAsObject) {
            objOut[key] = addObjectKeys(val1, val2, subtract)
        }
        else {
            objOut[key] = subtract ? val1 - val2 : val1 + val2
        }
    }
    return objOut
}

function subtractObjectKeys (fromObj, subtractObj) {
    return addObjectKeys(fromObj, subtractObj, true)
}

module.exports = {
    pipe,
    getWeightedAverage,
    addArrays,
    addObjectKeys,
    subtractObjectKeys,
    sumArray
}