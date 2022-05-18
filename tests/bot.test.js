const test = require('tape');
const Bot = require('../entities/bot.js')
const Wallet = require('../entities/wallet.js') 

test('Bot.create', (t) => {
    const strategy = () => 12345
    const bot = Bot.create(strategy)
    t.equals(bot.strategy(), strategy(), 'bot has a strategy')
    t.deepEquals(bot.walletStart, Wallet.create(), 'bot has a strategy')
    t.end()
})

