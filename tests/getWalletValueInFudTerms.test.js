const test = require('tape');
const Wallet = require('../entities/wallet.js');
const { getWalletValueInFudTerms } = require('../use_cases/getWalletValueInFudTerms');
const { pipe } = require('../utils.js')

test('getWalletValueInFudTerms', (t) => {

    const tokenSupply = { fud: 10, fomo: 5, alpha: 2.5, kek: 1 }
    const w = pipe(Wallet.create(), [Wallet.addTokens, { fud: 10, fomo: 0, alpha: 0, kek: 0 }])
    t.equals(getWalletValueInFudTerms(w, tokenSupply), 10)
    const w2 = pipe(Wallet.create(), [Wallet.addTokens, { fud: 10, fomo: 5, alpha: 0, kek: 0 }])
    t.equals(getWalletValueInFudTerms(w2, tokenSupply), 20)
    const w3 = pipe(Wallet.create(), [Wallet.addTokens, { fud: 10, fomo: 5, alpha: 5, kek: 2 }])
    t.equals(getWalletValueInFudTerms(w3, tokenSupply), 60)
    const w4 = pipe(Wallet.create(), [Wallet.addTokens, { fomo: 4 }])
    t.equals(getWalletValueInFudTerms(w4, tokenSupply), 8)
    t.end()
})