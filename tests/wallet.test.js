const test = require('tape');
const Wallet = require('../entities/wallet.js')
const {pipe} = require('../utils.js')
 

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

test('Wallet.hasSufficientTokens', (t) => {
    const w = pipe(Wallet.create(), [ Wallet.addTokens, { fud: 1, fomo: 2, alpha: 3, kek: 4 } ])
    t.true(Wallet.hasSufficientTokens(w, { fud: 1, fomo: 2, alpha: 3, kek: 4 }), 'exact change')
    t.true(Wallet.hasSufficientTokens(w, { fud: 1, fomo: 1, alpha: 1, kek: 1 }), 'plenty')
    t.false(Wallet.hasSufficientTokens(w, { fud: 2, fomo: 1, alpha: 1, kek: 1 }), 'not enough fud')
    t.false(Wallet.hasSufficientTokens(w, { fud: 1, fomo: 2, alpha: 3, kek: 4, ghst: 1 }), 'missing ghst')
    t.end()
})