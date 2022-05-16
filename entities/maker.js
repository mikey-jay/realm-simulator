const Installation = require('./installation.js')

function create() {
    return Installation.create('maker')
}

module.exports = {
    ...Installation,
    create
}