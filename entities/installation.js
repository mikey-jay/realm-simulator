const installationTypes = ['altar', 'harvester', 'reservoir', 'maker']

function create(type, buildTime = 0) {
    if (!installationTypes.includes(type)) throw new Error(`invalid installation type: ${type}`)
    return { type, buildTimeRemaining: buildTime, level: 0, buildLevel: 1 }
}

function addBuildTime (installationIn, blockCount) {
    const installationOut = structuredClone(installationIn)
    installationOut.buildTimeRemaining += blockCount
    return installationOut
}

function addLevel (installationIn) {
    const installationOut = structuredClone(installationIn)
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