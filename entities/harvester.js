const Installation = require('./installation.js')

function create(token) {
    return { token, ...Installation.create('harvester') }
}

module.exports = {
    create
}