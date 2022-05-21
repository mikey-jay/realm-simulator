const expandHorizontal = require('./expandHorizontal.js')

module.exports = (verseIn, playerIndex, parcelIndex, tokensToFarm = ['fud', 'fomo', 'alpha', 'kek']) => expandHorizontal(verseIn, playerIndex, parcelIndex, tokensToFarm, true)