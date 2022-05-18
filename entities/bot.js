const Player = require("./player")

function create (strategyName) {
    return { ...Player.create(), strategyName }
}

module.exports = {
    ...Player,
    create
}