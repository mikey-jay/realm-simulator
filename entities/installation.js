const installationTypes = ['altar', 'harvester', 'reservoir', 'maker']

function create(type, timeComplete = 0) {
    if (!installationTypes.includes(type)) throw new Error(`invalid installation type: ${type}`)
    return { type, timeComplete, level: 0, buildLevel: 1 }
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
    removeBuildTime,
    addLevel,
    installationTypes
}