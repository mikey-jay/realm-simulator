const Installation = require('./installation.js')

function create() {
    return Installation.create('altar')
}

module.exports = {
    create,
    addBuildTime: Installation.addBuildTime,
    removeBuildTime: Installation.removeBuildTime,
    addLevel: Installation.addLevel
}