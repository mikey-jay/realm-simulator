const installationTypes = ['altar', 'harvester', 'reservoir', 'maker']

function create(type, buildTime = 0) {
    if (!installationTypes.includes(type)) throw new Error('invalid installation type')
    return { type, buildTimeRemaining: buildTime, level: 1 }
}

function addBuildTime (installationIn, blockCount) {
    const installationOut = {...installationIn}
    installationOut.buildTimeRemaining += blockCount
    return installationOut
}

function addLevel (installationIn) {
    const installationOut = {...installationIn}
    installationOut.level += 1
    return installationOut
}

function removeBuildTime (installationIn, blockCount) {
    return addBuildTime (installationIn, -1 * blockCount)
}

module.exports = {
    create,
    addBuildTime,
    removeBuildTime,
    addLevel,
    installationTypes
}