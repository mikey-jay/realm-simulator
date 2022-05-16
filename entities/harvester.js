const Installation = require('./installation.js')

function create(resourceToken) {
    return { resourceToken, ...Installation.create(`harvester_${resourceToken}`) }
}

module.exports = {
    create
}