const test = require('tape');
const Wallet = require('../entities/wallet.js')

 

test('Wallet.addTokens, Wallet.removeTokens', (t) => {
    const w = Wallet.create()
    const tokens = { token1: 10, token2: 20 }
    const noTokens = { token1: 0, token2: 0 }
    const w2 = Wallet.addTokens(w, tokens)
    t.deepEqual(w2.tokens, tokens, 'all tokens were added')
    t.deepEqual(Wallet.removeTokens(w2, tokens).tokens, noTokens, 'all tokens were removed')
    t.deepEqual(w2.tokens, tokens, 'no side effects')
    t.end()
})