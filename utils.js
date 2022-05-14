function pipe(input, ...args) {
    if (args.length == 0) return input
    const [func, ...params] = Array.isArray(args[0]) ? args.shift() : [args.shift(), []]
    if (typeof func != 'function') throw new Error ('Each pipe argument after the first argument should either be a function or an array with a function as the first element')
    return pipe(func(input, ...params), ...args)
}

module.exports = {
    pipe
}