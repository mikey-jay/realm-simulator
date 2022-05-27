function create(type, installationClass, timeComplete = 0) {
    return { type, class: (installationClass || type), timeComplete, level: 0, buildLevel: 0, width: 4, height: 4 }
}

function addLevel (installationIn) {
    const installationOut = structuredClone(installationIn)
    installationOut.level += 1
    installationOut.buildLevel = installationOut.level
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