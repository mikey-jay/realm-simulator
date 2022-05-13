
function create(fromFilename) {
    return require(`../rulesets/${fromFilename}`)
}

module.exports = { create }