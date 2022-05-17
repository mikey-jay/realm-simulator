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
