const Installation = require('./installation.js')

function create(resourceToken) {
    return { resourceToken, ...Installation.create(`harvester_${resourceToken}`, 'harvester') }
}

module.exports = {
    create
}