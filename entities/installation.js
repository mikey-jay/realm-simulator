function create(type, timeComplete = 0) {
    return { type, timeComplete, level: 0, buildLevel: 0 }
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
}