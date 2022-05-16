const Installation = require('./installation.js')

function create(resourceToken) {
    return { resourceToken, ...Installation.create('harvester') }
}

module.exports = {
    create
}