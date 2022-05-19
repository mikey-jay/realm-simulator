const test = require('tape');
const Utils = require('../utils.js')

test('Utils.pipe', (t) => {
    const add = (x, y) => x + y
    const subtract = (x, y) => x - y
    const multiply = (x, y) => x * y
    const divide = (x, y) => x / y

    const result = Utils.pipe(15, [add, 27], [subtract, 5], [multiply, 62], [divide, 8])
    t.equal( result, (((15 + 27) - 5) * 62) / 8, 'pipe works with single parameter' )

    const addThenMultiply = (x, y, z) => (x + y) * z
    const result2 = Utils.pipe(0, [add, 33], [multiply, 4], [subtract, 6])
    const result3 = Utils.pipe(0, [addThenMultiply, 33, 4], [subtract, 6])
    t.equal(result2, result3, 'pipe works with array for multiple paramaters')

    const addFive = (x) => x + 5
    t.equal(Utils.pipe(3, addFive, [subtract, 1]), 3 + 5 - 1, 'pipe works with func passed without params')
    t.end();
});

test('Utils.getWeightedAverage', (t) => {
    t.throws(() => Utils.getWeightedAverage([1,2,3],[1,2]), 'throws if weights and dataset are different lengths')
    t.equals(Utils.getWeightedAverage([1,2,3],[1,1,1]), 2, 'equal weights average is the same as usual')
    t.equals(Utils.getWeightedAverage([1,1.15,2],[20000,15000,5000]), 47250 / 40000, 'different weights produce weighted average')
    t.end()
});

test('Utils.addArrays', (t) => {
    t.deepEquals(Utils.addArrays([1],[3]), [4], 'single element returns single element with elements added')
    t.deepEquals(Utils.addArrays([1,2],[3,4]), [4,6], 'single element returns single element with elements added')
    t.equals(Utils.addArrays([1,2],[3,4,5]).length, 3, 'arrays of different length return array of longest length with missing element being zero')
    t.deepEquals(Utils.addArrays([1,2],[3,4,5]), [4,6,5], 'arrays of different length return array of longest length with elements added')
    t.deepEquals(Utils.addArrays([1,2],[3,4,5],[6,7]), [10,13,5], 'add 3 arrays returns the sum of all 3')
    t.deepEquals(Utils.addArrays([1,2],[6,7],[3,4,5]), [10,13,5], 'changing the order gives the same result')
    t.end()
})

test('Utils.addObjectKeys', (t) => {
    t.deepEquals(Utils.addObjectKeys({'a': 1},{'a': 2}), {'a': 3}, 'single key returns sum of the two objects')
    t.deepEquals(Utils.addObjectKeys({'a': 1},{'b': 2}), {'a': 1, 'b': 2}, 'different keys returns sum of the two objects')
    t.deepEquals(Utils.addObjectKeys({'a': [1,2]},{'a': [3,4]}), {'a': [4,6] }, 'if values are arrays, add the arrays')
    t.deepEquals(Utils.addObjectKeys({'a': {'a': 7 }, 'b': 1 },{'a': {'a': 5, 'b': 1 }, 'b': 2, 'c': {'a': 2} }), {'a': {'a': 12, 'b': 1 }, 'b': 3, 'c': {'a': 2} }, 'different keys and subkeys returns subtraction of the two objects')
    t.end()
})

test('Utils.subtractObjectKeys', (t) => {
    t.deepEquals(Utils.subtractObjectKeys({'a': 1},{'a': 2}), {'a': -1}, 'single key returns subtraction of the two objects')
    t.deepEquals(Utils.subtractObjectKeys({'a': 1},{'b': 2}), {'a': 1, 'b': -2}, 'different keys returns subtraction of the two objects')
    t.end()
})
