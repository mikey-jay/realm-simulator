const test = require('tape');
const Bot = require('../entities/bot.js')
const Wallet = require('../entities/wallet.js') 

test('Bot.create', (t) => {
    const bot = Bot.create('strategy name')
    t.equals(bot.strategyName, 'strategy name', 'bot has a strategy')
    t.end()
})

